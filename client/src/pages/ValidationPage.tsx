import { useAuth } from '../stateProviders/authProvider';

const ValidationPage = () => {
    const auth = useAuth();
    console.log(auth?.user);
    return (
        <div>
            <h1>Validation</h1>
            {<span>{auth?.user?.service.name}</span>}
        </div>
    );
};

export default ValidationPage;
