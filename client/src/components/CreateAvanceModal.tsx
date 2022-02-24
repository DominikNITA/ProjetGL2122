import {
    Modal,
    Button,
    Form,
    InputNumber,
    Select,
    Alert,
    Space,
    Input,
} from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../stateProviders/authProvider';
import { createAvance } from '../clients/avanceClient';
import { getMissionsByService } from '../clients/serviceClient';
import { MissionState } from '../enums';

const CreateNoteModal = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);
    const auth = useAuth();

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
                createAvance({
                    owner: auth?.user!._id,
                    description: values.description,
                    amount: values.montant,
                    mission: values.mission,
                }).then((response) => {
                    if (response?.isOk) {
                        setVisible(false);
                        setErrorMessage('');
                        window.location.reload();
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

    const [missionEntries, setMissionEntries] = useState<
        {
            value: string;
            label: string;
        }[]
    >([]);

    useEffect(() => {
        if (auth?.user?._id == null) return;
        getMissionsByService(auth?.user?.service._id, [
            MissionState.InProgress,
            MissionState.NotStarted,
        ]).then((resp) => {
            if (resp.isOk) {
                setMissionEntries(
                    resp.data!.map((mission) => {
                        return {
                            value: mission._id,
                            label: mission.name,
                        };
                    })
                );
            }
        });
    }, [auth]);

    return (
        <Modal
            title="Ajouter une nouvelle avance"
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
                    layout="vertical"
                    name="createAvanceModalForm"
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    <Form.Item
                        name="description"
                        label="Description"
                        style={{ width: 300 }}
                        rules={[
                            {
                                required: true,
                                message: 'La description ne peut pas être vide',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="montant"
                        label="Montant"
                        rules={[
                            {
                                required: true,
                                message: 'Le montant est nécessaire',
                            },
                        ]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item
                        name="mission"
                        label="Mission correspondante"
                        rules={[
                            {
                                required: true,
                                message: 'La mission est nécessaire',
                            },
                        ]}
                    >
                        <Select options={missionEntries} />
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
