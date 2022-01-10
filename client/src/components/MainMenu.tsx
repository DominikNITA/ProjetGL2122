import { Menu } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../stateProviders/authProvider';
import { UserRole } from '../types';

interface MenuEntry {
    path: string;
    text: string;
    isVisible: () => boolean | undefined;
}

const MainMenu = () => {
    const auth = useAuth();
    //   const path = router.asPath.split('?')[0];
    const menuEntriesList: MenuEntry[] = [
        {
            path: '/notes',
            text: 'Notes de frais',
            isVisible: () => isAuthorized(),
        },
        {
            path: '/validation',
            text: 'Validation',
            isVisible: () => isAuthorized(),
        },
        {
            path: '/service',
            text: 'Service',
            isVisible: () =>
                isAuthorized() && auth?.user?.roles?.includes(UserRole.LEADER),
        },
        {
            path: '/dev',
            text: 'Dev',
            isVisible: () => process.env.NODE_ENV !== 'production',
        },
    ];

    function isAuthorized() {
        return auth?.user != null;
    }

    const [selectedKey, setSelectedKey] = useState(menuEntriesList[0].path);
    const location = useLocation();

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            menuEntriesList.forEach((menuEntry) => {
                if (url.includes(menuEntry.path)) {
                    setSelectedKey(menuEntry.path);
                }
            });
        };
        setSelectedKey('');
        handleRouteChange(location.pathname);
    }, [location]);
    return (
        <Menu
            theme="dark"
            mode="horizontal"
            className="header-nav"
            selectedKeys={[selectedKey]}
        >
            {menuEntriesList.map(
                (entry) =>
                    entry.isVisible() && (
                        <Menu.Item key={entry.path}>
                            <Link to={entry.path}>{entry.text}</Link>
                        </Menu.Item>
                    )
            )}
        </Menu>
    );
};
export default MainMenu;
