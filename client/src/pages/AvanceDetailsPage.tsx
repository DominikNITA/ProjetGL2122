import { PlusCircleOutlined } from '@ant-design/icons';
import { blue, purple, red } from '@ant-design/colors';
import {
    Button,
    Col,
    Divider,
    List,
    Row,
    Space,
    Popconfirm,
    PageHeader,
    Descriptions,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AvanceState } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { IAvance, IMission, INoteLine, IUser } from '../types';
import {
    getAvance,
    getAvanceBalance,
    getNoteLines,
} from '../clients/avanceClient';
import CorrelateNoteLineModal from '../components/CorrelateNoteLineModal';
import { avanceStateTag } from '../utility/common';
import { getMission } from '../clients/missionClient';
import { getUserById } from '../clients/userClient';

const AvancesPage = () => {
    const [avance, setAvance] = useState<IAvance>();
    const [noteLines, setNoteLines] = useState<INoteLine[]>();
    const [owner, setOwner] = useState<IUser>();
    const [mission, setMission] = useState<IMission>();
    const [balance, setBalance] = useState<Number>();
    const auth = useAuth();
    const params = useParams();

    useEffect(() => {
        if (params.avanceId! == null) return;
        getAvance(params.avanceId!).then((response) => {
            if (response?.isOk) {
                setAvance(response.data!);
            } else {
                //TODO: Redirect to notes? Show some message?
            }
        });
        getAvanceBalance(params.avanceId!).then((response) => {
            if (response?.isOk) {
                setBalance(response.data!);
            }
        });
        getNoteLines(params.avanceId!).then((response) => {
            if (response?.isOk) {
                setNoteLines(response.data!);
            }
        });
    }, [auth]);

    useEffect(() => {
        if (avance?.mission) {
            getMission(avance?.mission._id).then((response) => {
                if (response?.isOk) {
                    setMission(response.data!);
                }
            });
        }
        getUserById(avance?.owner).then((response) => {
            if (response?.isOk) {
                setOwner(response.data!);
            }
        });
    }, [avance]);

    const updateNoteLineModalRef = useRef<any>();

    return (
        <div>
            <CorrelateNoteLineModal
                ref={updateNoteLineModalRef}
            ></CorrelateNoteLineModal>

            <PageHeader
                className="AvancesDetailPageHeader"
                onBack={() => window.history.back()}
                title="Avance"
                subTitle={avanceStateTag(avance?.state as AvanceState)}
                ghost={false}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="Description">
                        {avance?.description}
                    </Descriptions.Item>
                    <Descriptions.Item label="Montant total">
                        {avance?.amount} €
                    </Descriptions.Item>
                    <Descriptions.Item label="Mission correspondante">
                        {mission?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Demandeur">
                        {owner?.firstName} {owner?.lastName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Balance de l'avance">
                        {balance != undefined && balance >= 0 ? (
                            <b style={{ color: 'green' }}> + {balance} € </b>
                        ) : (
                            <b style={{ color: 'red' }}> {balance} € </b>
                        )}
                    </Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <Divider></Divider>
            <h3 style={{ textAlign: 'center' }}>
                Lignes de notes de frais correspondantes
            </h3>
            <List
                size="default"
                bordered
                dataSource={noteLines}
                renderItem={(item) => (
                    <List.Item actions={[]} key={item._id}>
                        {item.date.toString().substring(0, 10)} /{' '}
                        {item.description} / {item.ttc}€
                    </List.Item>
                )}
            />
            <Row justify="center">
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={() => updateNoteLineModalRef.current?.showModal()}
                >
                    Modifier les missions correspondantes
                </Button>
            </Row>
            <Divider></Divider>
        </div>
    );
};

export default AvancesPage;
