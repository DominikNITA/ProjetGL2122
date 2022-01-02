import { ArrowDownOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, Divider, Dropdown, Menu, Row } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { createAuthUser } from '../services/authService'
import styles from '../styles/Home.module.css'
import { IUser } from '../utils/types'
import ProfileBanner from './ProfileBanner'

const FixedHeader: NextPage = () => {
    const test = <span>HILLO MEIN FRAIND</span>;

    return (
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <div className='container-fluid'>
                <div className='header'>
                    <div className='header-left'>
                        <div className="logo" />
                        <Link href="/"><a style={{ color: "white", fontWeight: 600, width: "50px" }}>Notex</a></Link>
                        <Divider type='vertical'></Divider>
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} className='header-nav'>
                            <Menu.Item key="1"><Link href="/notes">Notes de frais</Link></Menu.Item>
                            <Menu.Item key="2"><Link href="/validation">Validation</Link></Menu.Item>
                            <Menu.Item key="3"><Link href="/dev">Dev</Link></Menu.Item>
                        </Menu>
                    </div>
                    <div className='header-right'>
                        <Dropdown overlay={test}>
                            <a className="ant-dropdown-link" href="#">
                                <Avatar style={{ verticalAlign: 'middle' }}></Avatar> 
                                <ProfileBanner></ProfileBanner>
                                <ArrowDownOutlined />
                            </a>
                        </Dropdown>
                    </div>
                </div>
            </div>
            {/* <Row>
                <Col flex="auto" span={18}>
                    <div className="logo" />
                    <div style={{ color: "white", fontWeight: 600, width: "50px" }}>Notex</div>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                        <Menu.Item key="1"><Link href="/">Notes de frais</Link></Menu.Item>
                        <Menu.Item key="2">Validation</Menu.Item>
                        <Menu.Item key="3"><Link href="/dev">Dev</Link></Menu.Item>
                    </Menu>
                </Col>
                <Col span={6}>
                    <Dropdown overlay={test}>
                        <a className="ant-dropdown-link" href="#">
                            <Avatar style={{ verticalAlign: 'middle' }}></Avatar> <ArrowDownOutlined />
                            <ProfileBanner></ProfileBanner>
                        </a>
                    </Dropdown>
                </Col>
            </Row> */}
        </Header>
    )
}
export default FixedHeader

