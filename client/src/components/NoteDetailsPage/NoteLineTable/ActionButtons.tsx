import { blue, red } from '@ant-design/colors';
import {
    CheckOutlined,
    CloseCircleOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import { Space, Button, Popconfirm } from 'antd';
import React from 'react';
import { changeNoteLineState } from '../../../clients/noteClient';
import { NoteLineState, NoteViewMode } from '../../../enums';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';
import { INoteLine } from '../../../types';
import { FormMode } from '../../../utility/common';
import CancelButton from '../../CancelButton';
import ValidateButton from '../../ValidateButton';

type Props = {
    openModifyModal: (formMode: FormMode) => void;
    openCommentModal: () => void;
    noteLine: INoteLine;
};

const ActionButtons = ({
    openModifyModal,
    noteLine,
    openCommentModal,
}: Props) => {
    const noteDetailsManager = useNoteDetailsManager();

    return (
        <Space size="middle">
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
                        Modifier
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this task?"
                        onConfirm={() => console.log('Delete note line : TODO')}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button style={{ color: red.primary }}>
                            Supprimer
                        </Button>
                    </Popconfirm>
                </>
            )}
            {noteDetailsManager.viewMode == NoteViewMode.Validate && (
                <>
                    <CancelButton
                        handleCancel={(e) => {
                            e.stopPropagation();
                            noteDetailsManager?.updateNoteLine(noteLine);
                            openCommentModal();
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
        </Space>
    );
};

export default ActionButtons;
