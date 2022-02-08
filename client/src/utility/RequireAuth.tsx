import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../stateProviders/authProvider';

export function RequireAuth({ children }: { children: JSX.Element }) {
    const auth = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (
            auth?.user == null &&
            process.env.REACT_APP_BYPASS_AUTH !== 'true'
        ) {
            navigate('/login', { state: { from: location } });
        }
    }, [auth]);

    // if ((!auth || !auth.user) && process.env.REACT_APP_BYPASS_AUTH !== 'true') {
    //     // Redirect them to the /login page, but save the current location they were
    //     // trying to go to when they were redirected. This allows us to send them
    //     // along to that page after they login, which is a nicer user experience
    //     // than dropping them off on the home page.
    //     return <Navigate to="/login" state={{ from: location }} replace />;
    // }

    return children;
}
