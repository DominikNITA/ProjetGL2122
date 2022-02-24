import './App.css';
import { AuthProvider } from './stateProviders/authProvider';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ValidationPage from './pages/ValidationPage';
import ServicePage from './pages/ServicePage';
import NotesPage from './pages/NotesPages';
import AvancesPage from './pages/AvancesPage';
import AvanceDetailsPage from './pages/AvanceDetailsPage';
import { RequireAuth } from './utility/RequireAuth';
import LoginPage from './pages/LoginPage';
import { Layout } from 'antd';
import FixedHeader from './components/FixedHeader';
import { Content } from 'antd/lib/layout/layout';
import DevPage from './pages/DevPage';
import { OnlyInDevPage } from './utility/OnlyInDevPage';
import NoteDetailsPage from './pages/NoteDetailsPage';
import { NoteDetailsManagerProvider } from './stateProviders/noteDetailsManagerProvider';
import { SelectedMissionProvider } from './stateProviders/selectedMissionProvider';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import { UserRole } from './enums';
import HelpPage from './pages/HelpPage';

function App() {
    return (
        <AuthProvider>
            <Layout>
                <FixedHeader></FixedHeader>
                <Layout className="site-layout">
                    <Content>
                        <div
                            className="site-layout-background"
                            style={{ padding: 12, margin: 0 }}
                        >
                            <div className="container-fluid">
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route
                                        path="validation"
                                        element={
                                            <RequireAuth
                                                allowedRoles={[UserRole.Leader]}
                                            >
                                                <ValidationPage />
                                            </RequireAuth>
                                        }
                                    />
                                    <Route
                                        path="service"
                                        element={
                                            <RequireAuth
                                                allowedRoles={[UserRole.Leader]}
                                            >
                                                <SelectedMissionProvider>
                                                    <ServicePage />
                                                </SelectedMissionProvider>
                                            </RequireAuth>
                                        }
                                    />
                                    <Route
                                        path="notes"
                                        element={
                                            <RequireAuth>
                                                <NotesPage />
                                            </RequireAuth>
                                        }
                                    ></Route>
                                    <Route
                                        path="avances"
                                        element={
                                            <RequireAuth>
                                                <AvancesPage />
                                            </RequireAuth>
                                        }
                                    ></Route>
                                    <Route
                                        path="profile"
                                        element={
                                            <RequireAuth>
                                                <ProfilePage />
                                            </RequireAuth>
                                        }
                                    ></Route>
                                    <Route
                                        path="help"
                                        element={
                                            <RequireAuth>
                                                <HelpPage />
                                            </RequireAuth>
                                        }
                                    ></Route>
                                    <Route
                                        path="settings"
                                        element={
                                            <RequireAuth
                                                allowedRoles={[
                                                    UserRole.Director,
                                                    UserRole.FinanceLeader,
                                                ]}
                                            >
                                                <SettingsPage />
                                            </RequireAuth>
                                        }
                                    ></Route>
                                    <Route
                                        path="notes/:noteId"
                                        element={
                                            <RequireAuth>
                                                <NoteDetailsManagerProvider>
                                                    <NoteDetailsPage />
                                                </NoteDetailsManagerProvider>
                                            </RequireAuth>
                                        }
                                    />
                                    <Route
                                        path="avances/:avanceId"
                                        element={
                                            <RequireAuth>
                                                <AvanceDetailsPage />
                                            </RequireAuth>
                                        }
                                    />
                                    <Route
                                        path="login"
                                        element={<LoginPage />}
                                    />
                                    <Route
                                        path="dev"
                                        element={
                                            <OnlyInDevPage>
                                                <DevPage />
                                            </OnlyInDevPage>
                                        }
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
