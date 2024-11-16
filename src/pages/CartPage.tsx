import React, { useState } from 'react';
import {
  IonPage, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonText, IonFooter, IonThumbnail, IonSpinner, IonChip,
  IonHeader, IonAlert, IonCard, IonCardContent, IonGrid
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { addCircleOutline, removeCircleOutline, trashOutline, cartOutline } from 'ionicons/icons'; // cartOutline agregado
import LayoutPage from '../components/LayoutPage';
import { useCart } from '../contexts/CartContext';
import './CartPage.css';

const CartPage: React.FC = () => {
  const { cart, updateItem, removeItem, clearCart, isLoading } = useCart();
  const history = useHistory();
  const [showAlert, setShowAlert] = useState(false); // Estado para manejar la alerta

  // Función para incrementar la cantidad
  const increaseQuantity = (productoId: number, cantidad: number) => {
    updateItem(productoId, cantidad + 1);
  };

  // Función para decrementar la cantidad
  const decreaseQuantity = (productoId: number, cantidad: number) => {
    if (cantidad > 1) {
      updateItem(productoId, cantidad - 1);
    }
  };

  // Función para calcular el total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2);
  };

  // Función para calcular el total
  const calculateIva = () => {
    return cart.reduce((total, item) => total + item.IVA * item.cantidad, 0).toFixed(2);
  };

  const handleProductClick = (productId: number) => {
    history.push(`/product/${productId}`);
  };

  // Función para manejar el vaciado del carrito con confirmación
  const handleClearCart = () => {
    setShowAlert(true); // Mostrar la alerta
  };

  const confirmClearCart = () => {
    clearCart(); // Vaciar el carrito si se confirma
    setShowAlert(false); // Cerrar la alerta
  };

  if (isLoading) {
    return (
      <IonPage>
        <LayoutPage>
          <IonContent>
            <IonSpinner name="crescent" />
          </IonContent>
        </LayoutPage>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <LayoutPage>
        <IonHeader className='content-header'>
          <IonChip outline={true} className='margin-top'>Carrito de compras</IonChip>
          {/* El botón está deshabilitado si el carrito está vacío */}
          <IonButton color="danger" onClick={handleClearCart} disabled={cart.length === 0}>
            Vaciar carrito
          </IonButton>
        </IonHeader>

        {/* Alerta de confirmación */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Confirmar'}
          message={'¿Estás seguro de que deseas vaciar el carrito?'}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => setShowAlert(false)
            },
            {
              text: 'Aceptar',
              handler: confirmClearCart
            }
          ]}
        />

        <IonContent className='cart-content'>
          {cart.length > 0 ? (
            <IonList>
              {cart.map((item) => (
                <IonItem key={item.productoId} className='item-list'>
                  {/* Mostrar imagen del producto */}
                  <IonThumbnail slot="start" onClick={() => handleProductClick(item.productoId)}>
                    <img src={item.imagen} alt={`Imagen de ${item.producto}`} className='img-cart'/>
                  </IonThumbnail>

                  <IonLabel onClick={() => handleProductClick(item.productoId)}>
                    <h2>{item.producto}</h2>
                    <p>Precio: ${(item.precio * item.cantidad).toFixed(2)}</p>
                  </IonLabel>

                  <div className="quantity-controls">
                    <IonButton onClick={() => decreaseQuantity(item.productoId, item.cantidad)} disabled={item.cantidad <= 1}>
                      <IonIcon icon={removeCircleOutline} />
                    </IonButton>
                    <IonText>{item.cantidad}</IonText>
                    <IonButton onClick={() => increaseQuantity(item.productoId, item.cantidad)}>
                      <IonIcon icon={addCircleOutline} />
                    </IonButton>
                  </div>

                  <IonButton color="danger" onClick={() => removeItem(item.productoId)}>
                    <IonIcon icon={trashOutline} />
                  </IonButton>
                </IonItem>
              ))}
            </IonList>
          ) : (
            <div className="empty-cart">
              <IonIcon icon={cartOutline} size="large" className="empty-cart-icon" />
              <IonText>
                <h2>Tu carrito está vacío</h2>
              </IonText>
            </div>
          )}
        </IonContent>

        {/* Footer con el total */}
        {cart.length > 0 && (
          <IonFooter>
          <IonCard className="total-card">
            <IonCardContent>
              <div className="total-container">
                <IonText className="total-text">
                  <h2><strong>Total</strong></h2>
                </IonText>
                <IonText className="total-price">
                  <h2><strong>${calculateTotal()}</strong></h2>
                </IonText>
              </div>
              <div className="total-container">
                <IonText className="total-text">
                  <h2>IVA incluido</h2>
                </IonText>
                <IonText className="total-price">
                  <h2>${calculateIva()}</h2>
                </IonText>
              </div>
              <IonButton expand="block" color="primary" routerLink='/select-address'>
                Continuar
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonFooter>
        
        
        )}
      </LayoutPage>
    </IonPage>
  );
};

export default CartPage;
