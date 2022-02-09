import { blue, red, purple } from '@ant-design/colors';
import { Button, Col, Collapse, Divider, Popconfirm, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { FraisType } from '../../../enums';
import { useNoteDetailsManager } from '../../../stateProviders/selectedNoteLineProvider';
import { IMission, INoteLine } from '../../../types';
import { FormMode } from '../../../utility/common';
import CreateNoteLineButton from '../../CreateNoteLineButton';
import { KilometriqueCell } from './KilometriqueCell';

const { Panel } = Collapse;

type Props = {
    noteLines: INoteLine[];
    openModifyModal: (formMode: FormMode) => void;
};

const NoteLineTable = ({ noteLines, openModifyModal }: Props) => {
    const [uniqueMissions, setUniqueMissions] = useState<IMission[]>([]);
    const selectedNoteLine = useNoteDetailsManager();

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
                            openModifyModal(FormMode.Modification);
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
                                            (x) => x.mission._id === mission._id
                                        ).length
                                    }{' '}
                                    remboursement(s)
                                    <Divider type="vertical"></Divider>
                                    TTC:{' '}
                                    {noteLines
                                        .filter(
                                            (x) => x.mission._id === mission._id
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
                                    openModifyModal(FormMode.Creation);
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
    );
};

export default NoteLineTable;
