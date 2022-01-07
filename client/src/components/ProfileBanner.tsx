import {
    ArrowDownOutlined,
    ProfileOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useAuth } from '../stateProviders/authProvider';

const Home = () => {
    // const { data: session } = useSession();
    // console.log('sessionProfile', session);
    const auth = useAuth();
    const dropdownMenu = (
        <Menu>
            <Menu.Item icon={<ProfileOutlined />}>
                <Link to="/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item icon={<QuestionCircleOutlined />}>
                <Link to="/help">Aide</Link>
            </Menu.Item>
            {/* <Menu.Item danger onClick={() => signOut()} icon={<LogoutOutlined />}>
        Se deconnecter
      </Menu.Item> */}
        </Menu>
    );

    return auth?.user != null ? (
        <span>
            <Dropdown overlay={dropdownMenu}>
                <a className="ant-dropdown-link">
                    {' '}
                    <Avatar style={{ verticalAlign: 'middle' }}></Avatar>
                    {`${auth?.user?.surname} ${auth?.user.name}`}
                    <ArrowDownOutlined />
                </a>
            </Dropdown>
        </span>
    ) : (
        <Link to="/login">Se connecter</Link>
    );
};
export default Home;
