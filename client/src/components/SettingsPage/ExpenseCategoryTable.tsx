import { blue, red } from '@ant-design/colors';
import {
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    ZoomInOutlined,
} from '@ant-design/icons';
import { Button, Input, Popconfirm, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useRef, useState } from 'react';
import {
    deleteExpenseCategory,
    getAllExpenseCategories,
} from '../../clients/expenseCategoryClient';
import { deleteMission } from '../../clients/missionClient';
import {
    ExpenseType,
    NoteViewMode,
    NoteState,
    MissionState,
} from '../../enums';
import { IExpenseCategory, IMission, INoteLine } from '../../types';
import {
    FormMode,
    getColumnSearchProps,
    getFrenchExpenseType,
    getJustificatifUrl,
    missionStateTag,
    noteLineStateTag,
} from '../../utility/common';
import { getMissionStateFilter } from '../../utility/other';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import { KilometriqueCell } from '../NoteDetailsPage/NoteLineTable/KilometriqueCell';
import ActionButtons from '../ServicePage/ActionButtons';
import ExpenseCategoryFormModal from './ExpenseCategoryFormModal';

type Props = {};

const ExpenseCategoryTable = (props: Props) => {
    // eslint-disable-next-line prefer-const
    let searchInput: Input | null = null;

    const [expenseCategories, setExpenseCategories] = useState<
        IExpenseCategory[]
    >([]);

    useEffect(() => {
        getAllExpenseCategories().then((resp) => {
            if (resp.isOk) {
                setExpenseCategories(resp.data!);
            }
        });
    }, []);

    const allColumns: ColumnsType<IExpenseCategory> = [
        {
            title: 'Nom',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps(['name'], searchInput),
        },
        {
            title: 'Type',
            dataIndex: 'expenseType',
            key: 'expenseType',
            render: (text: string, record: IExpenseCategory) => (
                <span>{getFrenchExpenseType(record.expenseType)}</span>
            ),
        },
        // {
        //     title: 'Etat',
        //     dataIndex: 'state',
        //     key: 'state',
        //     width: '1px',
        //     align: 'center',
        //     filters: getMissionStateFilter(),
        //     onFilter: (value, record) => {
        //         return value == record.state;
        //     },
        //     defaultFilteredValue: getMissionStateFilter()
        //         .map((x) => x.value)
        //         .filter((v) => v != MissionState.Cancelled),
        //     render: (state) => <span>{missionStateTag(state)}</span>,
        // },
        {
            title: 'Actions',
            key: 'actions',
            width: '1px',
            render: (text: any, record: IExpenseCategory) => (
                <Space size="small">
                    <EditButton
                        onClick={() => {
                            expenseCategoryFormModalRef.current.showModal(
                                FormMode.Modification,
                                record
                            );
                        }}
                    ></EditButton>

                    <DeleteButton
                        popConfirmTitle="Supprimer ce type de frais?"
                        onConfirm={() => {
                            deleteExpenseCategory(record._id).then(() =>
                                window.location.reload()
                            );
                        }}
                    ></DeleteButton>
                </Space>
            ),
        },
    ];

    const expenseCategoryFormModalRef = useRef<any>();
    return (
        <>
            <ExpenseCategoryFormModal
                ref={expenseCategoryFormModalRef}
            ></ExpenseCategoryFormModal>
            <Table
                columns={allColumns}
                dataSource={expenseCategories}
                size="small"
                pagination={false}
                rowClassName={(record, index) =>
                    index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                }
            />
        </>
    );
};

export default ExpenseCategoryTable;
