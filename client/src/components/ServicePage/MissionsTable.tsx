import { blue } from '@ant-design/colors';
import {
    CloseOutlined,
    SearchOutlined,
    ZoomInOutlined,
} from '@ant-design/icons';
import { Space, Col, List, Button, Row, Table, Input } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useState } from 'react';
import { FraisType, MissionState, NoteLineState } from '../../enums';
import { useAuth } from '../../stateProviders/authProvider';
import { useSelectedMission } from '../../stateProviders/selectedMissionProvider';
import { IMission, INoteLine } from '../../types';
import {
    FormMode,
    getFrenchFraisType,
    getFrenchMissionState,
    getJustificatifUrl,
    missionStateTag,
    noteLineStateTag,
    getColumnSearchProps,
} from '../../utility/common';
import { getMissionStateFilter } from '../../utility/other';
import ActionButtons from './ActionButtons';
import { KilometriqueCell } from '../NoteDetailsPage/NoteLineTable/KilometriqueCell';

type Props = {
    missions: IMission[];
    openModifyModal: (formMode: FormMode) => void;
};

const MissionsTable = ({ missions, openModifyModal }: Props) => {
    // eslint-disable-next-line prefer-const
    let searchInput: Input | null = null;

    const allColumns: ColumnsType<IMission> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps(['name'], searchInput),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => <span>{text}</span>,
            ...getColumnSearchProps(['description'], searchInput),
        },
        {
            title: 'De',
            dataIndex: 'startDate',
            key: 'startDate',
            align: 'center',
            width: '1px',
            defaultSortOrder: 'descend',
            sorter: (a, b) => (a.startDate > b.startDate ? 1 : -1),
            render: (text: moment.Moment) => <span>{text.format('L')}</span>,
        },
        {
            title: 'À',
            dataIndex: 'endDate',
            key: 'endDate',
            align: 'center',
            width: '1px',
            defaultSortOrder: 'descend',
            sorter: (a, b) => (a.startDate > b.startDate ? 1 : -1),
            render: (text: moment.Moment) => <span>{text.format('L')}</span>,
        },
        {
            title: 'Etat',
            dataIndex: 'state',
            key: 'state',
            width: '1px',
            align: 'center',
            filters: getMissionStateFilter(),
            onFilter: (value, record) => {
                return value == record.state;
            },
            defaultFilteredValue: getMissionStateFilter()
                .map((x) => x.value)
                .filter((v) => v != MissionState.Cancelled),
            render: (state) => <span>{missionStateTag(state)}</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '1px',
            render: (text: any, record: IMission) => (
                <ActionButtons
                    openModifyModal={openModifyModal}
                    mission={record}
                ></ActionButtons>
            ),
        },
    ];

    return (
        <Table
            columns={allColumns}
            dataSource={missions}
            size="small"
            pagination={{ position: ['bottomRight'], pageSize: 10 }}
            rowClassName={(record, index) =>
                index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
            }
        />
    );
};

export default MissionsTable;
