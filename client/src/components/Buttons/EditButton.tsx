import { blue } from '@ant-design/colors';
import { EditOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import React from 'react';
import { FormMode } from '../../utility/common';

type Props = {
    onClick?: () => void;
};

const EditButton = (props: Props) => {
    return (
        <Popover content="Modifier" trigger="hover">
            <Button style={{ color: blue.primary }} onClick={props.onClick}>
                <EditOutlined></EditOutlined>
            </Button>
        </Popover>
    );
};

export default EditButton;
