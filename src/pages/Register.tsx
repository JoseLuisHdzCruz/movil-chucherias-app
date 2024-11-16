import React, { useState } from "react";
import { IonPage, IonHeader, IonContent, IonTitle, IonInput, IonLabel, IonItem, IonButton, IonSelect, IonSelectOption, IonToast, IonLoading, IonRow, IonCol } from "@ionic/react";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import LayoutPage from "../components/LayoutPage";
import "./Register.css";

// Esquema de validación de Yup
const validationSchema = Yup.object().shape({
  nombre: Yup.string()
    .matches(/^[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ\s]+$/, "El nombre solo puede contener letras, acentos y espacios")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(20, "El nombre no puede tener más de 20 caracteres")
    .required("El nombre es obligatorio"),
  aPaterno: Yup.string()
    .matches(/^[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ\s]+$/, "El apellido solo puede contener letras, acentos y espacios")
    .min(3, "El apellido debe tener al menos 3 caracteres")
    .max(15, "El apellido no puede tener más de 15 caracteres")
    .required("El apellido paterno es obligatorio"),
  aMaterno: Yup.string()
    .matches(/^[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ\s]+$/, "El apellido solo puede contener letras, acentos y espacios")
    .min(3, "El apellido debe tener al menos 3 caracteres")
    .max(15, "El apellido no puede tener más de 15 caracteres")
    .required("El apellido materno es obligatorio"),
  correo: Yup.string()
    .email("Correo electrónico inválido")
    .required("Email es obligatorio"),
  telefono: Yup.string()
    .matches(/^\d{10}$/, "Debe tener 10 dígitos")
    .required("Teléfono es obligatorio"),
  sexo: Yup.string().required("Seleccione su sexo"),
  fecha_nacimiento: Yup.date()
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), "Debes ser mayor de 18 años")
    .required("Fecha de nacimiento es obligatoria"),
  contraseña: Yup.string()
    .required("Contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmarContraseña: Yup.string()
    .oneOf([Yup.ref("contraseña")], "Las contraseñas deben coincidir")
    .required("Confirmar contraseña es obligatorio"),
  preguntaSecreta: Yup.string().required("Seleccione una pregunta secreta"),
  respuestaPSecreta: Yup.string().required("Escriba la respuesta secreta"),
});

const Register: React.FC = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    nombre: "",
    aPaterno: "",
    aMaterno: "",
    correo: "",
    telefono: "",
    sexo: "",
    fecha_nacimiento: "",
    contraseña: "",
    confirmarContraseña: "",
    preguntaSecreta: "",
    respuestaPSecreta: ""
  });
  const [errors, setErrors] = useState<any>({});
  const [showToast, setShowToast] = useState({ isOpen: false, message: "", color: "" });
  const [loading, setLoading] = useState(false);

  // Función para manejar cambios en los campos de entrada
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para manejar el cambio en los campos de la pregunta secreta
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para validar y enviar el formulario
  const handleSubmit = async () => {
    try {
      // Validar el formulario con Yup
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      setLoading(true); // Esto activa el spinner de carga

      console.log(formData);
      // Enviar los datos a la API
      const response = await axios.post("https://backend-c-r-production.up.railway.app/users", formData);


      if (response.status === 201) {
        setShowToast({ isOpen: true, message: "¡Registro exitoso!", color: "success" });
        setTimeout(() => {
          history.push("/login"); // Redirige al login
        }, 2000); // Espera 2 segundos antes de redirigir
      }
    } catch (error: any) {
      setLoading(false); // Asegúrate de establecer loading a false en caso de error

      if (error.response && error.response.data) {
        setShowToast({ isOpen: true, message: error.response.data.message || "Hubo un error en el registro", color: "danger" });
      } else {
        setShowToast({ isOpen: true, message: "Error al registrar, intente nuevamente", color: "danger" });
      }

      if (error instanceof Yup.ValidationError) {
        const validationErrors: any = {};
        error.inner.forEach((err) => {
          if (err.path) validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      }
    } finally {
      // Asegúrate de que siempre se termine el estado de carga
      setLoading(false);
    }
  };


  return (
    <IonPage>
      <LayoutPage>
        
        <IonContent className="ion-padding">
          <IonTitle className="cont-title">Registro de Usuario</IonTitle>
          <IonItem className="form-item">
            <IonLabel position="stacked" className="label">Nombre(s)</IonLabel>
            <IonInput name="nombre" value={formData.nombre} onIonChange={handleInputChange} className="input-field" />
          </IonItem>
          {errors.nombre && <p className="error-text">{errors.nombre}</p>}

          <IonItem className="form-item">
            <IonLabel position="stacked" className="label">Apellido Paterno</IonLabel>
            <IonInput name="aPaterno" value={formData.aPaterno} onIonChange={handleInputChange} className="input-field" />
          </IonItem>
          {errors.aPaterno && <p className="error-text">{errors.aPaterno}</p>}

          <IonItem className="form-item">
            <IonLabel position="stacked" className="label">Apellido Materno</IonLabel>
            <IonInput name="aMaterno" value={formData.aMaterno} onIonChange={handleInputChange} className="input-field" />
          </IonItem>
          {errors.aMaterno && <p className="error-text">{errors.aMaterno}</p>}

          <IonItem className="form-item">
            <IonLabel position="stacked" className="label">Correo Electrónico</IonLabel>
            <IonInput name="correo" type="email" value={formData.correo} onIonChange={handleInputChange} className="input-field" />
          </IonItem>
          {errors.correo && <p className="error-text">{errors.correo}</p>}

          <IonItem className="form-item">
            <IonLabel position="stacked" className="label">Teléfono</IonLabel>
            <IonInput name="telefono" type="tel" value={formData.telefono} onIonChange={handleInputChange} className="input-field" />
          </IonItem>
          {errors.telefono && <p className="error-text">{errors.telefono}</p>}


          <IonRow>
            <IonCol>
              <IonItem className="form-item">
                <IonLabel position="stacked" className="label">Sexo</IonLabel>
                <IonSelect name="sexo" value={formData.sexo} onIonChange={handleSelectChange} className="input-field">
                  <IonSelectOption value="masculino">Masculino</IonSelectOption>
                  <IonSelectOption value="femenino">Femenino</IonSelectOption>
                </IonSelect>
              </IonItem>
              {errors.sexo && <p className="error-text">{errors.sexo}</p>}
            </IonCol>
            <IonCol>
              <IonItem className="form-item">
                <IonLabel position="stacked" className="label">Fecha de Nacimiento</IonLabel>
                <IonInput name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onIonChange={handleInputChange} className="input-field" />
              </IonItem>
              {errors.fecha_nacimiento && <p className="error-text">{errors.fecha_nacimiento}</p>}
            </IonCol>
          </IonRow>




          <IonItem className="form-item">
            <IonLabel position="stacked" className="label">Contraseña</IonLabel>
            <IonInput name="contraseña" type="password" value={formData.contraseña} onIonChange={handleInputChange} className="input-field" />
          </IonItem>
          {errors.contraseña && <p className="error-text">{errors.contraseña}</p>}

          <IonItem className="form-item">
            <IonLabel position="stacked" className="label">Confirmar Contraseña</IonLabel>
            <IonInput name="confirmarContraseña" type="password" value={formData.confirmarContraseña} onIonChange={handleInputChange} className="input-field" />
          </IonItem>
          {errors.confirmarContraseña && <p className="error-text">{errors.confirmarContraseña}</p>}

          <IonItem className="form-item">
            <IonLabel position="stacked" className="label">Pregunta Secreta</IonLabel>
            <IonSelect name="preguntaSecreta" value={formData.preguntaSecreta} onIonChange={handleSelectChange} className="input-field">
              <IonSelectOption value="madre">¿Cuál es el nombre de tu madre?</IonSelectOption>
              <IonSelectOption value="mascota">¿Cuál es el nombre de tu mascota?</IonSelectOption>
              <IonSelectOption value="ciudad">¿En qué ciudad naciste?</IonSelectOption>
            </IonSelect>
          </IonItem>
          {errors.preguntaSecreta && <p className="error-text">{errors.preguntaSecreta}</p>}

          <IonItem className="form-item">
            <IonLabel position="stacked" className="label">Respuesta Secreta</IonLabel>
            <IonInput name="respuestaPSecreta" value={formData.respuestaPSecreta} onIonChange={handleInputChange} className="input-field" />
          </IonItem>
          {errors.respuestaPSecreta && <p className="error-text">{errors.respuestaPSecreta}</p>}

          <IonButton expand="full" onClick={handleSubmit} className="submit-btn">Registrar</IonButton>

          <IonToast
            isOpen={showToast.isOpen}
            message={showToast.message}
            color={showToast.color}
            duration={2000}
            onDidDismiss={() => setShowToast({ isOpen: false, message: "", color: "" })}
          />

          <IonLoading isOpen={loading} message="Registrando..." />
        </IonContent>
      </LayoutPage>

    </IonPage>
  );
};

export default Register;