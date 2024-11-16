import React, { useEffect, useState } from 'react';
import { IonPage } from '@ionic/react';
import LoginPage from '../components/LoginPage';
import LayoutPage from '../components/LayoutPage';

const Tab1: React.FC = () => {

  return (
    <IonPage>
      <LayoutPage>
        <LoginPage />
      </LayoutPage>
    </IonPage>
  );
};

export default Tab1;
