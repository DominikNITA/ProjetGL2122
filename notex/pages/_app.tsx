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

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const test = <span>HILLO MEIN FRAIND</span>;
  return (
    <SessionProvider session={session}>
      <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <Row justify="space-between">
            <Row>
              <div className="logo" />
              <div style={{ color: "white", fontWeight: 600 }}>Notex</div>
              <div>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                  <Menu.Item key="1"><Link href="/">Notes de frais</Link></Menu.Item>
                  <Menu.Item key="2">Validation</Menu.Item>
                  <Menu.Item key="3"><Link href="/dev">Dev</Link></Menu.Item>
                </Menu>
              </div>
            </Row>
            <Dropdown overlay={test}>
              <a className="ant-dropdown-link" href="#">
                <Avatar style={{ verticalAlign: 'middle' }}></Avatar> <ArrowDownOutlined />
                <ProfileBanner></ProfileBanner>
              </a>
            </Dropdown>
          </Row>
        </Header>
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
