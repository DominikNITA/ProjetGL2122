import { blue } from '@ant-design/colors';
import { CloseOutlined, ZoomInOutlined } from '@ant-design/icons';
import { Space, Col, List, Button, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { FraisType, MissionState, NoteLineState } from '../../enums';
import { useAuth } from '../../stateProviders/authProvider';
import { useSelectedMission } from '../../stateProviders/selectedMissionProvider';
import { IMission, INoteLine } from '../../types';
import {
    getFrenchFraisType,
    getFrenchMissionState,
    getJustificatifUrl,
    missionStateTag,
    noteLineStateTag,
} from '../../utility/common';
import { getMissionStateFilter } from '../../utility/other';
import ActionButtons from '../NoteDetailsPage/NoteDetailsHeader/ActionButtons';
import { KilometriqueCell } from '../NoteDetailsPage/NoteLineTable/KilometriqueCell';

type Props = { missions: IMission[] };

const MissionsTable = ({ missions }: Props) => {
    const selectedMission = useSelectedMission();
    const auth = useAuth();

    function isUserLeader(userId: string | undefined) {
        return userId == auth?.user?.service?.leader;
    }

    const allColumns: ColumnsType<IMission> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            filtered: true,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: 'Dates',
            key: 'dates',
            width: '200px',
            render: (text: any, record: IMission) => (
                <span>
                    {record.startDate.format('L')} -{' '}
                    {record.endDate.format('L')}
                </span>
            ),
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
            render: (text: any, record: IMission) => <Button>TODO</Button>,
        },
    ];

    return (
        <Space direction="vertical" size={25} style={{ width: '100%' }}>
            <Table
                columns={allColumns}
                dataSource={missions}
                size="small"
                pagination={false}
                rowClassName={(record, index) =>
                    index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                }
            />

            <Row justify="center"></Row>
        </Space>
    );
};

export default MissionsTable;
