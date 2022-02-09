import { PageHeader, Button, Descriptions } from 'antd';
import React from 'react';
import { FraisType } from '../../../enums';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';
import { noteStateTag } from '../../../utility/common';
import ActionButtons from './ActionButtons';

type Props = {
    titleText: string;
};

const NoteDetailsHeader = ({ titleText }: Props) => {
    const noteDetailsManager = useNoteDetailsManager();
    return (
        <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={titleText}
            subTitle="Work in progress"
            extra={<ActionButtons></ActionButtons>}
        >
            {noteDetailsManager.currentNote != null && (
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="Demandeur">
                        {`${noteDetailsManager.currentNote!.owner.firstName} 
                    ${noteDetailsManager.currentNote!.owner.lastName}`}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total TTC">
                        {noteDetailsManager.currentNote
                            .noteLines!.reduce(
                                (prev, curr) =>
                                    prev +
                                    (curr.fraisType == FraisType.Standard
                                        ? curr.ttc!
                                        : 0), //TODO: dirty hack - do some proper function for calculating kilometrique frais later :)
                                0
                            )
                            .toFixed(2)}
                        €
                    </Descriptions.Item>
                    <Descriptions.Item label="Date de creation">
                        2022-01-10
                    </Descriptions.Item>
                    <Descriptions.Item label="Statut">
                        {noteStateTag(noteDetailsManager.currentNote.state)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Remboursements">
                        {noteDetailsManager.currentNote.noteLines!.length}
                    </Descriptions.Item>
                </Descriptions>
            )}
        </PageHeader>
    );
};

export default NoteDetailsHeader;
