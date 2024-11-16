// StripePaymentForm.tsx
import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { IonButton, IonToast } from '@ionic/react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router';
import './StripePaymentForm.css';
import { useCart } from '../contexts/CartContext';

const StripePaymentForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useHistory();
    const { clearCart } = useCart();


    // Estados para manejar las notificaciones
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handlePayment = async () => {

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) return;

        // Obtén el objeto 'Venta' de localStorage
        const ventaData = JSON.parse(localStorage.getItem('Venta') || '{}');
        if (!ventaData || !ventaData.total) {
            console.log(ventaData),
            setToastMessage("No se encontró información válida de la venta en el localStorage.");
            setShowToast(true);
            return;
        }

        setLoading(true);

        try {
            // Crea el paymentIntent en el servidor
            const { data } = await axios.post('https://backend-c-r-production.up.railway.app/ventas/create-checkout-session-movil', {
                venta: ventaData,
                customerId: user?.customerId,
            });

            const clientSecret = data.clientSecret;

            // Confirma el pago usando el clientSecret
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: ventaData.customerName || 'Cliente',
                    },
                },
            });

            if (error) {
                setToastMessage(`Error al confirmar el pago: ${error.message}`);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                setToastMessage("Pago exitoso");
                navigate.push('/purchase-history')
                clearCart();
                localStorage.removeItem('cart');
                onSuccess();
            }
        } catch (error) {
            setToastMessage("Hubo un problema al procesar el pago. Por favor, intenta de nuevo.");
        } finally {
            setLoading(false);
            setShowToast(true); // Muestra el mensaje
        }
    };

    return (
        <>
            <form className="stripe-form">
                <div className="field">
                    <label htmlFor="card-number">Número de tarjeta</label>
                    <CardNumberElement id="card-number" className="card-element" options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                letterSpacing: '0.025em',
                                fontFamily: 'Arial, sans-serif',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        }
                    }} />
                </div>
                <div className="field-row">
                    <div className="field half">
                        <label htmlFor="card-expiry">Fecha de expiración</label>
                        <CardExpiryElement id="card-expiry" className="card-element" />
                    </div>
                    <div className="field half">
                        <label htmlFor="card-cvc">CVV</label>
                        <CardCvcElement id="card-cvc" className="card-element" />
                    </div>
                </div>
                <IonButton expand="block" color="primary" className='btn-pago' onClick={handlePayment} disabled={loading}>
                    {loading ? 'Procesando...' : 'Confirmar pago'}
                </IonButton>
            </form>

            {/* IonToast para notificaciones */}
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={3000}
                position="top"
            />
        </>
    );
};

export default StripePaymentForm;
