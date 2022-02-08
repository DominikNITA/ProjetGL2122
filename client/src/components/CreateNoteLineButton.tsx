import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Row } from 'antd';
import { MouseEventHandler } from 'react';

interface Props {
    onClick?: MouseEventHandler;
    text?: string;
    rowStyle?: React.CSSProperties | undefined;
    buttonStyle?: React.CSSProperties | undefined;
}

const CreateNoteLineButton = (props: Props) => {
    return (
        <Row justify="center" style={props.rowStyle}>
            <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={props.onClick}
                style={props.buttonStyle}
            >
                {props.text}
            </Button>
        </Row>
    );
};

export default CreateNoteLineButton;
