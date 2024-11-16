import { IonPage, IonText, IonAvatar, IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonContent } from '@ionic/react';
import './Tab3.css';
import LayoutPage from '../components/LayoutPage';

const Tab4: React.FC = () => {
  return (
    <IonPage>
      <LayoutPage>
        <IonContent>
          <IonItem>
            <IonAvatar slot="start">
              <img alt="Banner usuario" src={"/assets/Images/faq.jpg"} />
            </IonAvatar>
            <IonLabel><h1>Preguntas frecuentes</h1></IonLabel>
          </IonItem>

          {/* Acordeón para preguntas frecuentes */}
          <IonAccordionGroup>
            <IonAccordion value="faq1">
              <IonItem slot="header" color="light">
                <IonLabel>¿Cuánto tarda en llegar mi pedido?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                El tiempo de entrega varía según tu ubicación y el método de envío seleccionado. Por lo general, los pedidos se despachan dentro de 2-5 días hábiles.
              </div>
            </IonAccordion>

            <IonAccordion value="faq2">
              <IonItem slot="header" color="light">
                <IonLabel>¿Cuáles son los métodos de pago aceptados?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Aceptamos pagos con tarjetas de crédito y transferencias bancarias.
              </div>
            </IonAccordion>

            <IonAccordion value="faq3">
              <IonItem slot="header" color="light">
                <IonLabel>¿Puedo cambiar un producto?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Aceptamos cambios dentro de los 15 días posteriores a la entrega. Los artículos deben estar sin usar, en su empaque original y con todos los accesorios.
              </div>
            </IonAccordion>

            <IonAccordion value="faq4">
              <IonItem slot="header" color="light">
                <IonLabel>¿Ofrecen descuentos?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Sí, ofrecemos descuentos especiales durante fechas significativas, como lo son días del niño, día del amor y la amistad, Navidad, entre otras.
              </div>
            </IonAccordion>

            <IonAccordion value="faq5">
              <IonItem slot="header" color="light">
                <IonLabel>¿Puedo cancelar mi pedido?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Puedes cancelar tu pedido siempre y cuando aún no haya sido procesado para envío.
              </div>
            </IonAccordion>

            <IonAccordion value="faq6">
              <IonItem slot="header" color="light">
                <IonLabel>¿Qué sucede si realizo muchas compras y no las concreto?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Entendemos que, en ocasiones, los clientes pueden agregar productos al carrito de compras sin la intención de concretar la compra de inmediato. Sin embargo, si notamos un patrón de este comportamiento y no se concreta ninguna compra, nos reservamos el derecho de suspender temporalmente tu cuenta para evitar abusos.
              </div>
            </IonAccordion>

            <IonAccordion value="faq7">
              <IonItem slot="header" color="light">
                <IonLabel>¿Cuál es el período de garantía para los productos de Chucherías & Regalos?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Ofrecemos una garantía de devolución de dinero de 30 días en todos nuestros productos.
              </div>
            </IonAccordion>

            <IonAccordion value="faq8">
              <IonItem slot="header" color="light">
                <IonLabel>¿Cómo puedo solicitar un reembolso si no estoy satisfecho con mi compra?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Para iniciar el proceso de devolución y obtener un reembolso, comunícate con nuestro servicio de atención al cliente.
              </div>
            </IonAccordion>

            <IonAccordion value="faq9">
              <IonItem slot="header" color="light">
                <IonLabel>¿Cuánto tiempo tarda en procesarse un reembolso después de devolver un producto?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Procesaremos tu reembolso dentro de los próximos 5 días hábiles después de recibir y aprobar el producto devuelto.
              </div>
            </IonAccordion>

            <IonAccordion value="faq10">
              <IonItem slot="header" color="light">
                <IonLabel>¿Puedo cancelar mi pedido después de realizar la compra?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Sí, puedes cancelar tu pedido dentro de las 24 horas posteriores a su realización.
              </div>
            </IonAccordion>

            <IonAccordion value="faq11">
              <IonItem slot="header" color="light">
                <IonLabel>¿Cuál es la edad mínima para realizar una compra en Chucherías & Regalos?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Debes tener al menos 18 años de edad para realizar una compra.
              </div>
            </IonAccordion>

            <IonAccordion value="faq12">
              <IonItem slot="header" color="light">
                <IonLabel>¿Qué métodos de pago se aceptan en Chucherías & Regalos?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Aceptamos pagos con tarjetas de crédito y débito, así como pagos directos en nuestra sucursal física.
              </div>
            </IonAccordion>

            <IonAccordion value="faq13">
              <IonItem slot="header" color="light">
                <IonLabel>¿Cuál es el alcance de envío de Chucherías & Regalos?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Actualmente, solo realizamos envíos dentro del municipio de Huejutla de Reyes, Hidalgo, México.
              </div>
            </IonAccordion>

            <IonAccordion value="faq14">
              <IonItem slot="header" color="light">
                <IonLabel>¿Qué debo hacer si tengo alguna pregunta o inquietud sobre mi compra después de recibirla?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Si tienes alguna pregunta o inquietud, contáctanos a través de nuestro correo electrónico de atención al cliente.
              </div>
            </IonAccordion>
          </IonAccordionGroup>
        </IonContent>
      </LayoutPage>
    </IonPage>
  );
};

export default Tab4;
