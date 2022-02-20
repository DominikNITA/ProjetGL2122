import { red } from '@ant-design/colors';
import { Button } from 'antd';
import React, { ReactNode } from 'react';

type Props = {
    handleCancel: React.MouseEventHandler<HTMLElement> | undefined;
    text: ReactNode;
};

const CancelButton = (props: Props) => {
    return (
        <Button
            key="back"
            type="ghost"
            onClick={props.handleCancel}
            style={{ borderColor: red[2], background: red[0] }}
        >
            {props.text}
        </Button>
    );
};

export default CancelButton;
