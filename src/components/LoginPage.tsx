// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { IonContent, IonInput, IonButton, IonToast, IonPage, IonLabel, IonImg, IonHeader, IonTitle, IonToolbar, IonInputPasswordToggle, IonRow, IonRouterLink } from '@ionic/react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://backend-c-r-production.up.railway.app/users/login', {
        correo,
        contraseña
      });

      if (response.status === 200) {
        const token = response.data.token;
        login(token);
        setToastMessage(response.data.message);

        setTimeout(() => {
          setShowToast(false);
          history.push('/');
        }, 3000);
      }
    } catch (error: any) {
      if (error.response) {
        setToastMessage(error.response.data.error);
      } else {
        setToastMessage('Error desconocido. Inténtalo más tarde.');
      }
    } finally {
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="login-title">Iniciar Sesión</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <div className="login-container">
          <IonImg src="/assets/Images/Chucherias.png" alt="ChucheriasRegalos" className="login-image" />


          <IonLabel><strong>Correo electronico:</strong></IonLabel>
          <IonInput
            id="email-input"
            placeholder="Ingrese su correo"
            value={correo}
            onIonChange={(e) => setCorreo(e.detail.value!)}
            className="login-input"
            clearInput
          />

          <IonLabel><strong>Contraseña:</strong></IonLabel>
          <IonInput
            id="password-input"
            type="password"
            placeholder="Ingrese su contraseña"
            value={contraseña}
            onIonChange={(e) => setContraseña(e.detail.value!)}
            className="login-input"
          >
            <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
          </IonInput>

          <IonButton expand="block" onClick={handleLogin} className="login-button">
            Iniciar Sesión
          </IonButton>

          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={3000}
            position="top"
            color="primary"
          />

          <IonRow className='text-center'>
            <IonLabel>¿Olvido su contraseña?</IonLabel><br/>
            <IonRouterLink routerLink="/forgot-password">Recuperar contraseña</IonRouterLink>
          </IonRow>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;