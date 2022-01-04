import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
export { RouteGuard };

const RouteGuard = ({ children }: any) => {
  const router = useRouter();
  const [authorized] = useState(false);
  //   const publicPaths = ['/auth/signin', '/dev']
  const { data: session } = useSession();

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // // on route change start - hide page content by setting authorized to false
    // const hideContent = () => setAuthorized(false);
    // router.events.on('routeChangeStart', hideContent);

    // // on route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck);

    // // unsubscribe from events in useEffect return function
    return () => {
      // router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function authCheck(url: string) {
    // redirect to login page if accessing a private page and not logged in
    const path = url.split('?')[0];
    console.log('path', path);
    console.log('session', session);
    // if (session?.user == null && !publicPaths.includes(path)) {
    //     setAuthorized(false);
    //     router.push({
    //         pathname: '/auth/signin'
    //     });
    // } else {
    //     setAuthorized(true);
    // }
  }
  console.log('authorized', authorized);
  return authorized && children;
};

// export async function getServerSideProps(ctx: GetSessionParams | undefined) {
//     return {
//         props: {
//             session: await getSession(ctx)
//         }
//     }
// }