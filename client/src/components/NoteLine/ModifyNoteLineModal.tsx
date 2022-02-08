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
    Upload,
    Image,
    message,
} from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createNoteLine,
    sendJustificatif,
    updateNoteLine,
} from '../../clients/noteClient';
import { FraisType, NoteLineState } from '../../enums';
import { useAuth } from '../../stateProviders/authProvider';
import { IMission, INoteLine } from '../../types';
import { useSelectedNoteLine } from '../../stateProviders/selectedNoteLineProvider';
import { getMissionsByService } from '../../clients/serviceClient';
import moment from 'moment';
import { FormMode } from '../../utility/common';
import FraisTypeInput from './FraisTypeInput';
import { red } from '@ant-design/colors';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import MissionSelect from './MissionSelect';
import JustificatifPreview from './JustificatifPreview';

const ModifyNoteLineModal = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);

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
                if (justificatifFile != null) {
                    const resp = await sendJustificatif(
                        justificatifFile.originFileObj
                    );
                    if (resp?.isOk && resp.data != null) {
                        values.justificatif = resp.data;
                        values.justificatifData = undefined;
                    } else {
                        setConfirmLoading(false);
                        setErrorMessage(resp!.message!);
                        return;
                    }
                }
                handleNoteLineSubmit(values).then((response) => {
                    if (response?.isOk) {
                        message.success(
                            formMode == FormMode.Creation
                                ? 'Creation du remboursement'
                                : 'Modification du remboursement'
                        );
                        selectedNoteLine.reload();
                        setErrorMessage('');
                        form.resetFields();
                        if (doQuitAfterHandling) {
                            handleCancel();
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
                // handleError(info);
            });
    };

    const handleCancel = () => {
        form.resetFields();
        selectedNoteLine.updateNoteLine(null);
        setErrorMessage('');
        setVisible(false);
        setFormMode(FormMode.Unknown);
        setPreviewData('');
        setJustificatifFile(null);
    };

    const [justificatifFile, setJustificatifFile] =
        useState<UploadFile<any> | null>(null);

    const [form] = Form.useForm();

    const [previewData, setPreviewData] = useState('');

    function getBase64(file: Blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

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
                            <MissionSelect></MissionSelect>
                        </Space>
                    </Row>
                    <FraisTypeInput form={form}></FraisTypeInput>
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
                        name="justificatifData"
                        label="Justificatif"
                        style={{ width: 800 }}
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                    >
                        <Space size="large">
                            <Upload
                                beforeUpload={() => false}
                                onChange={async ({ file, fileList }) => {
                                    // fileList = fileList.slice(-1);
                                    setJustificatifFile(fileList[0]);
                                    setPreviewData(
                                        (await getBase64(
                                            fileList[0].originFileObj as Blob
                                        )) as string
                                    );
                                }}
                                multiple={false}
                                maxCount={1}
                                showUploadList={false}
                            >
                                <Button icon={<UploadOutlined />}>
                                    {previewData ||
                                    selectedNoteLine.noteLine?.justificatif
                                        ? 'Modifier le justificatif'
                                        : 'Ajouter un justificatif'}
                                </Button>
                            </Upload>
                            <JustificatifPreview
                                serverUrl={`http://localhost:4000/uploads/${selectedNoteLine.noteLine?.justificatif}`}
                                previewData={previewData}
                                formMode={formMode}
                            ></JustificatifPreview>
                        </Space>
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
