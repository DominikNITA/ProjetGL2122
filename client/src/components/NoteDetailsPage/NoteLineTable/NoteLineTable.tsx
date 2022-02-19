import { blue, red, purple } from '@ant-design/colors';
import {
    CheckOutlined,
    CloseCircleOutlined,
    CloseOutlined,
    ZoomInOutlined,
} from '@ant-design/icons';
import {
    Alert,
    Button,
    Col,
    Collapse,
    Divider,
    Popconfirm,
    Row,
    Space,
    Table,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { changeNoteLineState } from '../../../clients/noteClient';
import {
    FraisType,
    NoteLineState,
    NoteState,
    NoteViewMode,
} from '../../../enums';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';
import { IMission, INoteLine } from '../../../types';
import {
    convertToDate,
    FormMode,
    getFrenchFraisType,
    getJustificatifUrl,
    noteLineStateTag,
} from '../../../utility/common';
import CancelButton from '../../CancelButton';
import CreateNoteLineButton from '../../CreateNoteLineButton';
import ValidateButton from '../../ValidateButton';
import ActionButtons from './ActionButtons';
import { KilometriqueCell } from './KilometriqueCell';

import './noteLineTable.css';

const { Panel } = Collapse;

type Props = {
    noteLines: INoteLine[];
    openModifyModal: (formMode: FormMode) => void;
    openJustificatifPreview: (src: string | null) => void;
    openCommentModal: (noteLinesToComment: INoteLine[]) => void;
};

const NoteLineTable = ({
    noteLines,
    openModifyModal,
    openJustificatifPreview,
    openCommentModal,
}: Props) => {
    const [uniqueMissions, setUniqueMissions] = useState<IMission[]>([]);
    const noteDetailsManager = useNoteDetailsManager();

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

    const allColumns: ColumnsType<INoteLine> = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: '100px',
            render: (date: moment.Moment) => {
                console.log(date);
                return <span>{date.format('L')}</span>;
            },
        },
        {
            title: 'Type de depense',
            dataIndex: 'fraisType',
            key: 'fraisType',
            width: '1px',
            render: (text: any, record: INoteLine) => (
                <span>{getFrenchFraisType(record.fraisType)}</span>
            ),
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
            align: 'right',
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
            align: 'right',
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
            align: 'right',
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
            title: 'Justificatif',
            key: 'justificatif',
            width: '1px',
            align: 'center',
            render: (text: any, record: INoteLine) => (
                <>
                    {record.justificatif == null ||
                    record.justificatif == '' ? (
                        <CloseOutlined></CloseOutlined>
                    ) : (
                        <ZoomInOutlined
                            onClick={() =>
                                openJustificatifPreview(
                                    getJustificatifUrl(record.justificatif)
                                )
                            }
                        ></ZoomInOutlined>
                    )}
                </>
            ),
        },
        {
            title: 'Etat de validation',
            key: 'state',
            width: '1px',
            align: 'center',
            render: (text: any, record: INoteLine) => (
                <span>{noteLineStateTag(record.state)}</span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '1px',
            render: (text: any, record: INoteLine) => (
                <ActionButtons
                    openModifyModal={openModifyModal}
                    noteLine={record}
                    openCommentModal={openCommentModal}
                ></ActionButtons>
            ),
        },
    ];

    const [displayColumns, setDisplayColumns] =
        useState<ColumnsType<INoteLine>>(allColumns);
    useEffect(() => {
        if (noteDetailsManager.viewMode == NoteViewMode.InitialCreation) {
            setDisplayColumns(allColumns.filter((x) => x.key != 'state'));
        } else if (
            noteDetailsManager.currentNote?.state == NoteState.Validated
        ) {
            setDisplayColumns(allColumns.filter((x) => x.key != 'state'));
        } else {
            setDisplayColumns(allColumns);
        }
    }, [noteDetailsManager.viewMode]);

    return (
        <Col>
            <Collapse>
                {uniqueMissions.map((mission) => {
                    const linesInMission = noteLines.filter(
                        (x) => x.mission._id === mission._id
                    );
                    return (
                        <Panel
                            extra={
                                noteDetailsManager.viewMode ==
                                    NoteViewMode.Validate && (
                                    <Space align="end">
                                        <CancelButton
                                            handleCancel={(e) => {
                                                e.stopPropagation();
                                                openCommentModal(
                                                    linesInMission
                                                );
                                            }}
                                            text={
                                                <span>
                                                    Rejeter toute la mission{' '}
                                                    <CloseOutlined></CloseOutlined>
                                                </span>
                                            }
                                        ></CancelButton>
                                        <ValidateButton
                                            handleValidate={(e) => {
                                                e.stopPropagation();
                                                linesInMission.forEach((l) =>
                                                    changeNoteLineState(
                                                        l._id,
                                                        NoteLineState.Validated
                                                    )
                                                );
                                                noteDetailsManager.reload();
                                            }}
                                            text={
                                                <span>
                                                    Valider toute la mission{' '}
                                                    <CheckOutlined></CheckOutlined>
                                                </span>
                                            }
                                        ></ValidateButton>
                                    </Space>
                                )
                            }
                            header={
                                <Row
                                    justify="space-between"
                                    style={{ width: '100%' }}
                                >
                                    <Space
                                        split={
                                            <Divider type="vertical"></Divider>
                                        }
                                    >
                                        <strong>{mission.name}</strong>
                                        {linesInMission.length +
                                            ' remboursement(s)'}
                                        {'TTC: ' +
                                            noteLines
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
                                                .toFixed(2) +
                                            '€'}
                                    </Space>
                                </Row>
                            }
                            key={mission._id}
                            className="noPadding"
                        >
                            <Table
                                key={mission._id}
                                columns={displayColumns}
                                dataSource={noteLines.filter(
                                    (x) => x.mission._id === mission._id
                                )}
                                size="small"
                                pagination={false}
                                rowClassName={(record, index) =>
                                    index % 2 === 0
                                        ? 'table-row-light'
                                        : 'table-row-dark'
                                }
                                expandable={{
                                    expandedRowRender: (noteLine) => (
                                        <Alert
                                            style={{
                                                width: 'fit-content',
                                                margin: 'auto',
                                            }}
                                            type={
                                                noteLine.state ==
                                                NoteLineState.Fixing
                                                    ? 'error'
                                                    : 'info'
                                            }
                                            message={noteLine.comment}
                                        ></Alert>
                                    ),
                                    rowExpandable: (noteLine) =>
                                        noteLine.comment != null &&
                                        ![
                                            NoteLineState.Created,
                                            NoteLineState.Validated,
                                        ].includes(noteLine.state),
                                    showExpandColumn: false,
                                    defaultExpandAllRows: true,
                                }}
                            />
                            {[
                                NoteViewMode.InitialCreation,
                                NoteViewMode.Fix,
                            ].includes(noteDetailsManager.viewMode) && (
                                <CreateNoteLineButton
                                    onClick={() => {
                                        noteDetailsManager?.updateNoteLine({
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
                            )}
                        </Panel>
                    );
                })}
            </Collapse>
        </Col>
    );
};

export default NoteLineTable;
