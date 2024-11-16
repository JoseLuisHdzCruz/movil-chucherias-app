import React, { useState } from "react";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonInput,
    IonLabel,
    IonItem,
    IonToast,
    useIonRouter,
    IonImg,
    IonRow
} from "@ionic/react";
import axios from "axios";
import * as Yup from "yup";
import LayoutPage from "../components/LayoutPage";
import "./ForgotPasswordPage.css"

const validationSchema = Yup.object().shape({
    correo: Yup.string()
        .email("Correo electrónico inválido")
        .required("Email es obligatorio")
        .matches(
            /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            "Ingresa una dirección de correo electrónico válida"
        ),
});

const ForgotPasswordPage = () => {
    const [correo, setCorreo] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const router = useIonRouter();

    const handleBack = () => {
        router.goBack();
    };

    const handleSubmit = async () => {
        try {
            await validationSchema.validate({ correo });

            // Enviar datos al backend para la solicitud de recuperación de contraseña
            const response = await axios.post(
                "https://backend-c-r-production.up.railway.app/users/forgotPassword",
                { correo }
            );

            setToastMessage(response.data.message || "Se ha enviado un código de verificación a su correo.");
            setShowToast(true);

            setTimeout(() => {
                router.push(`/key-verification/${correo}`, "forward");
            }, 3000);
        } catch (error: any) {
            if (error instanceof Yup.ValidationError) {
                setToastMessage(error.message); // Mostrar mensaje de error de validación
            } else if (axios.isAxiosError(error) && error.response) {
                setToastMessage(
                    error.response.data.error || "Ocurrió un error. Inténtalo de nuevo."
                );
            } else {
                setToastMessage("Error desconocido. Inténtalo más tarde.");
            }
            setShowToast(true);
        }
    };

    return (
        <IonPage>
            <LayoutPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle className="title-cont">Recuperar Contraseña</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonCard>
                        <IonCardContent>
                            <IonRow>
                                <IonImg src="/assets/Images/forgot-password.jpg" alt="ChucheriasRegalos" className="login-image" />
                            </IonRow>

                            <p className="login-box-msg">
                                ¿Olvidaste tu contraseña? Ingresa tu correo electrónico para
                                recuperar el acceso.
                            </p>
                            <IonItem>
                                <IonLabel position="stacked">Correo Electrónico</IonLabel>
                                <IonInput
                                    type="email"
                                    placeholder="Ingrese su correo electrónico"
                                    value={correo}
                                    onIonChange={(e) => setCorreo(e.detail.value!)}
                                />
                            </IonItem>

                            <div className="cont-btn mt-4">
                                <IonButton color="medium" onClick={handleBack}>
                                    Cancelar
                                </IonButton>
                                <IonButton color="primary" onClick={handleSubmit}>
                                    Enviar solicitud
                                </IonButton>
                            </div>
                        </IonCardContent>
                    </IonCard>

                    <IonToast
                        isOpen={showToast}
                        onDidDismiss={() => setShowToast(false)}
                        message={toastMessage}
                        duration={3000}
                        position="top"
                        color="primary"
                    />
                </IonContent>
            </LayoutPage>

        </IonPage>
    );
};

export default ForgotPasswordPage;
