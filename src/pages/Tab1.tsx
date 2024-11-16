import React, { useEffect, useState } from 'react';
import { IonPage } from '@ionic/react';
import axios from 'axios';
import ListaProductosHome from '../components/ListaProductosHome';
import LayoutPage from '../components/LayoutPage';

const Tab1: React.FC = () => {
  const [productos, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://backend-c-r-production.up.railway.app/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <IonPage>
      <LayoutPage>
        <ListaProductosHome />
      </LayoutPage>
    </IonPage>
  );
};

export default Tab1;
