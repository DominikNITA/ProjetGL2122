import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { createAuthUser } from '../services/authService'
import styles from '../styles/Home.module.css'
import {IUser} from '../utils/types'
import useSwr from 'swr'

const fetcher = (url :string) => fetch(url).then((res) => res.json())

const Home: NextPage = () => {

    const { data, error } = useSwr(`/api/setupDB`,
      fetcher
    )
  return (
    <div className={styles.container}>
      SETUP DB NOT WORKING - WIP

    </div>
  )
}

export function getStaticProps() {
    return {
      props: {
         // returns the default 404 page with a status code of 404 in production
         notFound: process.env.NODE_ENV === 'production'
      }
    }
  }

// export async function getServerSideProps() {
//   const newUser: IUser = {name: "Test", email: "test.user@abc.com", surname: "User"};
//   await createAuthUser(newUser, "123456");
//   // Pass data to the page via props
//   return {props: {}}
// }

export default Home
