import React, { useState } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonSearchbar, IonIcon, IonRouterLink, IonBadge, IonToast } from '@ionic/react';
import { cartOutline } from 'ionicons/icons';
import './LayoutPage.css';
import './CustomMenu.css';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

interface LayoutPageProps {
  children: React.ReactNode;
}

const LayoutPage: React.FC<LayoutPageProps> = ({ children }) => {
  const { cart } = useCart();
  const { user } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const history = useHistory(); // Usar el hook de history

  const handleCartClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setShowToast(true);
    }
  };

  const handleSearch = (searchTerm: string) => {
    // Redirigir a la página de búsqueda con el término ingresado
    history.push(`/search/${encodeURIComponent(searchTerm)}`);
  };

  return (
    <>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar className="custom-toolbar">
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonSearchbar 
              placeholder="Buscar productos" 
              animated={true} 
              onKeyPress={(e) => {
                if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim() !== '') {
                  handleSearch((e.target as HTMLInputElement).value);
                }
              }} 
            />
            <IonButtons slot='end' className='icon-container'>
              <IonRouterLink routerLink="/cart" color={'dark'} onClick={handleCartClick}>
                <IonIcon className='icon-header' icon={cartOutline} />
                {totalItems > 0 && (
                  <IonBadge color="danger" className="cart-badge">
                    {totalItems}
                  </IonBadge>
                )}
              </IonRouterLink>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {children}
        </IonContent>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Para continuar, debes iniciar sesión."
          duration={2000}
          position="top"
          color="warning"
        />
      </IonPage>
    </>
  );
}

export default LayoutPage;
