// CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface CartItem {
  productoId: number;
  producto: string;
  precio: number;
  cantidad: number;
  imagen: string;
  IVA: number;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (producto: CartItem) => void;
  updateItem: (productoId: number, cantidad: number) => void;
  removeItem: (productoId: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode; value?: CartContextType }> = ({ children, value }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(value?.cart || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.customerId && !value) {
      loadCart(user.customerId);
    }
  }, [user, value]);

  const loadCart = async (customerId: number) => {
    setIsLoading(true);
    try {
      const storedCart = localStorage.getItem('cart');
      const localCart = storedCart ? JSON.parse(storedCart) : [];

      const { data } = await axios.get(`https://backend-c-r-production.up.railway.app/cart/${customerId}`);
      const combinedCart = mergeCarts(localCart, data);

      setCart(combinedCart);
      localStorage.setItem('cart', JSON.stringify(combinedCart));
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const mergeCarts = (localCart: CartItem[], apiCart: CartItem[]) => {
    const combinedCart = [...localCart];
    apiCart.forEach(apiItem => {
      const index = combinedCart.findIndex(item => item.productoId === apiItem.productoId);
      if (index > -1) {
        combinedCart[index].cantidad = apiItem.cantidad;
      } else {
        combinedCart.push(apiItem);
      }
    });
    return combinedCart;
  };

  const addItem = async (producto: CartItem) => {
    if (user?.customerId) {
      try {
        const existingProductIndex = cart.findIndex(item => item.productoId === producto.productoId);
        let updatedCart;

        if (existingProductIndex > -1) {
          const existingProduct = cart[existingProductIndex];
          const newQuantity = existingProduct.cantidad + producto.cantidad;

          updatedCart = cart.map((item, index) =>
            index === existingProductIndex ? { ...item, cantidad: newQuantity } : item
          );

          await updateItem(producto.productoId, newQuantity);
        } else {
          updatedCart = [...cart, producto];
          const cartItemWithCustomer = { customerId: user.customerId, ...producto };
          await axios.post('https://backend-c-r-production.up.railway.app/cart/', cartItemWithCustomer);
        }

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  };

  const updateItem = async (productoId: number, cantidad: number) => {
    if (user?.customerId) {
      try {
        const updatedCart = cart.map(item => (item.productoId === productoId ? { ...item, cantidad } : item));
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        await axios.put(`https://backend-c-r-production.up.railway.app/cart/${user.customerId}/${productoId}`, { cantidad });
      } catch (error) {
        console.error('Error updating item:', error);
      }
    }
  };

  const removeItem = async (productoId: number) => {
    if (user?.customerId) {
      try {
        const updatedCart = cart.filter(item => item.productoId !== productoId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        await axios.delete(`https://backend-c-r-production.up.railway.app/cart/`, { data: { productoId, customerId: user.customerId } });
      } catch (error) {
        console.error('Error removing item:', error);
      }
    }
  };

  const clearCart = async () => {
    if (user?.customerId) {
      try {
        setCart([]);
        localStorage.removeItem('cart');
        await axios.delete(`https://backend-c-r-production.up.railway.app/cart/clear/${user.customerId}`);
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cart, addItem, updateItem, removeItem, clearCart, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
