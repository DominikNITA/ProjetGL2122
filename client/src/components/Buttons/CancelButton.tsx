import { red } from '@ant-design/colors';
import { Button } from 'antd';
import React, { ReactNode } from 'react';

type Props = {
    onCancel: React.MouseEventHandler<HTMLElement> | undefined;
    text?: ReactNode;
};

const CancelButton = (props: Props) => {
    return (
        <Button
            key="back"
            type="ghost"
            onClick={props.onCancel}
            style={{ borderColor: red[2], background: red[0] }}
        >
            {props.text ?? 'Annuler'}
        </Button>
    );
};

export default CancelButton;
