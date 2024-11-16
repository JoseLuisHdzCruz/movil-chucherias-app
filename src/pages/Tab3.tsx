import { IonPage, IonText } from '@ionic/react';
import './Tab3.css';
import LayoutPage from '../components/LayoutPage';
import UserProfile from '../components/UserProfile';

const Tab3: React.FC = () => {
  return (
    <IonPage>
      <LayoutPage>
        <UserProfile />
      </LayoutPage>
    </IonPage>
  );
};

export default Tab3;
