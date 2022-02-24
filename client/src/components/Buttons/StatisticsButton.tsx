import { purple } from '@ant-design/colors';
import { BarChartOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import React from 'react';

type Props = { onClick: () => void };

const StatisticsButton = (props: Props) => {
    return (
        <Popover content="Statistiques" trigger="hover">
            <Button style={{ color: purple.primary }} onClick={props.onClick}>
                <BarChartOutlined></BarChartOutlined>
            </Button>
        </Popover>
    );
};

export default StatisticsButton;
