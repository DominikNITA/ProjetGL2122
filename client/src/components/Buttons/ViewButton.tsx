import { purple } from '@ant-design/colors';
import { FileDoneOutlined, SearchOutlined } from '@ant-design/icons';
import { Popover, Button } from 'antd';
import React from 'react';

type Props = { onClick?: () => void };

const ViewButton = (props: Props) => {
    return (
        <Popover content="Visualiser" trigger="hover">
            <Button style={{ color: purple.primary }} onClick={props.onClick}>
                <SearchOutlined></SearchOutlined>
            </Button>
        </Popover>
    );
};

export default ViewButton;
