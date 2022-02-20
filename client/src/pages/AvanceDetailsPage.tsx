import { PlusCircleOutlined } from '@ant-design/icons';
import { blue, purple, red } from '@ant-design/colors';
import { Button, Col, Divider, List, Row, Space, Popconfirm } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AvanceState } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { IAvance, IMission, INoteLine } from '../types';
import {
    getAvance,
    getAvanceBalance,
    getNoteLines,
} from '../clients/avanceClient';
import CorrelateNoteLineModal from '../components/CorrelateNoteLineModal';
import { avanceStateTag } from '../utility/common';
import { getMission } from '../clients/missionClient';

const AvancesPage = () => {
    const [avance, setAvance] = useState<IAvance>();
    const [noteLines, setNoteLines] = useState<INoteLine[]>();
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
    }, [auth]);

    useEffect(() => {
        getMission(avance?.mission).then((response) => {
            if (response?.isOk) {
                setMission(response.data!);
            }
        });
        getNoteLines(params.avanceId!).then((response) => {
            if (response?.isOk) {
                setNoteLines(response.data!);
            }
        });
    }, [avance]);

    const updateNoteLineModalRef = useRef<any>();

    return (
        <div>
            <CorrelateNoteLineModal
                ref={updateNoteLineModalRef}
            ></CorrelateNoteLineModal>
            <h2 style={{ textAlign: 'center' }}>Détails de l'avance :</h2>
            <h3 style={{ textAlign: 'center' }}>
                Montant de l'avance : {avance?.amount} €
            </h3>
            <h3 style={{ textAlign: 'center' }}>
                Description : {avance?.description}
            </h3>
            <h3 style={{ textAlign: 'center' }}>Mission : {mission?.name}</h3>
            <h3 style={{ textAlign: 'center' }}>
                {avanceStateTag(avance?.state as AvanceState)}
            </h3>
            <Divider></Divider>
            <h3 style={{ textAlign: 'center' }}>
                Balance de l'avance :
                {balance != undefined && balance >= 0 ? (
                    <b style={{ color: 'green' }}> + {balance} € </b>
                ) : (
                    <b style={{ color: 'red' }}> {balance} € </b>
                )}
            </h3>
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
