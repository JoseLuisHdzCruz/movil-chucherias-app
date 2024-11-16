import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonButton, IonFooter, IonRouterLink, useIonToast
} from '@ionic/react';
import axios from 'axios';
import LayoutPage from '../components/LayoutPage';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import "./NewAddress.css"

const NewAddress: React.FC = () => {
  const { user } = useAuth();
  const [nombre, setNombre] = useState<string>('');
  const [calle, setCalle] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [referencias, setReferencias] = useState<string>('');
  const [cp, setCp] = useState<string>('');
  const [estado, setEstado] = useState<string>('');
  const [municipio, setMunicipio] = useState<string>('');
  const [colonia, setColonia] = useState<string>('');
  const [numExterior, setNumExterior] = useState<string>('');
  const [estados, setEstados] = useState<string[]>([]);
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [colonias, setColonias] = useState<string[]>([]);
  const [isEstadoDisabled, setIsEstadoDisabled] = useState<boolean>(true);
  const [isMunicipioDisabled, setIsMunicipioDisabled] = useState<boolean>(true);
  const [isColoniaDisabled, setIsColoniaDisabled] = useState<boolean>(true);
  const [presentToast] = useIonToast();
  const history = useHistory();
  // Variable para almacenar el customerId
  const [customerId, setCustomerId] = useState<number | null>(null);

  useEffect(() => {
    // Actualiza el customerId cuando el usuario cambie
    setCustomerId(user?.customerId || null);
  }, [user]);

  interface AddressData {
    id: number;
    colonia: string;
    codigo_postal: string;
    estado: string;
    municipio: string;
  }

  const fetchAddressData = async (codigo: string) => {
    if (!codigo) return;
  
    try {
      const response = await axios.get(`https://backend-c-r-production.up.railway.app/address/get-colonias/${codigo}`);
      const data: AddressData[] = response.data;
      console.log("Datos recibidos", data);
  
      if (data) {
        const estados = [...new Set(data.map((item: AddressData) => item.estado))];
        const municipios = [...new Set(data.map((item: AddressData) => item.municipio))];
        const colonias = [...new Set(data.map((item: AddressData) => item.colonia))];
  
        setEstados(estados);
        setMunicipios(municipios);
        setColonias(colonias);
  
        setIsEstadoDisabled(estados.length === 0);
        setIsMunicipioDisabled(municipios.length === 0);
        setIsColoniaDisabled(colonias.length === 0);
      }
    } catch (error: any) {
      console.error('Error al obtener los datos de la dirección:', error);
      presentToast({
        message: 'No se pudo obtener la información del código postal.',
        duration: 2000,
        color: 'danger',
      });
    }
  };

  const handleSaveAddress = async () => {
    if (!nombre || !calle || !telefono || !cp || !estado || !municipio || !colonia || !numExterior) {
      presentToast({
        message: 'Por favor, complete todos los campos.',
        duration: 2000,
        color: 'warning',
      });
      return;
    }

    try {

      const response = await axios.post('https://backend-c-r-production.up.railway.app/address/add-domicilio', {
        customerId: customerId,
        Nombre: nombre,
        Calle: calle,
        Telefono: telefono,
        Referencias: referencias,
        CP: cp,
        Estado: estado,
        Ciudad: municipio,
        Colonia: colonia,
        NumExterior: numExterior,
      });

      console.log('Respuesta del servidor:', response);

      if (response.status === 200 || response.status === 201) {
        await presentToast({
          message: 'Dirección guardada correctamente.',
          duration: 2000,
          color: 'success',
        });
        
        // Espera un momento antes de redirigir
        setTimeout(() => {
          history.push('/select-address');
        }, 2100);
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error: any) {
      console.error('Error completo:', error);
      const errorMessage = error.response?.data?.message || 'Error al guardar la dirección. Inténtelo nuevamente.';
      presentToast({
        message: errorMessage,
        duration: 2000,
        color: 'danger',
      });
    }
  };

  return (
    <IonPage>
      <LayoutPage>
        <IonContent className="new-address-content">
          <div className="container">
            <h3 className="form-title">Agregar nueva dirección</h3>

            <IonItem className="form-item">
              <IonLabel position="floating" className="label">
                Nombre
              </IonLabel>
              <IonInput
                value={nombre}
                onIonChange={(e) => setNombre(e.detail.value!)}
                required
                className="input-field"
              />
            </IonItem>

            <IonItem className="form-item">
              <IonLabel position="floating" className="label">
                Calle
              </IonLabel>
              <IonInput
                value={calle}
                onIonChange={(e) => setCalle(e.detail.value!)}
                required
                className="input-field"
              />
            </IonItem>

            <IonItem className="form-item">
              <IonLabel position="floating" className="label">
                Teléfono
              </IonLabel>
              <IonInput
                value={telefono}
                onIonChange={(e) => setTelefono(e.detail.value!)}
                type="tel"
                required
                className="input-field"
              />
            </IonItem>

            <IonItem className="form-item">
              <IonLabel position="floating" className="label">
                Referencias
              </IonLabel>
              <IonInput
                value={referencias}
                onIonChange={(e) => setReferencias(e.detail.value!)}
                className="input-field"
              />
            </IonItem>

            <IonItem className="form-item">
              <IonLabel position="floating" className="label">
                Número Exterior
              </IonLabel>
              <IonInput
                value={numExterior}
                onIonChange={(e) => setNumExterior(e.detail.value!)}
                required
                className="input-field"
              />
            </IonItem>

            <IonItem className="form-item">
              <IonLabel position="floating" className="label">
                Código Postal
              </IonLabel>
              <IonInput
                value={cp}
                onIonChange={(e) => {
                  const postalCode = e.detail.value!;
                  setCp(postalCode);
                  fetchAddressData(postalCode);
                }}
                type="number"
                required
                className="input-field"
              />
            </IonItem>

            <IonItem className="form-item">
              <IonLabel className="label">Estado</IonLabel>
              <IonSelect
                value={estado}
                onIonChange={(e) => setEstado(e.detail.value!)}
                disabled={isEstadoDisabled}
                className="input-field"
              >
                {estados.map((estado, index) => (
                  <IonSelectOption key={index} value={estado}>
                    {estado}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem className="form-item">
              <IonLabel className="label">Municipio</IonLabel>
              <IonSelect
                value={municipio}
                onIonChange={(e) => setMunicipio(e.detail.value!)}
                disabled={isMunicipioDisabled}
                className="input-field"
              >
                {municipios.map((municipio, index) => (
                  <IonSelectOption key={index} value={municipio}>
                    {municipio}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem className="form-item">
              <IonLabel className="label">Colonia</IonLabel>
              <IonSelect
                value={colonia}
                onIonChange={(e) => setColonia(e.detail.value!)}
                disabled={isColoniaDisabled}
                className="input-field"
              >
                {colonias.map((colonia, index) => (
                  <IonSelectOption key={index} value={colonia}>
                    {colonia}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonButton
              expand="full"
              onClick={handleSaveAddress}
              className="submit-btn"
            >
              Guardar Dirección
            </IonButton>
          </div>
        </IonContent>

        <IonFooter>
          <div className="footer">
            <IonRouterLink href="/select-address" className="cancel-link">
              Cancelar
            </IonRouterLink>
          </div>
        </IonFooter>
      </LayoutPage>
    </IonPage>
  );
};

export default NewAddress;