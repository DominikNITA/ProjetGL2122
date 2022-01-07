import './App.css';
import { AuthProvider } from './stateProviders/authProvider';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ValidationPage from './pages/ValidationPage';
import NotesPage from './pages/NotesPages';
import { RequireAuth } from './utility/RequireAuth';
import LoginPage from './pages/LoginPage';
import { Layout } from 'antd';
import FixedHeader from './components/FixedHeader';
import { Content } from 'antd/lib/layout/layout';

function App() {
    return (
        <AuthProvider>
            <Layout>
                <FixedHeader></FixedHeader>
                <Layout
                    style={{
                        padding: '0 50px',
                        paddingTop: 64,
                        minHeight: '100vh',
                    }}
                >
                    <Content className="site-layout">
                        <div
                            className="site-layout-background"
                            style={{ padding: 24, margin: 0 }}
                        >
                            <div className="container-fluid">
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route
                                        path="validation"
                                        element={
                                            <RequireAuth>
                                                <ValidationPage />
                                            </RequireAuth>
                                        }
                                    />
                                    <Route
                                        path="notes"
                                        element={<NotesPage />}
                                    />
                                    <Route
                                        path="login"
                                        element={<LoginPage />}
                                    />
                                </Routes>
                            </div>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </AuthProvider>
    );
}

export default App;
