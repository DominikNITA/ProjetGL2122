import { Button, Popconfirm } from 'antd';
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
            <Popconfirm
                title={'Envoyer à la validation?'}
                onConfirm={() =>
                    changeNoteState(
                        noteDetailsManager.currentNote!._id,
                        NoteState.InValidation
                    ).then((resp) => {
                        if (resp.isOk) {
                            noteDetailsManager.reload();
                        }
                    })
                }
                okText="Oui"
                cancelText="Non"
                disabled={
                    (noteDetailsManager.currentNote?.noteLines?.length ?? 0) <=
                        0 ||
                    (noteDetailsManager.currentNote?.noteLines?.filter(
                        (x) => x.state == NoteLineState.Fixing
                    ).length ?? 1) > 0
                }
            >
                <Button
                    key={'sendToValidationButton'}
                    type="primary"
                    disabled={
                        (noteDetailsManager.currentNote?.noteLines?.length ??
                            0) <= 0 ||
                        (noteDetailsManager.currentNote?.noteLines?.filter(
                            (x) => x.state == NoteLineState.Fixing
                        ).length ?? 1) > 0
                    }
                >
                    Envoyer a la validation
                </Button>
            </Popconfirm>
        );
    };
    const validateButton = () => {
        const shouldSendToFix =
            noteDetailsManager.currentNote!.noteLines!.filter(
                (nl) => nl.state == NoteLineState.Fixing
            ).length > 0;
        return (
            <Popconfirm
                title={(shouldSendToFix ? 'Rejeter' : 'Valider') + ' la note?'}
                onConfirm={() =>
                    changeNoteState(
                        noteDetailsManager.currentNote!._id,
                        shouldSendToFix ? NoteState.Fixing : NoteState.Validated
                    ).then((resp) => {
                        if (resp.isOk) {
                            noteDetailsManager.reload();
                        }
                    })
                }
                okText="Oui"
                cancelText="Non"
                disabled={
                    noteDetailsManager.currentNote!.noteLines!.filter(
                        (nl) =>
                            nl.state == NoteLineState.Created ||
                            nl.state == NoteLineState.Fixed
                    ).length > 0
                }
            >
                <Button
                    key={'validateButton'}
                    type="primary"
                    disabled={
                        noteDetailsManager.currentNote!.noteLines!.filter(
                            (nl) =>
                                nl.state == NoteLineState.Created ||
                                nl.state == NoteLineState.Fixed
                        ).length > 0
                    }
                >
                    {shouldSendToFix ? 'Rejeter' : 'Valider'}
                </Button>
            </Popconfirm>
        );
    };

    useEffect(() => {
        setButtonsToDisplay([]);
        switch (noteDetailsManager.viewMode) {
            case NoteViewMode.InitialCreation:
            case NoteViewMode.Fix:
                setButtonsToDisplay([sendToValidationButton()]);
                break;
            case NoteViewMode.Validate:
                setButtonsToDisplay([validateButton()]);
                break;
        }
    }, [noteDetailsManager.currentNote, noteDetailsManager.reloadHack]);

    return <>{buttonsToDisplay.map((x) => x)}</>;
};

export default ActionButtons;
