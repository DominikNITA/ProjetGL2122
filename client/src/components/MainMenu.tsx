import { Menu } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '../enums';
import { useAuth } from '../stateProviders/authProvider';

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
            isVisible: () => isAuthorized() && isInRole(UserRole.Leader),
        },
        {
            path: '/service',
            text: 'Service',
            isVisible: () => isAuthorized(),
        },
        {
            path: '/avances',
            text: 'Avances',
            isVisible: () => isAuthorized(),
        },
        {
            path: '/settings',
            text: 'Parametres',
            isVisible: () =>
                isAuthorized() &&
                (isInRole(UserRole.Director) ||
                    isInRole(UserRole.FinanceLeader)),
        },
        // {
        //     path: '/dev',
        //     text: 'Dev',
        //     isVisible: () => process.env.NODE_ENV !== 'production',
        // },
    ];

    function isAuthorized() {
        return (
            auth?.user != null || process.env.REACT_APP_BYPASS_AUTH === 'true'
        );
    }

    function isInRole(userRole: UserRole) {
        return (
            auth?.user?.roles?.includes(userRole) ||
            process.env.REACT_APP_BYPASS_AUTH === 'true'
        );
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
