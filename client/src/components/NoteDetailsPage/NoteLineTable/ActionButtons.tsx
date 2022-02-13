import { blue, red } from '@ant-design/colors';
import { Space, Button, Popconfirm } from 'antd';
import React from 'react';
import { NoteLineState, NoteViewMode } from '../../../enums';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';
import { INoteLine } from '../../../types';
import { FormMode } from '../../../utility/common';

type Props = {
    openModifyModal: (formMode: FormMode) => void;
    noteLine: INoteLine;
};

const ActionButtons = ({ openModifyModal, noteLine }: Props) => {
    const noteDetailsManager = useNoteDetailsManager();

    return (
        <Space size="middle">
            {(noteDetailsManager.viewMode == NoteViewMode.InitialCreation ||
                (noteDetailsManager.viewMode == NoteViewMode.Fix &&
                    noteLine.state == NoteLineState.Fixing)) && (
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
        </Space>
    );
};

export default ActionButtons;
