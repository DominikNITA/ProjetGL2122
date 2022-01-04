import { Menu } from 'antd';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface MenuEntry {
  path: string;
  text: string;
  isVisible: () => boolean;
}

const MainMenu: NextPage = () => {
  //const { data: session } = useSession();
  const router = useRouter();
  //   const path = router.asPath.split('?')[0];
  const menuEntriesList: MenuEntry[] = [
    { path: '/notes', text: 'Notes de frais', isVisible: () => true },
    { path: '/validation', text: 'Validation', isVisible: () => true },
    { path: '/service', text: 'Service', isVisible: () => false }, //TODO: add check if user is chef de service (add roles?)
    {
      path: '/dev',
      text: 'Dev',
      isVisible: () => process.env.NODE_ENV !== 'production',
    },
  ];

  const menuEntries = menuEntriesList.map(
    (entry) =>
      entry.isVisible() && (
        <Menu.Item key={entry.path}>
          <Link href={entry.path}>{entry.text}</Link>
        </Menu.Item>
      )
  );

  const [selectedKey, setSelectedKey] = useState(menuEntriesList[0].path);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      menuEntriesList.forEach((menuEntry) => {
        if (url.includes(menuEntry.path)) {
          setSelectedKey(menuEntry.path);
        }
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    handleRouteChange(router.asPath);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      className="header-nav"
      selectedKeys={[selectedKey]}
    >
      {menuEntries}
    </Menu>
  );
};
export default MainMenu;
