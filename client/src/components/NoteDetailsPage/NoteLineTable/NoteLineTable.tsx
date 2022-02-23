import { purple } from '@ant-design/colors';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { Col, Collapse, Divider, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { changeNoteLineState } from '../../../clients/noteClient';
import { NoteViewMode, NoteLineState, ExpenseType } from '../../../enums';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';
import { IMission, INoteLine } from '../../../types';
import { FormMode } from '../../../utility/common';
import CancelButton from '../../Buttons/CancelButton';
import CreateNoteLineButton from '../../CreateNoteLineButton';
import ValidateButton from '../../Buttons/ValidateButton';
import MissionNoteLineTable from './MissionNoteLineTable';

import './noteLineTable.css';

type Props = {
    noteLines: INoteLine[];
    openModifyModal: (formMode: FormMode) => void;
    openJustificatifPreview: (src: string | null) => void;
    openCommentModal: (noteLinesToComment: INoteLine[]) => void;
};

const NoteLineTable = ({
    noteLines,
    openModifyModal,
    openJustificatifPreview,
    openCommentModal,
}: Props) => {
    const [uniqueMissions, setUniqueMissions] = useState<IMission[]>([]);
    useEffect(() => {
        const uniqueMissionsTemp: IMission[] = [];
        noteLines.forEach((noteLine) => {
            if (
                !uniqueMissionsTemp.some((x) => x._id === noteLine.mission._id)
            ) {
                uniqueMissionsTemp.push(noteLine.mission);
            }
        });
        setUniqueMissions(uniqueMissionsTemp);
    }, [noteLines]);

    const noteDetailsManager = useNoteDetailsManager();
    const { Panel } = Collapse;

    return (
        <Col>
            <Collapse>
                {uniqueMissions.map((mission) => {
                    const noteLinesInMission = noteLines.filter(
                        (x) => x.mission._id === mission._id
                    );
                    return (
                        <Panel
                            extra={
                                noteDetailsManager.viewMode ==
                                    NoteViewMode.Validate && (
                                    <Space align="end">
                                        <CancelButton
                                            handleCancel={(e) => {
                                                e.stopPropagation();
                                                openCommentModal(
                                                    noteLinesInMission
                                                );
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
                                                noteLinesInMission.forEach(
                                                    (l) =>
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
                                <Row
                                    justify="space-between"
                                    style={{ width: '100%' }}
                                >
                                    <Space
                                        split={
                                            <Divider type="vertical"></Divider>
                                        }
                                    >
                                        <strong>{mission.name}</strong>
                                        {noteLinesInMission.length +
                                            ' remboursement(s)'}
                                        {'TTC: ' +
                                            noteLinesInMission
                                                .reduce(
                                                    (prev, curr) =>
                                                        prev +
                                                        (curr.expenseCategory
                                                            .expenseType ==
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
                            <MissionNoteLineTable
                                mission={mission}
                                noteLines={noteLinesInMission}
                                openJustificatifPreview={
                                    openJustificatifPreview
                                }
                                openModifyModal={openModifyModal}
                                openCommentModal={openCommentModal}
                            ></MissionNoteLineTable>

                            {[
                                NoteViewMode.InitialCreation,
                                NoteViewMode.Fix,
                            ].includes(noteDetailsManager.viewMode) && (
                                <CreateNoteLineButton
                                    onClick={() => {
                                        noteDetailsManager?.updateNoteLine({
                                            mission: mission,
                                            date: mission.startDate,
                                            //TODO: expense
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
                })}
            </Collapse>
        </Col>
    );
};

export default NoteLineTable;
