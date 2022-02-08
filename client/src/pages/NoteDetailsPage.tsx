import { blue, purple, red } from '@ant-design/colors';
import {
    Button,
    Col,
    Collapse,
    Descriptions,
    Divider,
    PageHeader,
    Popconfirm,
    Row,
    Space,
    Table,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCalculatedPrice, getNote } from '../clients/noteClient';
import CreateNoteLineButton from '../components/CreateNoteLineButton';
import ModifyNoteLineModal from '../components/NoteLine/ModifyNoteLineModal';
import { FraisType } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { useSelectedNoteLine } from '../stateProviders/selectedNoteLineProvider';
import { INoteLine, IMission } from '../types';
import { FormMode, getFrenchMonth, noteStateTag } from '../utility/common';
const { Panel } = Collapse;

const NoteDetailsPage = () => {
    const [noteLines, setNoteLines] = useState<INoteLine[]>([]);
    const [titleText, setTitleText] = useState('');
    const [uniqueMissions, setUniqueMissions] = useState<IMission[]>([]);
    const auth = useAuth();
    const selectedNoteLine = useSelectedNoteLine();
    const params = useParams();

    useEffect(() => {
        getNote(params.noteId!).then((response) => {
            if (response?.isOk) {
                selectedNoteLine.updateCurrentNote(response!.data!);
                setNoteLines(response.data!.noteLines!);
                setTitleText(
                    `Note de frais de ${getFrenchMonth(
                        response!.data!.month
                    )} ${response!.data!.year}`
                );
            } else {
                //TODO: Redirect to notes? Show some message?
            }
        });
    }, [auth, params.noteId, selectedNoteLine.reloadHack]);

    useEffect(() => {
        const uniqueMissionsTemp: IMission[] = [];
        noteLines.forEach((noteLine) => {
            if (
                !uniqueMissionsTemp.some((x) => x._id === noteLine.mission._id)
            ) {
                uniqueMissionsTemp.push(noteLine.mission);
            }
        });
        setUniqueMissions(uniqueMissionsTemp);
    }, [noteLines]);

    const modifyNoteLineModalRef = useRef<any>();

    const KilometriqueCell = (record: INoteLine) => {
        const [price, setPrice] = useState(0);

        useEffect(() => {
            getCalculatedPrice(
                record.vehicle!._id,
                record.kilometerCount!,
                record.date as Date
            ).then((x) => {
                if (x.isOk) {
                    setPrice(x.data!);
                }
            });
        }, []);

        return <span>{price.toFixed(2)}€</span>;
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: '100px',
            render: (date: Date) => {
                const correctDate = new Date(
                    Date.parse(date as unknown as string)
                );
                return <span>{correctDate.toLocaleDateString('fr')}</span>;
            },
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: 'TTC',
            key: 'ttc',
            width: '100px',
            render: (text: any, record: INoteLine) => {
                if (record.fraisType == FraisType.Standard) {
                    return <span>{record.ttc!.toFixed(2)}€</span>;
                } else {
                    return KilometriqueCell(record);
                }
            },
        },
        {
            title: 'TVA',
            dataIndex: 'tva',
            key: 'tva',
            width: '100px',
            render: (text: any, record: INoteLine) => {
                if (record.fraisType == FraisType.Standard) {
                    return <span>{record.tva!.toFixed(2)}€</span>;
                } else {
                    return <span>---</span>;
                }
            },
        },
        {
            title: 'HT',
            dataIndex: 'ht',
            key: 'ht',
            width: '100px',
            render: (text: any, record: INoteLine) => {
                if (record.fraisType == FraisType.Standard) {
                    return <span>{record.ht!.toFixed(2)}€</span>;
                } else {
                    return <span>---</span>;
                }
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '1px',
            render: (text: any, record: INoteLine) => (
                <Space size="middle">
                    <Button
                        style={{ color: blue.primary }}
                        onClick={() => {
                            selectedNoteLine?.updateNoteLine(record);
                            modifyNoteLineModalRef.current?.showModal(
                                FormMode.Modification
                            );
                        }}
                    >
                        Modifier
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this task?"
                        onConfirm={() => console.log('Delete note line : TODO')}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button style={{ color: red.primary }}>
                            Supprimer
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <ModifyNoteLineModal
                ref={modifyNoteLineModalRef}
            ></ModifyNoteLineModal>
            <Space direction="vertical" size={25} style={{ width: '100%' }}>
                <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    title={titleText}
                    subTitle="Work in progress"
                    extra={[
                        <Button key="2">Test</Button>,
                        <Button key="1" type="primary">
                            Envoyer a la validation (TODO)
                        </Button>,
                    ]}
                >
                    {selectedNoteLine.currentNote != null && (
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="Demandeur">
                                {`${
                                    selectedNoteLine.currentNote!.owner
                                        .firstName
                                } 
                                    ${
                                        selectedNoteLine.currentNote!.owner
                                            .lastName
                                    }`}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total TTC">
                                {noteLines
                                    .reduce(
                                        (prev, curr) =>
                                            prev +
                                            (curr.fraisType ==
                                            FraisType.Standard
                                                ? curr.ttc!
                                                : 0), //TODO: dirty hack - do some proper function for calculating kilometrique frais later :)
                                        0
                                    )
                                    .toFixed(2)}
                                €
                            </Descriptions.Item>
                            <Descriptions.Item label="Date de creation">
                                2022-01-10
                            </Descriptions.Item>
                            <Descriptions.Item label="Statut">
                                {noteStateTag(
                                    selectedNoteLine.currentNote.state
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Remboursements">
                                {noteLines.length}
                            </Descriptions.Item>
                        </Descriptions>
                    )}
                </PageHeader>
                <CreateNoteLineButton
                    onClick={() => {
                        selectedNoteLine?.updateNoteLine(null);
                        modifyNoteLineModalRef.current?.showModal(
                            FormMode.Creation
                        );
                    }}
                    text="Ajouter un remboursement"
                ></CreateNoteLineButton>
                <Col>
                    <Collapse>
                        {uniqueMissions.map((mission) => {
                            return (
                                <Panel
                                    header={
                                        <>
                                            <strong>{mission.name}</strong>{' '}
                                            <Divider type="vertical"></Divider>
                                            {
                                                noteLines.filter(
                                                    (x) =>
                                                        x.mission._id ===
                                                        mission._id
                                                ).length
                                            }{' '}
                                            remboursement(s)
                                            <Divider type="vertical"></Divider>
                                            TTC:{' '}
                                            {noteLines
                                                .filter(
                                                    (x) =>
                                                        x.mission._id ===
                                                        mission._id
                                                )
                                                .reduce(
                                                    (prev, curr) =>
                                                        prev +
                                                        (curr.fraisType ==
                                                        FraisType.Standard
                                                            ? curr.ttc!
                                                            : 0),
                                                    0
                                                )
                                                .toFixed(2)}
                                            €
                                        </>
                                    }
                                    key={mission._id}
                                    className="noPadding"
                                >
                                    <Table
                                        columns={columns}
                                        dataSource={noteLines.filter(
                                            (x) => x.mission._id === mission._id
                                        )}
                                        size="small"
                                        pagination={false}
                                    />
                                    <CreateNoteLineButton
                                        onClick={() => {
                                            selectedNoteLine?.updateNoteLine({
                                                mission: mission,
                                                date: mission.startDate,
                                                fraisType: FraisType.Standard,
                                            });
                                            modifyNoteLineModalRef.current?.showModal(
                                                FormMode.Creation
                                            );
                                        }}
                                        text="Ajouter un nouveau remboursement pour cette mission"
                                        rowStyle={{ padding: '1rem' }}
                                        buttonStyle={{
                                            background: purple[4],
                                            borderColor: purple[6],
                                        }}
                                    ></CreateNoteLineButton>
                                </Panel>
                            );
                        })}
                    </Collapse>
                </Col>
                {noteLines.length >= 10 && (
                    <CreateNoteLineButton
                        onClick={() => {
                            selectedNoteLine?.updateNoteLine(null);
                            modifyNoteLineModalRef.current?.showModal(
                                FormMode.Creation
                            );
                        }}
                        text="Ajouter un remboursement"
                    ></CreateNoteLineButton>
                )}
            </Space>
        </div>
    );
};

export default NoteDetailsPage;
