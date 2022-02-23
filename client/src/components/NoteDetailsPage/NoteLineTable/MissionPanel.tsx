import { purple } from '@ant-design/colors';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { Space, Row, Divider, Collapse } from 'antd';
import React from 'react';
import { changeNoteLineState } from '../../../clients/noteClient';
import { ExpenseType, NoteLineState, NoteViewMode } from '../../../enums';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';
import { IMission, INoteLine } from '../../../types';
import { FormMode } from '../../../utility/common';
import CancelButton from '../../CancelButton';
import CreateNoteLineButton from '../../CreateNoteLineButton';
import ValidateButton from '../../ValidateButton';
import MissionNoteLineTable from './MissionNoteLineTable';

const { Panel } = Collapse;

type Props = {
    mission: IMission;
    noteLines: INoteLine[];
    openJustificatifPreview: (src: string | null) => void;
    openModifyModal: (formMode: FormMode) => void;
    openCommentModal: (noteLinesToComment: INoteLine[]) => void;
};

const MissionPanel = ({
    mission,
    noteLines,
    openCommentModal,
    openJustificatifPreview,
    openModifyModal,
}: Props) => {
    const noteDetailsManager = useNoteDetailsManager();

    return (
        <Panel
            extra={
                noteDetailsManager.viewMode == NoteViewMode.Validate && (
                    <Space align="end">
                        <CancelButton
                            handleCancel={(e) => {
                                e.stopPropagation();
                                openCommentModal(noteLines);
                            }}
                            text={
                                <span>
                                    Rejeter toute la mission{' '}
                                    <CloseOutlined></CloseOutlined>
                                </span>
                            }
                        ></CancelButton>
                        <ValidateButton
                            handleValidate={(e) => {
                                e.stopPropagation();
                                noteLines.forEach((l) =>
                                    changeNoteLineState(
                                        l._id,
                                        NoteLineState.Validated
                                    )
                                );
                                noteDetailsManager.reload();
                            }}
                            text={
                                <span>
                                    Valider toute la mission{' '}
                                    <CheckOutlined></CheckOutlined>
                                </span>
                            }
                        ></ValidateButton>
                    </Space>
                )
            }
            header={
                <Row justify="space-between" style={{ width: '100%' }}>
                    <Space split={<Divider type="vertical"></Divider>}>
                        <strong>{mission.name}</strong>
                        {noteLines.length + ' remboursement(s)'}
                        {'TTC: ' +
                            noteLines
                                .filter((x) => x.mission._id === mission._id)
                                .reduce(
                                    (prev, curr) =>
                                        prev +
                                        (curr.expenseCategory.expenseType ==
                                        ExpenseType.Standard
                                            ? curr.ttc!
                                            : 0),
                                    0
                                )
                                .toFixed(2) +
                            '€'}
                    </Space>
                </Row>
            }
            key={mission._id}
            className="noPadding"
        >
            <div>Test</div>
            <MissionNoteLineTable
                mission={mission}
                noteLines={noteLines}
                openJustificatifPreview={openJustificatifPreview}
                openModifyModal={openModifyModal}
                openCommentModal={openCommentModal}
            ></MissionNoteLineTable>

            {[NoteViewMode.InitialCreation, NoteViewMode.Fix].includes(
                noteDetailsManager.viewMode
            ) && (
                <CreateNoteLineButton
                    onClick={() => {
                        noteDetailsManager?.updateNoteLine({
                            mission: mission,
                            date: mission.startDate,
                            // fraisType: FraisType.Standard, TODO: expense
                        });
                        openModifyModal(FormMode.Creation);
                    }}
                    text="Ajouter un nouveau remboursement pour cette mission"
                    rowStyle={{ padding: '1rem' }}
                    buttonStyle={{
                        background: purple[4],
                        borderColor: purple[6],
                    }}
                ></CreateNoteLineButton>
            )}
        </Panel>
    );
};

export default MissionPanel;
