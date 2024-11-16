import React, { useState } from "react";
import { IonContent, IonPage, IonInput, IonButton, IonAlert, IonLabel, IonHeader, IonToolbar, IonTitle, IonImg, IonText, IonCard, IonCardContent, IonSpinner, IonRow } from "@ionic/react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import LayoutPage from "../components/LayoutPage";
import "./ForgotPasswordPage.css"

const KeyVerifly: React.FC = () => {
    const { correo } = useParams<{ correo: string }>();
    const history = useHistory();

    const [otp, setOtp] = useState("");
    const [isResending, setIsResending] = useState(false);
    const [isCooldown, setIsCooldown] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post("https://backend-c-r-production.up.railway.app/users/keyCompare", {
                correo: correo,
                clave: otp,
            });

            if (response.data.success) {
                setAlertMessage(response.data.message);
                setAlertColor("success");
                setShowAlert(true);
                setTimeout(() => {
                    history.push(`/change-password/${correo}`);
                }, 3000);
            } else {
                setAlertMessage(response.data.message);
                setAlertColor("danger");
                setShowAlert(true);
            }
        } catch (error) {
            setAlertMessage("Error al verificar la clave. Inténtalo de nuevo.");
            setAlertColor("danger");
            setShowAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    const reenviarClave = async () => {
        if (isCooldown) {
            setAlertMessage("Por favor, espere 5 minutos antes de intentar de nuevo.");
            setAlertColor("danger");
            setShowAlert(true);
            return;
        }

        setIsResending(true);

        try {
            await axios.post("https://backend-c-r-production.up.railway.app/users/forgotPassword", { correo });
            setAlertMessage("Código reenviado a su correo.");
            setAlertColor("success");
            setShowAlert(true);
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 5 * 60 * 1000);
        } catch (error) {
            setAlertMessage("Error al reenviar el código. Intente de nuevo.");
            setAlertColor("danger");
            setShowAlert(true);
        } finally {
            setIsResending(false);
        }
    };

    const handleClick = async () => {
        try {
            await axios.post("https://backend-c-r-production.up.railway.app/users/sedKeyWhatsApp", { correo });
            setAlertMessage("Código enviado por WhatsApp.");
            setAlertColor("success");
            setShowAlert(true);
            setTimeout(() => {
                history.push(`/key-verification-whatsapp/${correo}`);
            }, 2000);
        } catch (error) {
            setAlertMessage("Error al enviar el código por WhatsApp.");
            setAlertColor("danger");
            setShowAlert(true);
        }
    };

    return (
        <IonPage>
            <LayoutPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle className="title-cont">Recuperar contraseña</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent className="ion-padding">
                    <IonCard>
                        <IonCardContent>
                            <IonRow>
                                <IonImg src="/assets/Images/clabe-verificacion.jpg" alt="ChucheriasRegalos" className="login-image" />
                            </IonRow>
                            <IonLabel>Su correo electrónico</IonLabel>
                            <IonInput value={correo} disabled className="ion-margin-top" />

                            <IonLabel className="ion-margin-top">Ingrese su clave de verificación</IonLabel>
                            <IonInput
                                type="text"
                                value={otp}
                                onIonChange={(e) => setOtp(e.detail.value!)}
                                placeholder="Ingrese su clave de confirmación"
                                className="ion-margin-top"
                            />

                            <IonButton expand="block" onClick={handleSubmit} disabled={isLoading} className="ion-margin-top">
                                {isLoading ? <IonSpinner /> : "Enviar"}
                            </IonButton>

                            <IonText color="medium" className="ion-text-center ion-margin-top">
                                <p>¿No recibió su código?</p>
                            </IonText>
                            <IonButton expand="block" fill="clear" onClick={reenviarClave} disabled={isResending}>
                                {isResending ? "Reenviando..." : "Reenviar ahora"}
                            </IonButton>
                        </IonCardContent>
                    </IonCard>

                    <IonAlert
                        isOpen={showAlert}
                        onDidDismiss={() => setShowAlert(false)}
                        message={alertMessage}
                        color={alertColor}
                        buttons={["OK"]}
                    />
                </IonContent>
            </LayoutPage>

        </IonPage>
    );
};

export default KeyVerifly;
