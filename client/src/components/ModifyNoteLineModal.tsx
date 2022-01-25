import {
    Modal,
    Button,
    Form,
    Input,
    Radio,
    InputNumber,
    Select,
    DatePicker,
    Row,
    Space,
    Alert,
} from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createNote,
    createNoteLine,
    updateNoteLine,
} from '../clients/noteClient';
import { Month, NoteLineState } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { INote } from '../types';
import { getFrenchMonth } from '../utility/common';
import { ApiResponse } from '../types';
import { useSelectedNoteLine } from '../stateProviders/selectedNoteLineProvider';
import { getMissionsByService } from '../clients/serviceClient';
import moment from 'moment';
import PricesInput from './PricesInput';

enum FormMode {
    Creation,
    Modification,
}

const ModifyNoteLineModal = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [missionEntries, setMissionEntries] = useState<
        {
            value: string;
            label: string;
        }[]
    >([]);

    const auth = useAuth();
    const navigate = useNavigate();
    const selectedNoteLine = useSelectedNoteLine();

    const [titleText, setTitleText] = useState('');
    const [confirmButtonText, setConfirmButtonText] = useState('');
    const createTexts = {
        title: 'Ajouter un nouveau remboursement',
        confirmButton: 'Creer',
    };

    const modifyTexts = {
        title: 'Modifier le remboursement',
        confirmButton: 'Modifier',
    };

    useImperativeHandle(ref, () => ({
        showModal() {
            setVisible(true);
        },
    }));

    useEffect(() => {
        if (selectedNoteLine?.noteLine != null) {
            const correctNoteLine = selectedNoteLine!.noteLine;
            correctNoteLine.date = moment(correctNoteLine.date);
            form.setFieldsValue(correctNoteLine);
            setTitleText(modifyTexts.title);
            setConfirmButtonText(modifyTexts.confirmButton);
        } else {
            form.resetFields();
            setTitleText(createTexts.title);
            setConfirmButtonText(createTexts.confirmButton);
        }
        setErrorMessage('');
    }, [selectedNoteLine?.noteLine]);

    const getFormMode = () => {
        return selectedNoteLine?.noteLine == null
            ? FormMode.Creation
            : FormMode.Modification;
    };

    const handleNoteLineChange = async (values: any) => {
        if (getFormMode() == FormMode.Creation) {
            return createNoteLine(
                {
                    ...values,
                    note: selectedNoteLine.currentNote!._id,
                    state: NoteLineState.Created,
                },
                selectedNoteLine.currentNote!
            );
        } else {
            return updateNoteLine({
                ...values,
                _id: selectedNoteLine.noteLine?._id,
            });
        }
    };

    const handleOk = async () => {
        setErrorMessage('');
        function handleError(message: string) {
            // form.resetFields();
            setErrorMessage(message);
        }
        form.validateFields()
            .then(async (values) => {
                setConfirmLoading(true);
                handleNoteLineChange(values).then((response) => {
                    if (response?.isOk) {
                        selectedNoteLine.reload();
                        form.resetFields();
                        setErrorMessage('');
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
        form.resetFields();
        setErrorMessage('');
        setVisible(false);
    };

    useEffect(() => {
        getMissionsByService(auth?.user?.service._id).then((resp) => {
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

    // const validatePrices = (ttc: number, hta : number, ht:number){
    //     if()
    // }

    const [form] = Form.useForm();
    return (
        <Modal
            title={titleText}
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
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
                    name="createNoteModalForm"
                    initialValues={{ year: 2022, month: '1' }}
                >
                    <Row>
                        <Space>
                            <Form.Item
                                name="date"
                                label="Date"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <DatePicker />
                            </Form.Item>
                            <Form.Item
                                name={['mission', '_id']}
                                label="Mission"
                                style={{ width: 250 }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'TODO: mission',
                                    },
                                ]}
                            >
                                <Select options={missionEntries} />
                            </Form.Item>
                        </Space>
                    </Row>
                    <PricesInput></PricesInput>
                    <Form.Item
                        name="description"
                        label="Description"
                        style={{ width: 300 }}
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
                        name="justificatif"
                        label="Justificatif"
                        style={{ width: 150 }}
                        rules={[
                            {
                                required: true,
                                message: 'TODO: desc',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
                {errorMessage && errorMessage !== '' && (
                    <Alert message={errorMessage} type="error"></Alert>
                )}
            </>
        </Modal>
    );
});

export default ModifyNoteLineModal;
