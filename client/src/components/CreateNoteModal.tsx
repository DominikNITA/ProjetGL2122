import {
    Modal,
    Button,
    Form,
    Input,
    Radio,
    InputNumber,
    Select,
    Alert,
    Space,
} from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../clients/noteClient';
import { Month } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { INote } from '../types';
import { getFrenchMonth } from '../utility/common';
import { ApiResponse } from '../types';

const CreateNoteModal = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    const auth = useAuth();
    const navigate = useNavigate();

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
            .then(async (values) => {
                setConfirmLoading(true);
                createNote({
                    owner: auth?.user!._id,
                    year: values.year,
                    month: Number(values.month),
                }).then((response) => {
                    if (response?.isOk) {
                        setVisible(false);
                        setErrorMessage('');
                        navigate(`/notes/${response!.data!._id}`);
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

    const [form] = Form.useForm();
    const monthEntries = [];
    for (const value in Month) {
        if (!isNaN(Number(value))) {
            monthEntries.push({
                value: value,
                label: getFrenchMonth(Number(value)),
            });
        }
    }

    return (
        <Modal
            title="Ajouter une nouvelle note"
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Annuler
                </Button>,
                <Button key="link" type="primary" onClick={handleOk}>
                    Creer
                </Button>,
            ]}
        >
            <Space
                direction="vertical"
                style={{ width: '100%', justifyContent: 'center' }}
            >
                <Form
                    form={form}
                    layout="inline"
                    name="createNoteModalForm"
                    initialValues={{ year: 2022, month: '1' }}
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    <Form.Item
                        name="year"
                        label="Annee"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the year of note!',
                            },
                        ]}
                    >
                        <InputNumber min={2021} max={2023} />
                    </Form.Item>
                    <Form.Item
                        name="month"
                        label="Mois"
                        style={{ width: 150 }}
                        rules={[
                            {
                                required: true,
                                message: 'Please input the month of note!',
                            },
                        ]}
                    >
                        <Select options={monthEntries} />
                    </Form.Item>
                </Form>
                {errorMessage && errorMessage !== '' && (
                    <Alert message={errorMessage} type="error"></Alert>
                )}
            </Space>
        </Modal>
    );
});

export default CreateNoteModal;
