import { IonApp } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { setupIonicReact } from '@ionic/react';
import { Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Elements } from '@stripe/react-stripe-js'; // Importar Elements
import { loadStripe } from '@stripe/stripe-js'; // Importar loadStripe

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.css';

setupIonicReact();

// Carga tu clave pública de Stripe
const stripePromise = loadStripe('pk_test_51Pf8IA2NI1ZNadeOLivsZnTK9wtGno4CEo8viraLEc0NBdl9CFbhubTvVVuo7gpznAfJt6mqR10IhaeVQQNutEQ500WkPoYuht');

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <CartProvider>
        <Elements stripe={stripePromise}>
          <IonReactRouter>
            <Route path="/" component={MainLayout} exact={false} />
          </IonReactRouter>
        </Elements>
      </CartProvider>
    </AuthProvider>
  </IonApp>
);

export default App;