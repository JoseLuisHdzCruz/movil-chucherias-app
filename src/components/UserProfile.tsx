import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonText, IonAvatar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonButton, IonItem, IonLabel, IonInput, IonSpinner, IonToast } from '@ionic/react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css'

const UserProfile: React.FC = () => {
  const { user } = useAuth(); // Obtener el usuario y el token del contexto
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`https://backend-c-r-production.up.railway.app/users/${user?.customerId}`);
        setUserData(response.data); // Guardar los datos del usuario obtenidos
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]); // Guardar el archivo seleccionado
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('imagen', selectedFile); // Añadir el archivo de imagen al FormData

    try {
      await axios.put(`https://backend-c-r-production.up.railway.app/users/banner/${user?.customerId}`, formData);
      setShowToast(true); // Mostrar confirmación de éxito
    } catch (error) {
      console.error('Error updating user banner:', error);
    }
  };

  if (loading) {
    return <IonSpinner name="dots" />;
  }

  if (!userData) {
    return <p>Error al cargar el perfil de usuario.</p>;
  }

  return (
    <IonContent>
      <IonCard>
        <IonCardHeader class='content'>
          <IonCardTitle>{user?.nombre} {user?.aPaterno} {user?.aMaterno}</IonCardTitle>
          <IonAvatar className='banner'>
        <img src={userData.imagen || '/assets/Images/user.jpg'} alt="Foto del Usuario" />
      </IonAvatar>
        </IonCardHeader>
        <IonCardContent>
          {/* Inputs deshabilitados con la información del usuario */}
          <IonItem>
            <IonLabel position="stacked">Nombre</IonLabel>
            <IonInput value={userData.nombre} disabled />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Correo</IonLabel>
            <IonInput value={userData.correo} disabled />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Teléfono</IonLabel>
            <IonInput value={userData.telefono || 'No especificado'} disabled />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Dirección</IonLabel>
            <IonInput value={userData.direccion || 'No especificada'} disabled />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Fecha de Registro</IonLabel>
            <IonInput value={new Date(userData.createdAt).toLocaleDateString()} disabled />
          </IonItem>

          {/* Selector de archivo para cambiar el banner */}
          <IonItem>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </IonItem>

          <IonButton expand="block" onClick={handleImageUpload} disabled={!selectedFile}>
            Cambiar imagen de perfil
          </IonButton>
        </IonCardContent>
      </IonCard>

      {/* Toast de confirmación */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="Imagen actualizada con éxito"
        duration={2000}
      />
    </IonContent>
  );
};

export default UserProfile;
