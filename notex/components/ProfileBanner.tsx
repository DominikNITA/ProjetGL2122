import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'

const Home: NextPage = () => {
    const {data: session} = useSession();
    console.log("sessionProfile", session)
    return (
    <span>
        {`${session?.user?.surname} ${session?.user.name}`}
    </span>
  )
}
export default Home
