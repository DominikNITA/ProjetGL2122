import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { createAuthUser } from '../services/authService'
import styles from '../styles/Home.module.css'
import { IUser, SetupDbBody } from '../utils/types'
import useSwr from 'swr'
import { Button, Space } from 'antd'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Home: NextPage = () => {

  const { data, error } = useSwr(`/api/setupDB`,
    fetcher
  )
  const setupDb = function (doClearDB: boolean, doInsertTestData: boolean) {
    const body: SetupDbBody = {
      doClearDB: doClearDB,
      doInsertTestData: doInsertTestData
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    fetch('/api/setupDB', requestOptions).then(response => {if(response.ok) console.log("Setup db succesful!")})
  }

  return (
    <div className={styles.container}>
      SETUP DB NOT WORKING - WIP
      <Space>
      <Button type='dashed' onClick={() => setupDb(true, false)}>Clear</Button>
      <Button type='primary' onClick={() => setupDb(false, true)}>Insert initial data</Button>
      </Space>
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
