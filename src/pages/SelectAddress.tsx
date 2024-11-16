import React, { useContext, useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonRadioGroup, IonRadio, IonList, IonItem, IonLabel, IonFooter, IonRouterLink, IonChip,
  IonIcon, useIonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { cart as cartIcon, home as homeIcon, storefront as storeIcon } from 'ionicons/icons';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import LayoutPage from '../components/LayoutPage';
import './CartPage.css';

interface Domicilio {
  DomicilioId: number;
  Nombre: string;
  Calle: string;
  Telefono: string;
  Referencias: string;
  CP: string;
}

interface Sucursal {
  SucursalId: number;
  Nombre: string;
  Calle: string;
  Telefono: string;
  Horario: string;
}

const SelectAddress: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [envio, setEnvio] = useState<number>(0);
  const { user } = useAuth();
  const [direccionSeleccionada, setDireccionSeleccionada] = useState<number | null>(null);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<number | null>(null);
  const [showDomicilios, setShowDomicilios] = useState(false);
  const [showSucursales, setShowSucursales] = useState(false);

  const history = useHistory();
  const [presentToast] = useIonToast();
  const { cart } = useCart();
  const totalItemsEnCarrito = cart.reduce((total, item) => total + item.cantidad, 0);
  const totalIVA = cart.reduce((total, item) => total + item.IVA * item.cantidad, 0);
  const totalProductos = cart.reduce((total, item) => (total + item.precio * item.cantidad), 0);

  useEffect(() => {
    if (user?.customerId) {
      const UserId = user.customerId;

      // Obtener sucursales
      axios.get('https://backend-c-r-production.up.railway.app/address/get-sucursal')
        .then(response => setSucursales(response.data))
        .catch(error => console.error('Error fetching sucursales data:', error));

      // Obtener domicilios
      axios.get(`https://backend-c-r-production.up.railway.app/address/get-domicilio/${UserId}`)
        .then(response => setDomicilios(response.data))
        .catch(error => console.error('Error fetching domicilios data:', error));
    }
  }, [user]);

  const handleSelectDomicilio = async (domicilioId: number, cp: string) => {
    try {
      const response = await axios.get(`https://backend-c-r-production.up.railway.app/address/get-colonias/${cp}`);
      const data = response.data;
      const envio = parseFloat(data[0]?.envio) || 0;
      setEnvio(envio);
      setDireccionSeleccionada(domicilioId);
      setSucursalSeleccionada(null); // Resetea la selección de sucursal
    } catch (error) {
      console.error('Error fetching CP data:', error);
    }
  };

  const handleSelectSucursal = (sucursalId: number) => {
    setSucursalSeleccionada(sucursalId);
    setDireccionSeleccionada(null); // Resetea la selección de domicilio
    setEnvio(0); // Establece el envío a 0 al seleccionar una sucursal
  };

  const handleToggleDomicilios = () => {
    setShowDomicilios(!showDomicilios);
    if (!showDomicilios) setShowSucursales(false); // Oculta sucursales
  };

  const handleToggleSucursales = () => {
    setShowSucursales(!showSucursales);
    if (!showSucursales) setShowDomicilios(false); // Oculta domicilios
  };

  const handleProceedToPayment = () => {
    if (direccionSeleccionada || sucursalSeleccionada) {
      history.push('/select-payment');
    } else {
      presentToast({
        message: 'Por favor, seleccione una dirección antes de proceder al pago.',
        duration: 2000,
        color: 'warning',
      });
    }
  };

  useEffect(() => {
    const productosEnCarrito = cart.map(item => ({
      productoId: item.productoId,
      producto: item.producto,
      precio: item.precio,
      cantidad: item.cantidad,
      totalDV: (item.precio * item.cantidad).toFixed(2),
      IVA: item.IVA,
      imagen: item.imagen,
    }));

    const total = (totalProductos + envio).toFixed(2);

    const Venta = {
      cantidad: totalItemsEnCarrito,
      total: total,
      totalProductos: totalProductos.toFixed(2),
      totalEnvio: envio,
      totalIVA: totalIVA.toFixed(2),
      sucursalesId: sucursalSeleccionada,
      domicilioId: direccionSeleccionada,
      productos: productosEnCarrito,
    };

    localStorage.setItem('Venta', JSON.stringify(Venta));
  }, [cart, envio, direccionSeleccionada, sucursalSeleccionada, totalItemsEnCarrito]);

  return (
    <IonPage>
      <LayoutPage>
        <IonContent className='cart-content-address'>
          <div className="container">
            <h3>Elige la forma de entrega</h3>

            {/* Opción de Enviar a Domicilio */}
            <IonItem button onClick={handleToggleDomicilios}>
              <IonLabel>
                <IonIcon icon={homeIcon} /> Enviar a domicilio
              </IonLabel>
            </IonItem>

            {showDomicilios && (
              <>
                <IonRadioGroup value={direccionSeleccionada ? String(direccionSeleccionada) : undefined}>
                  {domicilios.length > 0 ? (
                    <IonList>
                      {domicilios.map(domicilio => (
                        <IonItem key={domicilio.DomicilioId} button onClick={() => handleSelectDomicilio(domicilio.DomicilioId, domicilio.CP)}>
                          <IonRadio slot="start" value={String(domicilio.DomicilioId)} />
                          <IonLabel>
                            <h2>{domicilio.Nombre}</h2>
                            <p>{domicilio.Calle}</p>
                            <p>{domicilio.Telefono}</p>
                            <p>{domicilio.Referencias}</p>
                          </IonLabel>
                        </IonItem>
                      ))}
                    </IonList>
                  ) : (
                    <p>Aún no tiene domicilios registrados, por favor añada uno.</p>
                  )}
                  <IonItem>
                    <IonRouterLink routerLink="/new-address" className='new-address'>Agregar nueva dirección</IonRouterLink>
                  </IonItem>
                </IonRadioGroup>
              </>
            )}

            {/* Opción de Recoger en Sucursal */}
            <IonItem button onClick={handleToggleSucursales}>
              <IonLabel>
                <IonIcon icon={storeIcon} /> Recoger en una sucursal
              </IonLabel>
            </IonItem>

            {showSucursales && (
              <>
                <IonRadioGroup value={sucursalSeleccionada ? String(sucursalSeleccionada) : undefined}>
                  {sucursales.length > 0 ? (
                    <IonList>
                      {sucursales.map(sucursal => (
                        <IonItem key={sucursal.SucursalId} button onClick={() => handleSelectSucursal(sucursal.SucursalId)}>
                          <IonRadio slot="start" value={String(sucursal.SucursalId)} />
                          <IonLabel>
                            <h2>{sucursal.Nombre}</h2>
                            <p>{sucursal.Calle}</p>
                            <p>{sucursal.Telefono}</p>
                            <p>{sucursal.Horario}</p>
                          </IonLabel>
                        </IonItem>
                      ))}
                    </IonList>
                  ) : (
                    <p>No hay sucursales disponibles.</p>
                  )}
                </IonRadioGroup>
              </>
            )}
          </div>
        </IonContent>
        {totalItemsEnCarrito > 0 && (
          <IonFooter>
            <IonCard className="total-card">
              <IonCardHeader>
                <IonCardTitle className='total-card-title'><strong>Información de compra</strong></IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <table >
                  <tbody >
                    {cart.map((item, index) => (
                      <tr key={index} className="total-container-address">
                        <td className="total-text">{item.producto} ({item.cantidad})</td>
                        <td className="total-price">$ {(item.precio * item.cantidad).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="total-container-address">
                      <td className="total-text">IVA (incluido)</td>
                      <td className="total-price">$ {totalIVA}</td>
                    </tr>
                    <tr className="total-container-address">
                      <td className="total-text">Envío</td>
                      <td className="total-price">{envio == 0 ? "No aplica" : `$ ${envio}`}</td>
                    </tr>
                    <tr className="total-container-address">
                      <td className="total-text"><strong>Total</strong></td>
                      <td className="total-price"><strong>$ {(parseFloat((totalProductos).toFixed(2)) + envio).toFixed(2)}</strong></td>
                    </tr>
                  </tbody>
                </table>
                <IonButton expand="full" onClick={handleProceedToPayment}>Proceder al Pago</IonButton>
              </IonCardContent>
            </IonCard>
          </IonFooter>

        )}
      </LayoutPage>
    </IonPage>
  );
};

export default SelectAddress;
