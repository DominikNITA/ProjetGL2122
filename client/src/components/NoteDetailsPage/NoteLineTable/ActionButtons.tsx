import { blue, red } from '@ant-design/colors';
import {
    CheckOutlined,
    CloseCircleOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    InfoOutlined,
} from '@ant-design/icons';
import { Space, Button, Popconfirm } from 'antd';
import React from 'react';
import { changeNoteLineState } from '../../../clients/noteClient';
import { NoteLineState, NoteState, NoteViewMode } from '../../../enums';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';
import { INoteLine } from '../../../types';
import { FormMode } from '../../../utility/common';
import CancelButton from '../../CancelButton';
import ValidateButton from '../../ValidateButton';

type Props = {
    openModifyModal: (formMode: FormMode) => void;
    openCommentModal: (noteLinesToComment: INoteLine[]) => void;
    noteLine: INoteLine;
};

const ActionButtons = ({
    openModifyModal,
    noteLine,
    openCommentModal,
}: Props) => {
    const noteDetailsManager = useNoteDetailsManager();

    return (
        <Space size="small">
            {(noteDetailsManager.viewMode == NoteViewMode.InitialCreation ||
                (noteDetailsManager.viewMode == NoteViewMode.Fix &&
                    [NoteLineState.Fixing, NoteLineState.Fixed].includes(
                        noteLine.state
                    ))) && (
                <>
                    <Button
                        style={{ color: blue.primary }}
                        onClick={() => {
                            noteDetailsManager?.updateNoteLine(noteLine);
                            openModifyModal(FormMode.Modification);
                        }}
                    >
                        <EditOutlined></EditOutlined>
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this task?"
                        onConfirm={() => console.log('Delete note line : TODO')}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button style={{ color: red.primary }}>
                            <DeleteOutlined></DeleteOutlined>
                        </Button>
                    </Popconfirm>
                </>
            )}
            {noteDetailsManager.viewMode == NoteViewMode.Validate && (
                <>
                    <Button
                        style={{ color: blue.primary }}
                        onClick={() => {
                            noteDetailsManager?.updateNoteLine(noteLine);
                            openModifyModal(FormMode.View);
                        }}
                    >
                        <InfoOutlined></InfoOutlined>
                    </Button>
                    <CancelButton
                        handleCancel={(e) => {
                            e.stopPropagation();
                            openCommentModal([noteLine]);
                        }}
                        text={<CloseOutlined></CloseOutlined>}
                    ></CancelButton>
                    <ValidateButton
                        handleValidate={(e) => {
                            e.stopPropagation();
                            changeNoteLineState(
                                noteLine._id,
                                NoteLineState.Validated
                            );
                            noteDetailsManager.reload();
                        }}
                        text={<CheckOutlined></CheckOutlined>}
                    ></ValidateButton>
                </>
            )}
            {noteDetailsManager.currentNote?.state == NoteState.Validated && (
                <Button
                    style={{ color: blue.primary }}
                    onClick={() => {
                        noteDetailsManager?.updateNoteLine(noteLine);
                        openModifyModal(FormMode.View);
                    }}
                >
                    <InfoOutlined></InfoOutlined>
                </Button>
            )}
        </Space>
    );
};

export default ActionButtons;
