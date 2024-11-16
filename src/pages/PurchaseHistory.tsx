import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonButton,
    IonModal,
    IonInput,
    IonCol,
    IonRow,
    IonIcon,
    IonToast
} from '@ionic/react';
import LayoutPage from '../components/LayoutPage';
import { trash, eye } from 'ionicons/icons';
import './PurchaseHistory.css';

interface Purchase {
    ventaId: number;
    folio: string;
    total: number;
    fecha: string;
    detalles: PurchaseDetail[];
    statusVentaId: number;
    statusVenta: string; // Nueva propiedad para el nombre del estado
}

interface PurchaseDetail {
    detalleVentaId: number;
    productoId: number;
    producto: string;
    imagen: string;
    precio: number;
    IVA: number;
    cantidad: number;
    totalDV: number;
}

const PurchaseHistory: React.FC = () => {
    const { user } = useAuth();
    const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [folioVenta, setFolioVenta] = useState<string | null>(null);
    const [statusList, setStatusList] = useState<any[]>([]); // Estado para los estados de las ventas
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const fetchPurchaseHistory = async () => {
            if (user) {
                try {
                    const response = await axios.get(`https://backend-c-r-production.up.railway.app/ventas/cliente/${user.customerId}`);
                    const purchases = await Promise.all(
                        response.data.map(async (purchase: Purchase) => {
                            const detailsResponse = await axios.get(`https://backend-c-r-production.up.railway.app/ventas/detalle/${purchase.ventaId}`);
                            return { ...purchase, detalles: detailsResponse.data };
                        })
                    );
                    setPurchaseHistory(purchases);
                } catch (error) {
                    console.error('Error fetching purchase history:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        const fetchStatusList = async () => {
            try {
                const statusResponse = await axios.get('https://backend-c-r-production.up.railway.app/ventas/status/getAllStatusVenta');
                setStatusList(statusResponse.data);
            } catch (error) {
                console.error('Error fetching status list:', error);
            }
        };

        fetchPurchaseHistory();
        fetchStatusList();
    }, [user]);

    const openCancelModal = (folio: string) => {
        setCancelModalOpen(true);
        setFolioVenta(folio);
    };

    const handleCancelPurchase = async () => {
        try {
            // Enviar la solicitud de cancelación al servidor
            await axios.post(`https://backend-c-r-production.up.railway.app/ventas/cancelar-venta`, {
                folio: folioVenta,
                reason: cancelReason,
            });
    
            // Mostrar el mensaje de éxito
            setToastMessage('Compra cancelada con éxito');
            setToastColor('success');
            setShowToast(true);
    
            // Actualizar el historial de compras obteniendo los datos más recientes de la API
            const response = await axios.get(`https://backend-c-r-production.up.railway.app/ventas/cliente/${user?.customerId}`);
            const purchases = await Promise.all(
                response.data.map(async (purchase: Purchase) => {
                    const detailsResponse = await axios.get(`https://backend-c-r-production.up.railway.app/ventas/detalle/${purchase.ventaId}`);
                    return { ...purchase, detalles: detailsResponse.data };
                })
            );
            setPurchaseHistory(purchases); // Actualizar el estado con los nuevos datos
    
            // Cerrar el modal de cancelación
            setCancelModalOpen(false);
        } catch (error) {
            console.error('Error canceling purchase:', error);
            setToastMessage('Error al cancelar la compra');
            setToastColor('danger');
            setShowToast(true);
        }
    };
    

    const handleNextPage = () => setCurrentPage((prevPage) => prevPage + 1);
    const handlePrevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

    if (loading) return <IonContent>Cargando historial de compras...</IonContent>;

    const displayedItems = purchaseHistory
        .slice()
        .reverse()
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <LayoutPage>
            <IonContent>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle className="login-title">Historial de compras</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonList>
                    {displayedItems.map((purchase) => (
                        <PurchaseCard
                            key={purchase.ventaId}
                            purchase={purchase}
                            onCancel={() => openCancelModal(purchase.folio)}
                            statusList={statusList} // Pasar la lista de estados
                        />
                    ))}
                </IonList>
                <div className="pagination">
                    <IonButton size="small" onClick={handlePrevPage} disabled={currentPage === 1}>
                        &lt;
                    </IonButton>
                    <span>Página {currentPage}</span>
                    <IonButton size="small" onClick={handleNextPage} disabled={displayedItems.length < itemsPerPage}>
                        &gt;
                    </IonButton>
                </div>

                <IonModal
  isOpen={cancelModalOpen}
  onDidDismiss={() => setCancelModalOpen(false)}
  className="cancel-purchase-modal"
>
  <IonHeader>
    <IonToolbar>
      <IonTitle>Cancelar Compra</IonTitle>
    </IonToolbar>
  </IonHeader>
  <IonContent>
    <IonItem lines="none" className="modal-item">
      <IonLabel position="stacked">Motivo de cancelación</IonLabel>
      <IonInput
        value={cancelReason}
        onIonChange={(e) => setCancelReason(e.detail.value!)}
        className="modal-input"
        placeholder="Escribe el motivo aquí"
      />
    </IonItem>

    <div className="modal-buttons">
      <IonButton
        expand="full"
        className="confirm-btn"
        onClick={handleCancelPurchase}
      >
        Confirmar Cancelación
      </IonButton>
      <IonButton
        expand="full"
        color="light"
        onClick={() => setCancelModalOpen(false)}
        className="close-btn"
      >
        Cerrar
      </IonButton>
    </div>
  </IonContent>
</IonModal>


                <IonToast
                    isOpen={showToast}
                    message={toastMessage}
                    duration={2000}
                    color={toastColor}
                    onDidDismiss={() => setShowToast(false)}
                />
            </IonContent>
        </LayoutPage>
    );
};

const PurchaseCard: React.FC<{ purchase: Purchase; onCancel: () => void; statusList: any[] }> = ({ purchase, onCancel, statusList }) => {
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    // Obtener el nombre del estado de la venta
    const statusVenta = statusList.find((status) => status.statusVentaId === purchase.statusVentaId)?.statusVenta || 'Desconocido';

    return (
        <>
            <IonCard className="purchase-card">
                <IonRow>
                    <IonCol size='3' className='cont-img'>
                        <img
                            src={purchase.detalles[0]?.imagen || 'https://via.placeholder.com/150'} // marcador de posición
                            alt={purchase.detalles[0]?.producto || 'Producto sin imagen'}
                            className="purchase-image"
                        />
                    </IonCol>
                    <IonCol size='6'>
                        <IonCardHeader>
                            <IonLabel><strong>Folio: {purchase.folio}</strong></IonLabel>
                            <IonLabel><strong>Estado del pedido: {statusVenta}</strong></IonLabel>
                        </IonCardHeader>
                        <IonCardContent>
                            <p>Total: ${purchase.total}</p>
                            <p>Fecha: {new Date(purchase.fecha).toLocaleDateString()}</p>
                        </IonCardContent>
                    </IonCol>
                    <IonCol size='3' className='cont-buttons'>
                        <IonButton shape="round" color={"danger"} onClick={onCancel}>
                            <IonIcon slot="icon-only" icon={trash}></IonIcon>
                        </IonButton>

                        <IonButton shape="round" color={'secondary'} onClick={() => setDetailModalOpen(true)}>
                            <IonIcon slot="icon-only" icon={eye}></IonIcon>
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonCard>

            <IonModal isOpen={detailModalOpen} onDidDismiss={() => setDetailModalOpen(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Detalle de la Compra</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <table className="purchase-detail-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Pza.</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchase.detalles.map((item) => (
                                <tr key={item.detalleVentaId}>
                                    <td>
                                        <img src={item.imagen} alt={item.producto} style={{ marginRight: '8px', height: '30px', width: '100%' }} />
                                    </td>
                                    <td>{item.producto}</td>
                                    <td>${item.precio}</td>
                                    <td>{item.cantidad}</td>
                                    <td>${item.totalDV}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <IonButton expand="full" color="light" onClick={() => setDetailModalOpen(false)}>Cerrar</IonButton>
                </IonContent>
            </IonModal>
        </>
    );
};

export default PurchaseHistory;
