import React, { useState } from "react";
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonLabel, IonInput, IonButton, IonText, IonLoading, IonAlert, IonHeader, IonToolbar, IonTitle, IonRow, IonImg, IonInputPasswordToggle } from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import LayoutPage from "../components/LayoutPage";

const ChangePassword = () => {
    const { correo } = useParams<{ correo: string }>();
    const history = useHistory();

    // Estado para gestionar los valores de los campos
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    // Validación de las contraseñas
    const validatePassword = () => {
        if (password !== confirmPassword) {
            return "Las contraseñas no coinciden";
        }
        if (password.length < 8) {
            return "La contraseña debe tener al menos 8 caracteres";
        }
        return "";
    };

    // Manejo del envío del formulario
    const handleSubmit = async () => {
        const validationError = validatePassword();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError("");  // Limpiar mensaje de error

        setLoading(true);

        try {
            const response = await axios.post(
                "https://backend-c-r-production.up.railway.app/users/changePassword",
                {
                    correo: correo,
                    nuevaContraseña: password,
                }
            );

            // Si la contraseña se cambia correctamente, mostramos una alerta
            setShowAlert(true);

        } catch (error) {
            setError("Ocurrió un error al cambiar la contraseña.");
        } finally {
            setLoading(false);
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
                        <IonRow>
                            <IonImg src="/assets/Images/cambiarContraseña.jpg" alt="ChucheriasRegalos" className="login-image" />
                        </IonRow>
                        <div className="ion-padding">
                            <IonLabel position="stacked">Nueva Contraseña</IonLabel>
                            <IonInput
                                value={password}
                                onIonInput={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Introduce tu nueva contraseña"
                            >
                                <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                            </IonInput>
                        </div>

                        <div className="ion-padding">
                            <IonLabel position="stacked">Confirmar Contraseña</IonLabel>
                            <IonInput
                                value={confirmPassword}
                                onIonInput={(e) => setConfirmPassword(e.target.value)}
                                type="password"
                                placeholder="Confirma tu nueva contraseña"
                                >
                                <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                            </IonInput>
                        </div>

                        {error && (
                            <IonText color="danger">
                                <p>{error}</p>
                            </IonText>
                        )}

                        <div className="ion-padding">
                            <IonButton expand="full" onClick={handleSubmit} disabled={loading}>
                                {loading ? "Cambiando..." : "Cambiar Contraseña"}
                            </IonButton>
                        </div>
                    </IonCard>
                </IonContent>

                {/* Cargando Spinner */}
                <IonLoading isOpen={loading} message="Cambiando contraseña..." />

                {/* Alerta de éxito */}
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header="¡Éxito!"
                    message="Tu contraseña ha sido cambiada con éxito."
                    buttons={[
                        {
                            text: "OK",
                            handler: () => {
                                setShowAlert(false);
                                history.push("/login"); // Redirigir al home
                            },
                        },
                    ]}
                />
            </LayoutPage>
        </IonPage>
    );
};

export default ChangePassword;
