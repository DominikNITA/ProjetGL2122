import { Modal, Button, Form, Alert, Space, Checkbox } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useAuth } from '../stateProviders/authProvider';
import { useParams } from 'react-router-dom';
import {
    updateCorrolatedNoteLines,
    getCorrelateNoteLines,
} from '../clients/avanceClient';
import { INoteLine } from '../types';
import CancelButton from './Buttons/CancelButton';

const CorrelateNoteLineModal = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);
    let NewNoteLinesList: INoteLine[];

    const auth = useAuth();
    const param = useParams();

    useImperativeHandle(ref, () => ({
        showModal() {
            setVisible(true);
        },
    }));

    const handleOk = async () => {
        setErrorMessage('');
        function handleError(message: string) {
            form.resetFields();
            setErrorMessage(message);
        }
        form.validateFields()
            .then(async () => {
                setConfirmLoading(true);
                updateCorrolatedNoteLines(
                    param.avanceId!,
                    NewNoteLinesList
                ).then((response) => {
                    if (response?.isOk) {
                        setVisible(false);
                        setErrorMessage('');
                        window.location.reload(); // Maybe find a better way to refresh data ?
                    } else {
                        handleError(response!.message!);
                    }
                });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setVisible(false);
        setErrorMessage('');
    };

    const handleChange = (checkedValues: any[]) => {
        NewNoteLinesList = checkedValues;
    };

    const [form] = Form.useForm();
    const [noteLinesEntries, setNoteLinesEntries] = useState<
        {
            value: string;
            label: string;
        }[]
    >([]);

    useEffect(() => {
        if (auth?.user?._id == null) return;
        getCorrelateNoteLines(param.avanceId!).then((resp) => {
            if (resp.isOk) {
                setNoteLinesEntries(
                    resp.data!.map((noteLine) => {
                        return {
                            value: noteLine._id,
                            label: noteLine.description,
                        };
                    })
                );
            }
        });
    }, [auth]);

    return (
        <Modal
            title="Modifier les lignes de notes de frais correspondantes"
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            footer={[
                <CancelButton
                    key="back"
                    onCancel={handleCancel}
                ></CancelButton>,
                <Button key="link" type="primary" onClick={handleOk}>
                    Modifier
                </Button>,
            ]}
        >
            <Space
                direction="vertical"
                style={{ width: '100%', justifyContent: 'center' }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="CorrolateNoteLinesForm"
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    <Checkbox.Group
                        options={noteLinesEntries}
                        onChange={handleChange}
                    />
                </Form>
                {errorMessage && errorMessage !== '' && (
                    <Alert message={errorMessage} type="error"></Alert>
                )}
            </Space>
        </Modal>
    );
});

export default CorrelateNoteLineModal;
