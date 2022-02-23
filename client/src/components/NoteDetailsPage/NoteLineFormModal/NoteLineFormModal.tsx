import {
    Modal,
    Button,
    Form,
    Input,
    DatePicker,
    Space,
    Alert,
    Upload,
    message,
} from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
    createNoteLine,
    sendJustificatif,
    updateNoteLine,
} from '../../../clients/noteClient';
import { ExpenseType, NoteLineState } from '../../../enums';
import { IExpenseCategory, IMission, INoteLine } from '../../../types';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';
import moment from 'moment';
import 'moment/locale/fr';
import { FormMode, getJustificatifUrl } from '../../../utility/common';
import FraisTypeInput from './FraisTypeInput';
import { grey } from '@ant-design/colors';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import MissionSelect from './MissionSelect';
import JustificatifPreview from './JustificatifPreview';
import CancelButton from '../../CancelButton';

const NoteLineFormModal = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);

    const noteDetailsManager = useNoteDetailsManager();

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

    const viewTexts = {
        title: 'Details de remboursement',
    };

    const [formMode, setFormMode] = useState<FormMode>(FormMode.Unknown);

    useImperativeHandle(ref, () => ({
        showModal(formMode: FormMode) {
            setFormMode(formMode);
            setVisible(true);
        },
    }));

    const [selectedFraisType, setSelectedFraisType] =
        useState<IExpenseCategory>();
    const [selectedMission, setSelectedMission] = useState<IMission>();

    useEffect(() => {
        form.resetFields();
        if (noteDetailsManager.noteLine != null) {
            const correctNoteLine = noteDetailsManager!.noteLine;
            form.setFieldsValue(correctNoteLine);
            setSelectedFraisType(correctNoteLine!.expenseCategory!);
            setSelectedMission(correctNoteLine!.mission!);
        } else {
            // form.setFieldsValue({ fraisType: FraisType.Standard }); TODO: expense
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
            case FormMode.View:
                setTitleText(viewTexts.title);
                break;
            default:
                break;
        }
        setErrorMessage('');
    }, [formMode]);

    const handleNoteLineSubmit = async (values: any) => {
        if (formMode == FormMode.Creation) {
            return createNoteLine(
                {
                    ...values,
                    note: noteDetailsManager.currentNote!._id,
                    state: NoteLineState.Created,
                },
                noteDetailsManager.currentNote!
            );
        } else {
            return updateNoteLine({
                ...values,
                _id: noteDetailsManager.noteLine?._id,
            });
        }
    };

    const handleOk = async (doQuitAfterHandling: boolean) => {
        setErrorMessage('');

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
                        noteDetailsManager.reload();
                        setErrorMessage('');
                        form.resetFields();
                        if (doQuitAfterHandling) {
                            handleCancel();
                        } else {
                            const premadeNoteLine: Partial<INoteLine> = {
                                mission: response.data?.mission,
                                date: response.data?.date,
                                // fraisType: FraisType.Standard, TODO: expense
                            };
                            form.setFieldsValue(premadeNoteLine);
                            setSelectedMission(response.data?.mission);
                        }
                    } else {
                        setErrorMessage(response!.message!);
                    }
                });
            })
            .catch((info) => {
                // handleError(info);
            });
    };

    const handleCancel = () => {
        form.resetFields();
        noteDetailsManager.updateNoteLine(null);
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

    const missionDatesSpan = (mission: IMission) => (
        <span
            className="missionDates"
            style={{ fontSize: '0.85em', color: grey[3] }}
        >{`${mission.startDate.format('LL')} - ${mission.endDate.format(
            'LL'
        )}`}</span>
    );

    function onChangeSelectedMission(mission: IMission) {
        setSelectedMission(mission);
    }

    useEffect(() => {
        const currentDate = moment(form.getFieldValue('date')).locale('fr');
        if (selectedMission == null) return;
        if (
            selectedMission.startDate > currentDate ||
            selectedMission?.endDate < currentDate
        ) {
            form.setFieldsValue({ date: selectedMission.startDate });
        }
    }, [selectedMission]);

    return (
        <Modal
            title={titleText}
            visible={visible}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            footer={[
                <CancelButton
                    handleCancel={handleCancel}
                    text="Annuler"
                ></CancelButton>,
                <>
                    {(formMode == FormMode.Creation ||
                        formMode == FormMode.Modification) && (
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
                        </Button>
                    )}
                    ,
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
                    <div className="mission-dates-container">
                        <MissionSelect
                            formMode={formMode}
                            selectedMission={selectedMission}
                            onChange={onChangeSelectedMission}
                        ></MissionSelect>
                        {selectedMission && missionDatesSpan(selectedMission)}
                    </div>
                    <Form.Item
                        name="date"
                        label="Date"
                        rules={[
                            {
                                required: true,
                            },
                            ({ getFieldValue, setFieldsValue }) => ({
                                validator(_, value) {
                                    if (selectedMission!.endDate < value) {
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
                        <DatePicker disabled={formMode == FormMode.View} />
                    </Form.Item>

                    <FraisTypeInput
                        form={form}
                        formMode={formMode}
                        selectedFraisType={selectedFraisType}
                        onChange={(value) => setSelectedFraisType(value)}
                    ></FraisTypeInput>

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
                        <Input disabled={formMode == FormMode.View} />
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
                                disabled={formMode == FormMode.View}
                            >
                                <Button
                                    disabled={formMode == FormMode.View}
                                    icon={<UploadOutlined />}
                                >
                                    {previewData ||
                                    noteDetailsManager.noteLine?.justificatif
                                        ? 'Modifier le justificatif'
                                        : 'Ajouter un justificatif'}
                                </Button>
                            </Upload>
                            <JustificatifPreview
                                serverUrl={getJustificatifUrl(
                                    noteDetailsManager.noteLine?.justificatif
                                )}
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

export default NoteLineFormModal;
