import React from 'react';
import { useHistory } from 'react-router';
import { IonCard, IonCardContent, IonCardHeader, IonImg, IonGrid, IonRow, IonCol, IonButton, IonText, IonContent } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../../node_modules/swiper/swiper-bundle.min.css';
import '../../node_modules/swiper/swiper.min.css';
import './ProductCarousel.css'

interface Product {
  productoId: number;
  nombre: string;
  descripcion: string;
  precioFinal: number;
  imagen: string;
  ranking: number;
}

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const history = useHistory();

  const handleProductClick = (productId: number) => {
    history.push(`/product/${productId}`);
  };

  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={2} // Ajusta según tu diseño
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
    >
      {products.map((product) => (
        <SwiperSlide key={product.productoId}>
          <IonCard className='card-carrusel' key={product.productoId} onClick={() => handleProductClick(product.productoId)}>
            <IonCardContent className='item-center'>
              <IonImg src={product.imagen} alt={product.nombre} className='img-card' />

            </IonCardContent>
            <IonCardHeader>
              <h4>{product.nombre}</h4>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <p><strong>Precio:</strong> ${product.precioFinal}</p>
                <p><strong>Ranking:</strong> {product.ranking}/5</p>
              </IonText>
            </IonCardContent>
          </IonCard>
        </SwiperSlide>
      ))}
    </Swiper>
    
  );
};

export default ProductCarousel;
