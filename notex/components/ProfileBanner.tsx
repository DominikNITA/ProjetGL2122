import { Button } from 'antd'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import { createAuthUser } from '../services/authService'
import styles from '../styles/Home.module.css'
import {IUser} from '../utils/types'

const Home: NextPage = () => {
    const {data: session} = useSession();
    console.log(session)
    return (
    <div>
        {session?.user?.surname}
    </div>
  )
}


export default Home
