import { blue } from '@ant-design/colors';
import {
    ArrowDownOutlined,
    LogoutOutlined,
    ProfileOutlined,
    QuestionCircleOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../stateProviders/authProvider';

const Home = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const dropdownMenu = (
        <Menu>
            <Menu.Item icon={<ProfileOutlined />}>
                <Link to="/profile">Profil</Link>
            </Menu.Item>
            <Menu.Item icon={<QuestionCircleOutlined />}>
                <Link to="/help">Aide</Link>
            </Menu.Item>
            <Menu.Item
                danger
                onClick={() => auth?.signout(() => navigate('/'))}
                icon={<LogoutOutlined />}
            >
                Se deconnecter
            </Menu.Item>
        </Menu>
    );

    return auth?.user != null ? (
        <span>
            <Dropdown overlay={dropdownMenu}>
                <a
                    className="ant-dropdown-link"
                    style={{ color: blue.primary }}
                >
                    {' '}
                    <Avatar
                        style={{ verticalAlign: 'middle' }}
                        icon={<UserOutlined />}
                    ></Avatar>
                    {`${auth?.user?.firstName} ${auth?.user.lastName}`}
                    <ArrowDownOutlined />
                </a>
            </Dropdown>
        </span>
    ) : (
        <Link to="/login" style={{ color: blue.primary }}>
            Se connecter
        </Link>
    );
};
export default Home;
