import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonRow, IonCol, IonText, IonChip } from '@ionic/react';
import axios from 'axios';
import LayoutPage from '../components/LayoutPage';
import { useParams, useHistory } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel'; // Asegúrate de que la ruta sea correcta

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

const SearchPage: React.FC = () => {
  const { term } = useParams<{ term: string }>(); // Obtener el término de búsqueda de la URL
  const [products, setProducts] = useState<Product[]>([]);
  const history = useHistory();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post('https://backend-c-r-production.up.railway.app/products/search', { search: term });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [term]); // Dependencia del término de búsqueda

  const handleProductClick = (productId: number) => {
    history.push(`/product/${productId}`);
  };

  const imageUrls = [
    '/assets/Images/oferta-slider-1.jpg',
    '/assets/Images/oferta-slider-2.jpg',
    '/assets/Images/oferta-slider-3.jpg',
  ];

  return (
    <IonPage>
      <LayoutPage>
        <ImageCarousel images={imageUrls} />
        <IonChip outline={true}>Productos encontrados para: "{term}"</IonChip>
        
        {products.length === 0 ? (
          <IonText color="danger">No se encontraron productos.</IonText>
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
      </LayoutPage>
    </IonPage>
  );
};

export default SearchPage;
