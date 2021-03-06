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
import React, { ReactNode, useEffect, useState } from 'react';
import {
    changeNoteLineState,
    deleteNoteLine,
} from '../../../clients/noteClient';
import { NoteLineState, NoteState, NoteViewMode } from '../../../enums';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';
import { INoteLine } from '../../../types';
import { FormMode } from '../../../utility/common';
import CancelButton from '../../Buttons/CancelButton';
import OkButton from '../../Buttons/OkButton';

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

    const detailsButton = (
        <Button
            style={{ color: blue.primary }}
            onClick={() => {
                noteDetailsManager?.updateNoteLine(noteLine);
                openModifyModal(FormMode.View);
            }}
        >
            <InfoOutlined></InfoOutlined>
        </Button>
    );

    const editButton = (
        <Button
            style={{ color: blue.primary }}
            onClick={() => {
                noteDetailsManager?.updateNoteLine(noteLine);
                openModifyModal(FormMode.Modification);
            }}
        >
            <EditOutlined></EditOutlined>
        </Button>
    );

    const deleteButton = (
        <Popconfirm
            title="Voulez-vous supprimer ce remboursement?"
            onConfirm={() =>
                deleteNoteLine(noteLine._id).then(() =>
                    noteDetailsManager.reload()
                )
            }
            okText="Oui"
            cancelText="Non"
        >
            <Button style={{ color: red.primary }}>
                <DeleteOutlined></DeleteOutlined>
            </Button>
        </Popconfirm>
    );

    const validateButton = (
        <OkButton
            onOK={(e) => {
                e.stopPropagation();
                changeNoteLineState(noteLine._id, NoteLineState.Validated);
                noteDetailsManager.reload();
            }}
            text={<CheckOutlined></CheckOutlined>}
        ></OkButton>
    );

    const rejectButton = (
        <CancelButton
            onCancel={(e) => {
                e.stopPropagation();
                openCommentModal([noteLine]);
            }}
            text={<CloseOutlined></CloseOutlined>}
        ></CancelButton>
    );

    const [buttonsToDisplay, setButtonsToDisplay] = useState<ReactNode[]>([]);

    useEffect(() => {
        switch (noteDetailsManager.viewMode) {
            case NoteViewMode.InitialCreation:
                setButtonsToDisplay([editButton, deleteButton]);
                break;
            case NoteViewMode.Validate:
                setButtonsToDisplay([
                    detailsButton,
                    rejectButton,
                    validateButton,
                ]);
                break;
            case NoteViewMode.Fix:
                if (noteLine.state == NoteLineState.Validated) {
                    setButtonsToDisplay([detailsButton]);
                } else {
                    setButtonsToDisplay([editButton, deleteButton]);
                }
                break;
            case NoteViewMode.View:
                setButtonsToDisplay([detailsButton]);
                break;
            default:
                setButtonsToDisplay([]);
                break;
        }
    }, [noteDetailsManager.viewMode, noteDetailsManager.currentNote]);

    return <Space size="small">{buttonsToDisplay.map((x) => x)}</Space>;
};

export default ActionButtons;
