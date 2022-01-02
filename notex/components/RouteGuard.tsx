import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession, GetSessionParams, useSession } from 'next-auth/react';
import { NextPage } from 'next';

export { RouteGuard };

const RouteGuard: NextPage = ({ children }: any) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const publicPaths = ['/auth/signin', '/dev'];
    const { data: session } = useSession();

    useEffect(() => {
        // on initial load - run auth check 
        authCheck(router.asPath);

        // on route change start - hide page content by setting authorized to false  
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        // on route change complete - run auth check 
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function authCheck(url: String) {
        // redirect to login page if accessing a private page and not logged in 
        const path = url.split('?')[0];
        console.log("path", path)
        console.log("session", session)
        if (session?.user == null && !publicPaths.includes(path)) {
            setAuthorized(false);
            router.push({
                pathname: '/auth/signin'
            });
        } else {
            setAuthorized(true);
        }
    }

    return (authorized && children);
}

export async function getServerSideProps(ctx: GetSessionParams | undefined) {
    return {
        props: {
            session: await getSession(ctx)
        }
    }
}