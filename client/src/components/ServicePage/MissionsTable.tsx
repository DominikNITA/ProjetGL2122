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
    getFrenchFraisType,
    getFrenchMissionState,
    getJustificatifUrl,
    missionStateTag,
    noteLineStateTag,
} from '../../utility/common';
import { getMissionStateFilter } from '../../utility/other';
import ActionButtons from './ActionButtons';
import { KilometriqueCell } from '../NoteDetailsPage/NoteLineTable/KilometriqueCell';

type Props = { missions: IMission[] };

const MissionsTable = ({ missions }: Props) => {
    const selectedMission = useSelectedMission();
    const auth = useAuth();

    function isUserLeader(userId: string | undefined) {
        return userId == auth?.user?.service?.leader;
    }

    let searchInput: Input | null;
    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }: any) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={(node) => {
                        console.log('node', node);
                        searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Filtrer
                    </Button>
                    <Button
                        onClick={() =>
                            handleReset(
                                clearFilters,
                                setSelectedKeys,
                                selectedKeys,
                                confirm,
                                dataIndex
                            )
                        }
                        size="small"
                        style={{ width: 90 }}
                    >
                        Effacer
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined
                style={{ color: filtered ? '#1890ff' : undefined }}
            />
        ),
        onFilter: (value: any, record: any) =>
            record[dataIndex]
                ? record[dataIndex]
                      .toString()
                      .toLowerCase()
                      .includes(value.toLowerCase())
                : false,
        onFilterDropdownVisibleChange: (visible: boolean) => {
            if (visible) {
                console.log(searchInput);
                setTimeout(() => searchInput?.select(), 100);
            }
        },
    });

    const handleSearch = (
        selectedKeys: React.SetStateAction<string>[],
        confirm: () => void,
        dataIndex: string
    ) => {
        confirm();
    };

    const handleReset = (
        clearFilters: () => void,
        setSelectedKeys: any,
        selectedKeys: any,
        confirm: any,
        dataIndex: string
    ) => {
        clearFilters();
        setSelectedKeys([]);
        confirm();
    };

    const allColumns: ColumnsType<IMission> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => <span>{text}</span>,
            ...getColumnSearchProps('description'),
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
                <ActionButtons mission={record}></ActionButtons>
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
