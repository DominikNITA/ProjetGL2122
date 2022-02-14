import { Alert, Button, Form, Input, Modal } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { changeNoteLineState } from '../clients/noteClient';
import { NoteLineState } from '../enums';
import { useNoteDetailsManager } from '../stateProviders/noteDetailsManagerProvider';
import { INoteLine } from '../types';
import CancelButton from './CancelButton';

type Props = {};

const NoteLineCommentModal = forwardRef((props: Props, ref) => {
    const [visible, setVisible] = useState(false);
    const [noteLinesToComment, setNoteLinesToComment] = useState<INoteLine[]>(
        []
    );
    const [errorMessage, setErrorMessage] = useState('');

    const noteDetailsManager = useNoteDetailsManager();

    useImperativeHandle(ref, () => ({
        showModal(noteLinesToComment: INoteLine[]) {
            setVisible(true);
            setNoteLinesToComment(noteLinesToComment);
        },
    }));

    const handleOk = async () => {
        setErrorMessage('');
        form.validateFields()
            .then(async (values) => {
                noteLinesToComment.forEach((nl) =>
                    changeNoteLineState(
                        nl._id,
                        NoteLineState.Fixing,
                        values.comment
                    )
                );
                setVisible(false);
                noteDetailsManager.reload();
            })
            .catch((info) => {
                console.log(info);
            });
    };

    const handleCancel = () => {
        form.resetFields();
        noteDetailsManager.updateNoteLine(null);
        setErrorMessage('');
        setVisible(false);
    };

    const [form] = Form.useForm();
    return (
        <Modal
            title="Ajouter un commentaire"
            visible={visible}
            onCancel={handleCancel}
            footer={[
                <CancelButton
                    handleCancel={handleCancel}
                    text="Annuler"
                ></CancelButton>,
                <Button key="link" type="primary" onClick={handleOk}>
                    Commenter
                </Button>,
            ]}
        >
            <>
                <Form
                    form={form}
                    layout="vertical"
                    name="noteLineCommentModalForm"
                >
                    <Form.Item
                        name="comment"
                        label="Commentaire"
                        rules={[
                            {
                                required: true,
                                message:
                                    'Un commentaire est obligatoire pour la rejection',
                            },
                        ]}
                    >
                        <Input.TextArea rows={2} allowClear={true} />
                    </Form.Item>
                </Form>
                {errorMessage && errorMessage !== '' && (
                    <Alert message={errorMessage} type="error"></Alert>
                )}
            </>
        </Modal>
    );
});

export default NoteLineCommentModal;
