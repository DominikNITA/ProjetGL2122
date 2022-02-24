import { green, red } from '@ant-design/colors';
import { Button } from 'antd';
import React, { ReactNode } from 'react';

type Props = {
    handleValidate: React.MouseEventHandler<HTMLElement> | undefined;
    text: ReactNode;
};

const ValidateButton = (props: Props) => {
    return (
        <Button
            key="back"
            type="ghost"
            onClick={props.handleValidate}
            style={{ borderColor: green[2], background: green[0] }}
        >
            {props.text}
        </Button>
    );
};

export default ValidateButton;
