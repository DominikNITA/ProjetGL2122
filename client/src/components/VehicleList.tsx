import { red } from '@ant-design/colors';
import {
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, message, Popconfirm, Popover, Row, Space, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getVehiclesForUser } from '../clients/vehicleClient';
import { VehicleType } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { IVehicle } from '../types';
import { FormMode, getFrenchVehicleType } from '../utility/common';
import DeleteButton from './Buttons/DeleteButton';
import EditButton from './Buttons/EditButton';
import CreateVehicleModal from './Vehicule/CreateVehicleModal';

type Props = {};

const VehicleList = (props: Props) => {
    const auth = useAuth();
    const [vehicles, setVehicles] = useState<IVehicle[]>([]);
    useEffect(() => {
        getVehiclesForUser(auth?.user?._id).then((x) => {
            if (x.isOk) {
                setVehicles(x.data!);
            } else {
                setVehicles([]);
            }
        });
    }, []);

    const columns = [
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: 'Chevaux fiscaux',
            dataIndex: 'horsePower',
            key: 'horsePower',
            width: '100px',
            render: (num: number) => <span>{num.toFixed(0)}</span>,
        },
        {
            title: 'Type',
            key: 'type',
            render: (text: any, record: IVehicle) => {
                let title = getFrenchVehicleType(record.type);
                if (record.type == VehicleType.Car && record.isElectric) {
                    title += ' electrique';
                }
                return <span>{title}</span>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '1px',
            render: (text: any, record: IVehicle) => (
                <Space size="small">
                    <EditButton
                        onClick={() =>
                            createVehicleModalRef.current?.showModal(
                                FormMode.Modification,
                                record
                            )
                        }
                    ></EditButton>
                    <DeleteButton
                        onConfirm={() =>
                            message.error('TODO: Supprimer le vehicule')
                        }
                    ></DeleteButton>
                </Space>
            ),
        },
    ];

    const createVehicleModalRef = useRef<any>();

    return (
        <>
            <CreateVehicleModal
                ref={createVehicleModalRef}
            ></CreateVehicleModal>
            <Space direction="vertical">
                <Table
                    columns={columns}
                    dataSource={vehicles}
                    size="small"
                    pagination={false}
                    style={{ maxWidth: '700px' }}
                />
                <Row justify="center">
                    <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        onClick={() =>
                            createVehicleModalRef.current?.showModal(
                                FormMode.Creation
                            )
                        }
                    >
                        Ajouter un vehicule
                    </Button>
                </Row>
            </Space>
        </>
    );
};

export default VehicleList;
