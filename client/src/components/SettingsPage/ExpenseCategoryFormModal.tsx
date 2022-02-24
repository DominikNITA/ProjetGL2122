import { red } from '@ant-design/colors';
import {
    Modal,
    Button,
    Input,
    InputNumber,
    Alert,
    message,
    Select,
} from 'antd';
import Form from 'antd/lib/form';
import form from 'antd/lib/form';
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import {
    createExpenseCategory,
    modifyExpenseCategory,
} from '../../clients/expenseCategoryClient';
import { createVehicle } from '../../clients/vehicleClient';
import { ExpenseType, VehicleType } from '../../enums';
import { useAuth } from '../../stateProviders/authProvider';
import { IExpenseCategory, IVehicle } from '../../types';
import { FormMode, getFrenchExpenseType } from '../../utility/common';
import CancelButton from '../Buttons/CancelButton';
import VehicleTypeInput from '../Vehicule/VehicleTypeInput';

type Props = {};

const ExpenseCategoryFormModal = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [titleText, setTitleText] = useState('');
    const [confirmButtonText, setConfirmButtonText] = useState('');
    const createTexts = {
        title: 'Ajouter un nouveau type de frais',
        confirmButton: 'Creer',
    };

    const modifyTexts = {
        title: 'Modifier le type de frais',
        confirmButton: 'Modifier',
    };

    const [formMode, setFormMode] = useState<FormMode>(FormMode.Unknown);
    const [currentExpenseCategory, setCurrentExpenseCategory] =
        useState<IExpenseCategory>();

    useImperativeHandle(ref, () => ({
        showModal(formMode: FormMode, expenseCategory?: IExpenseCategory) {
            form.resetFields();
            setFormMode(formMode);
            if (formMode == FormMode.Modification) {
                setCurrentExpenseCategory(expenseCategory);
                form.setFieldsValue(expenseCategory);
            } else {
                form.setFieldsValue({ ExpenseType: ExpenseType.Standard });
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
            return createExpenseCategory({
                ...values,
            });
        } else {
            return modifyExpenseCategory(
                { ...values },
                currentExpenseCategory!._id
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
                handleVehicleSubmit(values).then((response) => {
                    if (response?.isOk) {
                        message.success(
                            formMode == FormMode.Creation
                                ? `Creation du type de frais - ${values.name}`
                                : `Modification du type de frais - ${values.name}`
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
        window.location.reload();
    };

    const fraisTypesEntries = [];
    for (const value in ExpenseType) {
        if (!isNaN(Number(value))) {
            fraisTypesEntries.push({
                value: Number(value),
                label: getFrenchExpenseType(Number(value)),
            });
        }
    }

    const [form] = Form.useForm();
    return (
        <Modal
            title={titleText}
            visible={visible}
            onCancel={handleCancel}
            footer={[
                <CancelButton
                    text="Annuler"
                    onCancel={handleCancel}
                ></CancelButton>,

                <Button key="link" type="primary" onClick={handleOk}>
                    {confirmButtonText}
                </Button>,
            ]}
        >
            <>
                <Form
                    form={form}
                    layout="vertical"
                    name="expenseCategoryFormModal"
                >
                    <Form.Item
                        name="name"
                        label="Nom"
                        rules={[
                            {
                                required: true,
                                message: 'TODO: nom',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="expenseType"
                        label="Le type general"
                        rules={[
                            {
                                required: true,
                                message: 'TODO: type general',
                            },
                        ]}
                    >
                        <Select options={fraisTypesEntries} />
                    </Form.Item>
                </Form>
                {errorMessage && errorMessage !== '' && (
                    <Alert message={errorMessage} type="error"></Alert>
                )}
            </>
        </Modal>
    );
});

export default ExpenseCategoryFormModal;
