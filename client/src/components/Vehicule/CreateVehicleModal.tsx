import { red } from '@ant-design/colors';
import { Modal, Button, Form, Input, Alert, message, InputNumber } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVehicle } from '../../clients/vehicleClient';
import { VehicleType } from '../../enums';
import { useAuth } from '../../stateProviders/authProvider';
import { IVehicle } from '../../types';
import { FormMode } from '../../utility/common';
import VehicleTypeInput from './VehicleTypeInput';

const CreateVehicleModal = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const auth = useAuth();

    const [titleText, setTitleText] = useState('');
    const [confirmButtonText, setConfirmButtonText] = useState('');
    const createTexts = {
        title: 'Ajouter un nouveau vehicule',
        confirmButton: 'Creer',
    };

    const modifyTexts = {
        title: 'Modifier le vehicule',
        confirmButton: 'Modifier',
    };

    const [formMode, setFormMode] = useState<FormMode>(FormMode.Unknown);

    useImperativeHandle(ref, () => ({
        showModal(formMode: FormMode, vehicule?: IVehicle) {
            form.resetFields();
            setFormMode(formMode);
            if (formMode == FormMode.Modification) {
                form.setFieldsValue(vehicule);
            } else {
                form.setFieldsValue({ type: VehicleType.Car });
            }
            setVisible(true);
        },
    }));

    useEffect(() => {
        if (formMode == FormMode.Modification) {
            setTitleText(modifyTexts.title);
            setConfirmButtonText(modifyTexts.confirmButton);
        } else {
            setTitleText(createTexts.title);
            setConfirmButtonText(createTexts.confirmButton);
        }
        setErrorMessage('');
    }, [formMode]);

    const handleVehicleSubmit = async (values: any) => {
        if (formMode == FormMode.Creation) {
            return createVehicle({
                ...values,
                owner: auth?.user?._id,
            });
        } else {
            message.error('TODO: Modifier le vehicule');
        }
    };

    const handleOk = async () => {
        setErrorMessage('');

        function handleError(message: string) {
            setErrorMessage(message);
        }

        form.validateFields()
            .then(async (values) => {
                handleVehicleSubmit(values).then((response) => {
                    if (response?.isOk) {
                        message.success(
                            formMode == FormMode.Creation
                                ? `Creation du vehicule - ${values.description}`
                                : `Modification du vehicule - ${values.description}`
                        );
                        message.error('TODO: Reload vehicules');
                        setErrorMessage('');
                        form.resetFields();
                        handleCancel();
                    } else {
                        handleError(response!.message!);
                    }
                });
            })
            .catch((info) => {
                // handleError(info);
            });
    };

    const handleCancel = () => {
        form.resetFields();
        setErrorMessage('');
        setVisible(false);
        setFormMode(FormMode.Unknown);
    };

    const [form] = Form.useForm();

    return (
        <Modal
            title={titleText}
            visible={visible}
            onCancel={handleCancel}
            footer={[
                <Button
                    key="back"
                    type="ghost"
                    onClick={handleCancel}
                    style={{ borderColor: red[2], background: red[0] }}
                >
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
                    name="createVehiculeModalForm"
                >
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            {
                                required: true,
                                message: 'TODO: desc',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="horsePower"
                        label="Chevaux fiscaux"
                        help={
                            'Le nombre de chevaux fiscaux est indiqué sur le certificat d’immatriculation dans la partie P.6.'
                        }
                        rules={[
                            {
                                required: true,
                                message: 'TODO: desc',
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <VehicleTypeInput></VehicleTypeInput>
                </Form>
                {errorMessage && errorMessage !== '' && (
                    <Alert message={errorMessage} type="error"></Alert>
                )}
            </>
        </Modal>
    );
});

export default CreateVehicleModal;
