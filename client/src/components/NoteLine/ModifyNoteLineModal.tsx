import {
    Modal,
    Button,
    Form,
    Input,
    Select,
    DatePicker,
    Row,
    Space,
    Alert,
} from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNoteLine, updateNoteLine } from '../../clients/noteClient';
import { FraisType, NoteLineState } from '../../enums';
import { useAuth } from '../../stateProviders/authProvider';
import { IMission, INoteLine } from '../../types';
import { useSelectedNoteLine } from '../../stateProviders/selectedNoteLineProvider';
import { getMissionsByService } from '../../clients/serviceClient';
import moment from 'moment';
import { FormMode } from '../../utility/common';
import FraisTypeInput from './FraisTypeInput';
import { red } from '@ant-design/colors';

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
    const [missions, setMissions] = useState<IMission[]>([]);

    const auth = useAuth();
    const navigate = useNavigate();
    const selectedNoteLine = useSelectedNoteLine();

    const [titleText, setTitleText] = useState('');
    const [confirmButtonText, setConfirmButtonText] = useState('');
    const createTexts = {
        title: 'Ajouter un nouveau remboursement',
        confirmButton: 'Creer',
        confirmWithoutLeaveButton: 'Creer sans quitter',
    };

    const modifyTexts = {
        title: 'Modifier le remboursement',
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
        if (selectedNoteLine.noteLine != null) {
            const correctNoteLine = selectedNoteLine!.noteLine;
            correctNoteLine!.date = moment(correctNoteLine!.date);
            form.setFieldsValue(correctNoteLine);
        } else {
            form.setFieldsValue({ fraisType: FraisType.Standard });
        }
        if (formMode == FormMode.Modification) {
            setTitleText(modifyTexts.title);
            setConfirmButtonText(modifyTexts.confirmButton);
        } else {
            setTitleText(createTexts.title);
            setConfirmButtonText(createTexts.confirmButton);
        }
        setErrorMessage('');
    }, [formMode]);

    const handleNoteLineSubmit = async (values: any) => {
        if (formMode == FormMode.Creation) {
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

    const handleOk = async (doQuitAfterHandling: boolean) => {
        setErrorMessage('');

        function handleError(message: string) {
            setErrorMessage(message);
        }

        form.validateFields()
            .then(async (values) => {
                setConfirmLoading(true);
                handleNoteLineSubmit(values).then((response) => {
                    if (response?.isOk) {
                        selectedNoteLine.reload();
                        setErrorMessage('');
                        form.resetFields();
                        if (doQuitAfterHandling) {
                            setVisible(false);
                        } else {
                            const premadeNoteLine: Partial<INoteLine> = {
                                mission: response.data?.mission,
                                date: moment(response.data?.date),
                                fraisType: FraisType.Standard,
                            };
                            form.setFieldsValue(premadeNoteLine);
                        }
                    } else {
                        handleError(response!.message!);
                    }
                });
            })
            .catch((info) => {
                handleError(info);
            });
    };

    const handleCancel = () => {
        form.resetFields();
        selectedNoteLine.updateNoteLine(null);
        setErrorMessage('');
        setVisible(false);
        setFormMode(FormMode.Unknown);
    };

    useEffect(() => {
        getMissionsByService(auth?.user?.service._id).then((resp) => {
            if (resp.isOk) {
                setMissions(resp.data!);
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

    const [form] = Form.useForm();
    return (
        <Modal
            title={titleText}
            visible={visible}
            confirmLoading={confirmLoading}
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
                <Button
                    key="link"
                    type={
                        formMode == FormMode.Modification
                            ? 'primary'
                            : 'default'
                    }
                    onClick={() => handleOk(true)}
                >
                    {confirmButtonText}
                </Button>,
                <>
                    {' '}
                    {formMode == FormMode.Creation && (
                        <Button
                            key="link"
                            type="primary"
                            onClick={() => handleOk(false)}
                        >
                            {createTexts.confirmWithoutLeaveButton}
                        </Button>
                    )}
                </>,
            ]}
        >
            <>
                <Form form={form} layout="vertical" name="createNoteModalForm">
                    <Row>
                        <Space>
                            <Form.Item
                                name="date"
                                label="Date"
                                rules={[
                                    {
                                        required: true,
                                    },
                                    ({ getFieldValue, setFieldsValue }) => ({
                                        validator(_, value) {
                                            const missionId =
                                                getFieldValue('mission');
                                            const mission = missions.find(
                                                (m) => m._id == missionId
                                            );
                                            if (missionId == null) {
                                                return Promise.resolve();
                                            }

                                            if (
                                                moment(missionId!.endDate) <
                                                value
                                            ) {
                                                return Promise.reject(
                                                    new Error(
                                                        'La date de rembouresement est plus grande que la date'
                                                    )
                                                );
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
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
                    <FraisTypeInput></FraisTypeInput>
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
