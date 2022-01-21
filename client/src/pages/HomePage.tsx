import { Space } from 'antd';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            <h1>Home Page</h1>
            <p>Notex - Système de gestion de notes de frais</p>
            <Space>
                <Link to="/notes">Notes</Link>
                <Link to="/validation">Validation</Link>
            </Space>
        </div>
    );
};

export default HomePage;
