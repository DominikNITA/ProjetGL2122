import { blue, red } from '@ant-design/colors';
import { useState, useRef, useEffect } from 'react';
import { Button, Col, Divider, List, Row, Space, Tag } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../stateProviders/authProvider';
import {
    getServiceUsers,
    getMissionsByService,
} from '../clients/serviceClient';
import { useSelectedMission } from '../stateProviders/selectedMissionProvider';
import { IMission, IUser } from '../types';
import ModifyMissionModal from '../components/ModifyMissionModal';

const ServicePage = () => {
    const [missions, setMissions] = useState<IMission[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);

    const selectedMission = useSelectedMission();
    const auth = useAuth();

    function isUserLeader(userId: string | undefined) {
        return userId == auth?.user?.service?.leader;
    }

    useEffect(() => {
        getServiceUsers(auth!.user!.service._id).then((response) => {
            if (response.isOk) {
                setUsers(response!.data!);
            }
        });
        getMissionsByService(auth!.user!.service._id).then((response) => {
            if (response.isOk) {
                setMissions(response!.data!);
            }
        });
    }, [auth, selectedMission.reloadHack]);

    const modifyMissionModalRef = useRef<any>();

    return (
        <div>
            {/*     HEADER      */}
            {isUserLeader(auth?.user?._id) ? (
                <ModifyMissionModal
                    ref={modifyMissionModalRef}
                ></ModifyMissionModal>
            ) : null}
            {/*     HEADER      */}
            <h2 style={{ textAlign: 'center' }}> Mon service :</h2>
            {auth?.user?.service != null ? (
                <h2 style={{ textAlign: 'center', fontSize: '250%' }}>
                    {auth?.user?.service.name}
                </h2>
            ) : (
                <h2 style={{ textAlign: 'center' }}>Aucun Service</h2>
            )}
            {/*     MISSIONS ARRAY     */}
            <h2 style={{ textAlign: 'center' }}>Missions du service :</h2>
            {missions.length == 0 ? (
                <div>Service has no missions!</div>
            ) : (
                <Space direction="vertical" size={25} style={{ width: '100%' }}>
                    <Col span={12} offset={6}>
                        <List
                            size="default"
                            bordered
                            dataSource={missions}
                            renderItem={(item) => (
                                <List.Item
                                    actions={
                                        isUserLeader(auth?.user?._id)
                                            ? [
                                                  <Button
                                                      style={{
                                                          color: blue.primary,
                                                      }}
                                                      onClick={() => {
                                                          selectedMission?.updateMission(
                                                              item
                                                          );
                                                          modifyMissionModalRef.current?.showModal();
                                                      }}
                                                  >
                                                      Modifier
                                                  </Button>,
                                              ]
                                            : []
                                    }
                                    key={item._id}
                                >
                                    {item.name}
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Row justify="center"></Row>
                </Space>
            )}
            {/*     CREATE MISSION BUTTON (LEADER ONLY)     */}
            {isUserLeader(auth?.user?._id) ? (
                <Row justify="center">
                    <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        onClick={() => {
                            selectedMission?.updateMission(null);
                            modifyMissionModalRef.current?.showModal();
                        }}
                    >
                        Ajouter une mission
                    </Button>
                </Row>
            ) : null}
            <Divider></Divider>
            {/*     USER ARRAY     */}
            <h2 style={{ textAlign: 'center' }}>Collaborateurs du service :</h2>
            {users.length == 0 ? (
                <div>Service has no users!</div>
            ) : (
                <Space direction="vertical" size={25} style={{ width: '100%' }}>
                    <Col span={12} offset={5}>
                        <List
                            size="small"
                            dataSource={users}
                            renderItem={(item) => (
                                <List.Item key={item._id}>
                                    {item.firstName + ' ' + item.lastName}
                                    {isUserLeader(item._id) ? (
                                        <> (Chef du service)</>
                                    ) : null}
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Row justify="center"></Row>
                </Space>
            )}
        </div>
    );
};

export default ServicePage;
