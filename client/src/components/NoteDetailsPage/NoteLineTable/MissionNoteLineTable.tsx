import { CloseOutlined, ZoomInOutlined } from '@ant-design/icons';
import { Table, Alert } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useEffect, useState } from 'react';
import {
    ExpenseType,
    NoteLineState,
    NoteState,
    NoteViewMode,
} from '../../../enums';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';
import { IMission, INoteLine } from '../../../types';
import {
    FormMode,
    getJustificatifUrl,
    noteLineStateTag,
} from '../../../utility/common';
import ActionButtons from './ActionButtons';
import { KilometriqueCell } from './KilometriqueCell';

type Props = {
    mission: IMission;
    noteLines: INoteLine[];
    openJustificatifPreview: (src: string | null) => void;
    openModifyModal: (formMode: FormMode) => void;
    openCommentModal: (noteLinesToComment: INoteLine[]) => void;
};

const MissionNoteLineTable = ({
    mission,
    noteLines,
    openJustificatifPreview,
    openModifyModal,
    openCommentModal,
}: Props) => {
    const noteDetailsManager = useNoteDetailsManager();

    const allColumns: ColumnsType<INoteLine> = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: '100px',
            render: (date: moment.Moment) => {
                return <span>{date.format('L')}</span>;
            },
        },
        {
            title: 'Type de depense',
            dataIndex: 'expenseCategory',
            key: 'expenseCategory',
            width: '1px',
            render: (text: any, record: INoteLine) => (
                <span>{record.expenseCategory.name}</span>
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
                if (
                    record.expenseCategory.expenseType == ExpenseType.Standard
                ) {
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
                return (
                    <span>
                        {record.tva ? record.tva!.toFixed(2) + '€' : '--- '}
                    </span>
                );
            },
        },
        {
            title: 'HT',
            dataIndex: 'ht',
            key: 'ht',
            align: 'right',
            width: '100px',
            render: (text: any, record: INoteLine) => {
                return (
                    <span>
                        {record.ht ? record.ht!.toFixed(2) + '€' : '--- '}
                    </span>
                );
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
    }, [noteDetailsManager.viewMode, noteDetailsManager.currentNote]);

    return (
        <Table
            key={mission._id}
            columns={displayColumns}
            dataSource={noteLines.filter((x) => x.mission._id === mission._id)}
            size="small"
            pagination={false}
            rowClassName={(record, index) =>
                index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
            }
            expandable={{
                expandedRowRender: (noteLine) => (
                    <Alert
                        style={{
                            width: 'fit-content',
                            margin: 'auto',
                        }}
                        type={
                            noteLine.state == NoteLineState.Fixing
                                ? 'error'
                                : 'info'
                        }
                        message={noteLine.comment}
                    ></Alert>
                ),
                rowExpandable: (noteLine) =>
                    noteLine.comment != null &&
                    ![NoteLineState.Created, NoteLineState.Validated].includes(
                        noteLine.state
                    ),
                showExpandColumn: false,
                defaultExpandAllRows: true,
            }}
        />
    );
};

export default MissionNoteLineTable;
