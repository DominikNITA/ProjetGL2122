import { PlusCircleOutlined } from '@ant-design/icons';
import { blue, purple, red } from '@ant-design/colors';
import { Button, Col, Divider, List, Row, Space, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { AvanceState, NoteState } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { IAvance } from '../types';
import {
    deleteAvance,
    getAvancesForUser,
    getUserBalance,
} from '../clients/avanceClient';
import CreateAvanceModal from '../components/CreateAvanceModal';
import { avanceStateTag } from '../utility/common';

const AvancesPage = () => {
    const [avances, setAvances] = useState<IAvance[]>([]);
    const [balance, setBalance] = useState<Number>();
    const auth = useAuth();

    useEffect(() => {
        if (auth?.user?._id == null) return;
        getAvancesForUser(auth!.user!._id, [
            AvanceState.Created,
            AvanceState.Validated,
            AvanceState.Refused,
        ]).then((response) => {
            if (response.isOk) {
                setAvances(response!.data!);
            }
        });
        getUserBalance(auth!.user!._id).then((response) => {
            if (response.isOk) {
                setBalance(response!.data!);
            }
        });
    }, [auth]);

    const handleDelete = (item: IAvance) => {
        setAvances(avances.filter((avance) => item._id != avance._id));
    };

    const createAvanceModalRef = useRef<any>();

    return (
        <div>
            <CreateAvanceModal ref={createAvanceModalRef}></CreateAvanceModal>
            <Row justify="center">
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={() => createAvanceModalRef.current?.showModal()}
                >
                    Demander une avance
                </Button>
            </Row>
            <Divider></Divider>
            <h2 style={{ textAlign: 'center' }}>Mes Avances:</h2>
            <h3 style={{ textAlign: 'center' }}>
                Ma balance de mes avances :
                {balance != undefined && balance >= 0 ? (
                    <b style={{ color: 'green' }}> +{balance} € </b>
                ) : (
                    <b style={{ color: 'red' }}> {balance} € </b>
                )}
            </h3>
            {avances.length == 0 ? (
                <div style={{ textAlign: 'center' }}>
                    Vous n'avez pas encore d'avances
                </div>
            ) : (
                <Space direction="vertical" size={25} style={{ width: '100%' }}>
                    <Col span={12} offset={6}>
                        <List
                            size="large"
                            bordered
                            dataSource={avances}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        avanceStateTag(item.state),
                                        <Link to={`/avances/${item._id}`}>
                                            Visualiser
                                        </Link>,
                                        item.state == AvanceState.Created ? (
                                            <Popconfirm
                                                title="Confirmer la supression ?"
                                                onConfirm={() => {
                                                    deleteAvance(item._id);
                                                    handleDelete(item);
                                                }}
                                                okText="Oui"
                                                cancelText="Non"
                                            >
                                                <Button
                                                    style={{
                                                        color: red.primary,
                                                    }}
                                                >
                                                    Supprimer
                                                </Button>
                                            </Popconfirm>
                                        ) : null,
                                    ]}
                                    key={item._id}
                                >
                                    {item.description}
                                </List.Item>
                            )}
                        />
                    </Col>
                </Space>
            )}
        </div>
    );
};

export default AvancesPage;
