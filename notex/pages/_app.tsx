import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import 'antd/dist/antd.css';
import { Avatar, Breadcrumb, Dropdown, Layout, Menu, Row } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import React from 'react';
import Sider from 'antd/lib/layout/Sider';
import SubMenu from 'antd/lib/menu/SubMenu';
import Icon, { ArrowDownOutlined, LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons'
import Link from 'next/link';
import ProfileBanner from '../components/ProfileBanner';
import { RouteGuard } from '../components/RouteGuard';
import FixedHeader from '../components/FixedHeader';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <FixedHeader></FixedHeader>
        <Layout style={{ padding: '0 50px', paddingTop: 64, minHeight: "100vh" }}>
          <Content className="site-layout">
            <div className="site-layout-background" style={{ padding: 24, margin: 0 }}>
              <RouteGuard>
                <Component {...pageProps} />
              </RouteGuard>
            </div>
          </Content>
        </Layout>
      </Layout>
    </SessionProvider >
  )
}

export default MyApp
