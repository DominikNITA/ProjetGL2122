import { red } from '@ant-design/colors';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Popover } from 'antd';
import React from 'react';
import { deleteMission } from '../../clients/missionClient';

type Props = {
    popConfirmTitle?: string;
    onConfirm: () => void;
};

const DeleteButton = (props: Props) => {
    return (
        <Popover content="Supprimer" trigger="hover">
            <Popconfirm
                title={props.popConfirmTitle ?? 'Supprimer?'}
                onConfirm={props.onConfirm}
                okText="Oui"
                cancelText="Non"
            >
                <Button style={{ color: red.primary }}>
                    <DeleteOutlined></DeleteOutlined>
                </Button>
            </Popconfirm>
        </Popover>
    );
};

export default DeleteButton;
