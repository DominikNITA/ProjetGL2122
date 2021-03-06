import { Divider } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { Link } from 'react-router-dom';
import MainMenu from './MainMenu';
import ProfileBanner from './ProfileBanner';

const FixedHeader = () => {
    return (
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <div className="container-fluid">
                <div className="header">
                    <div className="header-left">
                        <a href="/">
                            <img
                                src="../../notex.png"
                                alt="notex"
                                width="48"
                                height="48"
                            />
                        </a>
                        <Link
                            to="/"
                            style={{
                                color: 'white',
                                fontWeight: 600,
                                width: '50px',
                            }}
                        >
                            Notex
                        </Link>
                        <Divider type="vertical"></Divider>
                        <MainMenu></MainMenu>
                    </div>
                    <div className="header-right">
                        <ProfileBanner></ProfileBanner>
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
    );
};
export default FixedHeader;
