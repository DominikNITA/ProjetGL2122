import { useNavigate } from 'react-router-dom';

export function OnlyInDevPage({ children }: { children: JSX.Element }) {
    const navigate = useNavigate();
    if (process.env.NODE_ENV === 'production') {
        navigate('/');
        return <></>;
    }

    return children;
}
