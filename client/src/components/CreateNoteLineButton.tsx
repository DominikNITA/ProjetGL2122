import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Row } from 'antd';
import { MouseEventHandler } from 'react';

interface Props {
    onClick?: MouseEventHandler;
}

const CreateNoteLineButton = (props: Props) => {
    return (
        <Row justify="center">
            <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={props.onClick}
            >
                Ajouter un remboursement
            </Button>
        </Row>
    );
};

export default CreateNoteLineButton;
