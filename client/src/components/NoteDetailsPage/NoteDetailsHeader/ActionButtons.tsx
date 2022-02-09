import { Button } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { changeNoteState } from '../../../clients/noteClient';
import { NoteLineState, NoteState, NoteViewMode } from '../../../enums';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';

type Props = {};

const ActionButtons = (props: Props) => {
    const noteDetailsManager = useNoteDetailsManager();
    const [buttonsToDisplay, setButtonsToDisplay] = useState<ReactElement[]>(
        []
    );

    const sendToValidationButton = () => {
        return (
            <Button
                type="primary"
                disabled={
                    (noteDetailsManager.currentNote?.noteLines?.length ?? 0) <=
                        0 ||
                    (noteDetailsManager.currentNote?.noteLines?.filter(
                        (x) => x.state == NoteLineState.Fixing
                    ).length ?? 1) > 0
                }
                onClick={() =>
                    changeNoteState(
                        noteDetailsManager.currentNote!._id,
                        NoteState.InValidation
                    ).then((resp) => {
                        if (resp.isOk) {
                            noteDetailsManager.reload();
                        }
                    })
                }
            >
                Envoyer a la validation
            </Button>
        );
    };

    useEffect(() => {
        setButtonsToDisplay([]);
        switch (noteDetailsManager.viewMode) {
            case NoteViewMode.InitialCreation:
            case NoteViewMode.Fix:
                setButtonsToDisplay([sendToValidationButton()]);
        }
    }, [noteDetailsManager.currentNote, noteDetailsManager.reloadHack]);

    return <>{buttonsToDisplay.map((x) => x)}</>;
};

export default ActionButtons;
