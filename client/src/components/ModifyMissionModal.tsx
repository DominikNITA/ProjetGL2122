import { Modal, Button, Form, Input, DatePicker } from 'antd';
import moment from 'moment';
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { createMission, updateMission } from '../clients/serviceClient';
import { useAuth } from '../stateProviders/authProvider';
import { useSelectedMission } from '../stateProviders/selectedMissionProvider';

enum FormMode {
    Creation,
    Modification,
}

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
        confirmButton: 'Creer',
    };

    const modifyTexts = {
        title: 'Modifier la mission',
        confirmButton: 'Modifier',
    };

    useImperativeHandle(ref, () => ({
        showModal() {
            setVisible(true);
        },
    }));

    useEffect(() => {
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
    }, [selectedMission?.mission]);

    const getFormMode = () => {
        return selectedMission?.mission == null
            ? FormMode.Creation
            : FormMode.Modification;
    };

    const handleMissionChange = async (values: any) => {
        if (getFormMode() == FormMode.Creation) {
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
                <Form form={form} layout="inline" name="createMissionModalForm">
                    <Form.Item
                        name="name"
                        label="Nom de la mission"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the mission name !',
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
                                required: false,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="startDate"
                        label="Date de début de la mission"
                        rules={[
                            {
                                required: true,
                                message:
                                    'Please input the mission start date !',
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
                                message: 'Please input the mission end date !',
                            },
                        ]}
                    >
                        <DatePicker />
                    </Form.Item>
                </Form>
                {errorMessage && errorMessage !== '' && <p>{errorMessage}</p>}
            </>
        </Modal>
    );
});

export default ModifyMissionModal;
