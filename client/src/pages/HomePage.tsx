import { Col, Divider } from 'antd';
import { useAuth } from '../stateProviders/authProvider';

const HomePage = () => {
    const auth = useAuth();
    const isAuth = auth?.user?._id != null;

    return (
        <div>
            <Col span={12} offset={6}>
                <h2>
                    Bienvenue sur Notex
                    {isAuth ? <>, {auth?.user?.firstName}</> : null} !
                </h2>
                <h3>Système de gestion de notes de frais en ligne</h3>
            </Col>
            {isAuth ? (
                <>
                    <Divider></Divider>
                    <Col span={12} offset={6}>
                        <h2>Messages de la direction : </h2>
                        <h3>Work in progress</h3>
                    </Col>
                </>
            ) : null}
        </div>
    );
};

export default HomePage;
