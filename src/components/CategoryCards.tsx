import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { IonCard, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, IonImg, IonContent } from '@ionic/react';
import './CategoryCards.css';

interface Category {
  categoriaId: number;
  categoria: string;
}

interface Product {
  categoriaId: number;
  imagen: string;
}

const CategoryCards: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryImages, setCategoryImages] = useState<{ [key: number]: string }>({});
  const history = useHistory();

  useEffect(() => {
    axios.get('https://backend-c-r-production.up.railway.app/products/categories/getAll')
      .then(response => {
        const fetchedCategories = response.data;
        setCategories(fetchedCategories);
        fetchedCategories.forEach((category: Category) => {
          getFirstProductImage(category.categoriaId);
        });
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const getFirstProductImage = (categoriaId: number) => {
    axios.get('https://backend-c-r-production.up.railway.app/products/')
      .then(response => {
        const products = response.data;
        const product = products.find((p: Product) => p.categoriaId === categoriaId);
        if (product) {
          setCategoryImages(prevState => ({
            ...prevState,
            [categoriaId]: product.imagen
          }));
        }
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  };

  const handleCategoryClick = (categoriaId: number) => {
    history.push(`/products/categoria/${categoriaId}`);
  };

  return (
    <IonContent>
      <IonGrid>
        <IonRow>
          {categories.map(category => (
            <IonCol size="6" sizeMd="3" key={category.categoriaId}>
              <IonCard className="square-card" onClick={() => handleCategoryClick(category.categoriaId)}>
                {categoryImages[category.categoriaId] && (
                  <IonImg src={categoryImages[category.categoriaId]} alt={category.categoria} />
                )}
                <IonCardHeader>
                  <IonCardTitle>{category.categoria}</IonCardTitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default CategoryCards;
    