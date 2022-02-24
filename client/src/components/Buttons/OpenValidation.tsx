import { purple } from '@ant-design/colors';
import { BarChartOutlined, FileDoneOutlined } from '@ant-design/icons';
import { Popover, Button } from 'antd';
import React from 'react';

type Props = { onClick?: () => void };

const OpenValidation = (props: Props) => {
    return (
        <Popover content="Valider" trigger="hover">
            <Button style={{ color: purple.primary }} onClick={props.onClick}>
                <FileDoneOutlined></FileDoneOutlined>
            </Button>
        </Popover>
    );
};

export default OpenValidation;
