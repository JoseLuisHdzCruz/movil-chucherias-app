// ListaProductos.tsx
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './ListaProductos.css';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonRow,
  IonCol,
  IonText,
  IonSpinner,
  IonChip
} from '@ionic/react';
import ProductCarousel from '../components/ProductCarousel'; // Importa el componente del carrusel
import ImageCarousel from './ImageCarousel';

interface Product {
  productoId: number;
  nombre: string;
  descripcion: string;
  precio: number;
  existencia: number;
  descuento: number;
  categoriaId: number;
  statusId: number;
  imagen: string;
  IVA: number;
  precioFinal: number;
  createdAt: string;
  updatedAt: string;
  ranking: number;
}

const ListaProductos: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [carouselProducts, setCarouselProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  // Consumir la API de productos más vendidos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://backend-c-r-production.up.railway.app/products/');
        const data = await response.json();
        setProducts(data);

        // Consumir la API para los productos del carrusel
        const carouselResponse = await fetch('https://backend-c-r-production.up.railway.app/products/productos/mas-vendidos'); // Cambia la URL a la de tu API de carrusel
        const carouselData = await carouselResponse.json();
        setCarouselProducts(carouselData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Función para redirigir a la página de detalles del producto
  const handleProductClick = (productId: number) => {
    history.push(`/product/${productId}`);
  };

  const imageUrls = [
    '/assets/Images/oferta-slider-1.jpg',
    '/assets/Images/oferta-slider-2.jpg',
    '/assets/Images/oferta-slider-3.jpg',
    // Agrega más URLs de imágenes aquí
  ];

  if (loading) {
    return (
      <IonPage className="scroll-container">
        <IonContent>
          <IonSpinner name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className='scroll-container'>
      <IonContent id="container">
        <ImageCarousel images={imageUrls} />

        {/* Agregar el carrusel arriba del listado de productos */}
        <IonChip outline={true} >Productos más vendidos</IonChip>
        {carouselProducts.length > 0 ? (
          <ProductCarousel products={carouselProducts} />
        ) : (
          <IonText color="danger">No hay productos disponibles</IonText>
        )}

        <IonChip outline={true} >Catálogo de productos</IonChip>
        {products.length === 0 ? (
          <IonText color="danger">No hay productos disponibles</IonText>
        ) : (
          products.map((product) => (
            <IonCard key={product.productoId} onClick={() => handleProductClick(product.productoId)}>
              <IonRow>
                <IonCol size="4">
                  <IonImg src={product.imagen} alt={product.nombre} />
                </IonCol>
                <IonCol size="8">
                  <IonCardHeader>
                    <IonCardTitle>{product.nombre}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonText>
                      <p><strong>Precio:</strong> ${product.precioFinal}</p>
                      {product.descuento > 0 && (
                        <p><strong>Descuento:</strong> {product.descuento}%</p>
                      )}
                      <p><strong>Existencia:</strong> {product.existencia}</p>
                      <p><strong>Ranking:</strong> {product.ranking}/5</p>
                    </IonText>
                  </IonCardContent>
                </IonCol>
              </IonRow>
            </IonCard>
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default ListaProductos;
