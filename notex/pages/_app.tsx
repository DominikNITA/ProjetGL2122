import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { getSession, GetSessionParams, SessionProvider } from 'next-auth/react';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React from 'react';
import FixedHeader from '../components/FixedHeader';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <FixedHeader></FixedHeader>
        <Layout
          style={{ padding: '0 50px', paddingTop: 64, minHeight: '100vh' }}
        >
          <Content className="site-layout">
            <div
              className="site-layout-background"
              style={{ padding: 24, margin: 0 }}
            >
              {/* <RouteGuard> */}
              <Component {...pageProps} />
              {/* </RouteGuard> */}
            </div>
          </Content>
        </Layout>
      </Layout>
    </SessionProvider>
  );
}

export async function getServerSideProps(ctx: GetSessionParams | undefined) {
  return {
    props: {
      session: await getSession(ctx),
    },
  };
}

export default MyApp;
