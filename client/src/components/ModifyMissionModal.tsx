import { Modal, Button, Form, Input, DatePicker, Row, Space } from 'antd';
import moment from 'moment';
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { createMission, updateMission } from '../clients/serviceClient';
import { useAuth } from '../stateProviders/authProvider';
import { useSelectedMission } from '../stateProviders/selectedMissionProvider';
import { FormMode } from '../utility/common';

const ModifyMissionModal = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);

    const auth = useAuth();
    const selectedMission = useSelectedMission();

    const [titleText, setTitleText] = useState('');
    const [confirmButtonText, setConfirmButtonText] = useState('');

    const createTexts = {
        title: 'Ajouter une nouvelle mission',
        confirmButton: 'Créer',
    };

    const modifyTexts = {
        title: 'Modifier la mission',
        confirmButton: 'Modifier',
    };

    const [formMode, setFormMode] = useState<FormMode>(FormMode.Unknown);
    useImperativeHandle(ref, () => ({
        showModal(formMode: FormMode) {
            setFormMode(formMode);
            setVisible(true);
        },
    }));

    useEffect(() => {
        form.resetFields();
        if (selectedMission?.mission != null) {
            const correctMission = selectedMission!.mission;
            form.setFieldsValue(correctMission);
            setTitleText(modifyTexts.title);
            setConfirmButtonText(modifyTexts.confirmButton);
        } else {
            form.resetFields();
            setTitleText(createTexts.title);
            setConfirmButtonText(createTexts.confirmButton);
        }
        switch (formMode) {
            case FormMode.Modification:
                setTitleText(modifyTexts.title);
                setConfirmButtonText(modifyTexts.confirmButton);
                break;
            case FormMode.Creation:
                setTitleText(createTexts.title);
                setConfirmButtonText(createTexts.confirmButton);
                break;
            default:
                break;
        }
    }, [formMode]);

    const handleMissionChange = async (values: any) => {
        if (formMode == FormMode.Creation) {
            return createMission(
                {
                    ...values,
                },
                auth?.user?.service?._id
            );
        } else {
            return updateMission(
                {
                    ...values,
                    service: auth?.user?.service?._id,
                },
                selectedMission.mission!._id
            );
        }
    };

    const handleOk = async () => {
        setErrorMessage('');
        function handleError(message: string) {
            setErrorMessage(message);
        }
        form.validateFields()
            .then(async (values) => {
                setConfirmLoading(true);
                handleMissionChange(values).then((response) => {
                    if (response?.isOk) {
                        selectedMission.reload();
                        setFormMode(FormMode.Unknown);
                        setVisible(false);
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
        setFormMode(FormMode.Unknown);
    };

    const [form] = Form.useForm();
    return (
        <Modal
            title={titleText}
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            getContainer={false}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Annuler
                </Button>,
                <Button key="link" type="primary" onClick={handleOk}>
                    {confirmButtonText}
                </Button>,
            ]}
        >
            <>
                <Form
                    form={form}
                    layout="vertical"
                    name="createMissionModalForm"
                >
                    <Form.Item
                        name="name"
                        label="Nom de la mission"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description de la mission"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input.TextArea rows={2} allowClear={true} />
                    </Form.Item>
                    <Space direction="horizontal" size="large">
                        <Form.Item
                            name="startDate"
                            label="Date de début de la mission"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            name="endDate"
                            label="Date de fin de la mission"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <DatePicker />
                        </Form.Item>
                    </Space>
                </Form>
                {errorMessage && errorMessage !== '' && <p>{errorMessage}</p>}
            </>
        </Modal>
    );
});

export default ModifyMissionModal;
