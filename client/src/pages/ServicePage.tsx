import { useAuth } from '../stateProviders/authProvider';
import {} from '../clients/serviceClient';

const ServicePage = () => {
    const auth = useAuth();
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}> Mon service :</h1>
            {
                <h2 style={{ textAlign: 'center' }}>
                    {auth?.user?.service.name}
                </h2>
            }
        </div>
    );
};

export default ServicePage;
