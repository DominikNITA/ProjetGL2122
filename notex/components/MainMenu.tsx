import { Menu } from 'antd';
import type { NextPage } from 'next';
import Link from 'next/link';

interface MenuEntry {
  path: string;
  text: string;
  isVisible: () => boolean;
}

const MainMenu: NextPage = () => {
  //const { data: session } = useSession();
  //const router = useRouter();
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
  return (
    <Menu theme="dark" mode="horizontal" className="header-nav">
      {menuEntries}
    </Menu>
  );
};
export default MainMenu;
