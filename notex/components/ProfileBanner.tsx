import {
  ArrowDownOutlined,
  LogoutOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import type { NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const Home: NextPage = () => {
  const { data: session } = useSession();
  console.log('sessionProfile', session);
  const dropdownMenu = (
    <Menu>
      <Menu.Item icon={<ProfileOutlined />}>
        <Link href="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item icon={<QuestionCircleOutlined />}>
        <Link href="/help">Aide</Link>
      </Menu.Item>
      <Menu.Item danger onClick={() => signOut()} icon={<LogoutOutlined />}>
        Se deconnecter
      </Menu.Item>
    </Menu>
  );

  return (
    <span>
      <Dropdown overlay={dropdownMenu}>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="ant-dropdown-link">
          {' '}
          <Avatar style={{ verticalAlign: 'middle' }}></Avatar>
          {`${session?.user?.surname} ${session?.user.name}`}
          <ArrowDownOutlined />
        </a>
      </Dropdown>
    </span>
  );
};
export default Home;
