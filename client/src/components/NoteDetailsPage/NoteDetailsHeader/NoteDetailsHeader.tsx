import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import {
    PageHeader,
    Descriptions,
    Divider,
    Typography,
    Space,
    Row,
} from 'antd';
import { changeNoteLineState } from '../../../clients/noteClient';
import { ExpenseType, NoteLineState, NoteViewMode } from '../../../enums';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';
import useWindowDimensions from '../../../stateProviders/useWindowsDimensions';
import { INoteLine } from '../../../types';
import { noteStateTag } from '../../../utility/common';
import CancelButton from '../../Buttons/CancelButton';
import OkButton from '../../Buttons/OkButton';
import ActionButtons from './ActionButtons';

type Props = {
    titleText: string;
    openCommentModal: (noteLinesToComment: INoteLine[]) => void;
};

const NoteDetailsHeader = ({ titleText, openCommentModal }: Props) => {
    const noteDetailsManager = useNoteDetailsManager();
    const { isMobile } = useWindowDimensions();
    return (
        <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={titleText}
            extra={<ActionButtons></ActionButtons>}
        >
            {noteDetailsManager.currentNote != null && (
                <Descriptions size="small" column={isMobile() ? 1 : 3}>
                    <Descriptions.Item label="Demandeur">
                        {`${noteDetailsManager.currentNote!.owner.firstName} 
                    ${noteDetailsManager.currentNote!.owner.lastName}`}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total TTC">
                        {noteDetailsManager.currentNote
                            .noteLines!.reduce((prev, curr) => {
                                let value = curr.ttc;
                                if (
                                    curr.expenseCategory.expenseType ==
                                    ExpenseType.Kilometrique
                                ) {
                                    value = curr.kilometerExpense ?? 0;
                                }
                                return prev + value!;
                            }, 0)
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

            {noteDetailsManager.viewMode == NoteViewMode.Validate &&
                noteDetailsManager.currentNote != null && (
                    <>
                        <Divider></Divider>
                        <Descriptions
                            size="small"
                            column={isMobile() ? 1 : 3}
                            layout="horizontal"
                        >
                            <Descriptions.Item label="Remboursements en attente">
                                {
                                    noteDetailsManager.currentNote.noteLines?.filter(
                                        (nl) =>
                                            nl.state == NoteLineState.Created ||
                                            nl.state == NoteLineState.Fixed
                                    ).length
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Remboursements rejetés">
                                {
                                    noteDetailsManager.currentNote.noteLines?.filter(
                                        (nl) => nl.state == NoteLineState.Fixing
                                    ).length
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Remboursements validés">
                                <Typography.Text strong={true}>
                                    {
                                        noteDetailsManager.currentNote.noteLines?.filter(
                                            (nl) =>
                                                nl.state ==
                                                NoteLineState.Validated
                                        ).length
                                    }
                                </Typography.Text>
                            </Descriptions.Item>
                        </Descriptions>

                        <Row
                            justify="end"
                            align="middle"
                            style={{ width: '100%' }}
                        >
                            <Space align="end">
                                <CancelButton
                                    onCancel={(e) => {
                                        e.stopPropagation();
                                        openCommentModal(
                                            noteDetailsManager.currentNote!
                                                .noteLines!
                                        );
                                    }}
                                    text={
                                        <span>
                                            Rejeter toute la note{' '}
                                            <CloseOutlined></CloseOutlined>
                                        </span>
                                    }
                                ></CancelButton>
                                <OkButton
                                    onOK={(e) => {
                                        e.stopPropagation();
                                        noteDetailsManager.currentNote?.noteLines?.forEach(
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
                                            Valider toute la note{' '}
                                            <CheckOutlined></CheckOutlined>
                                        </span>
                                    }
                                ></OkButton>
                            </Space>
                        </Row>
                    </>
                )}
            {noteDetailsManager.viewMode == NoteViewMode.Fix &&
                noteDetailsManager.currentNote != null && (
                    <>
                        <Divider></Divider>
                        <Descriptions
                            size="small"
                            column={isMobile() ? 1 : 3}
                            layout="horizontal"
                        >
                            <Descriptions.Item label="Remboursements corrigés">
                                {
                                    noteDetailsManager.currentNote.noteLines?.filter(
                                        (nl) => nl.state == NoteLineState.Fixed
                                    ).length
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Remboursements rejetés">
                                {
                                    noteDetailsManager.currentNote.noteLines?.filter(
                                        (nl) => nl.state == NoteLineState.Fixing
                                    ).length
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Remboursements validés">
                                <Typography.Text strong={true}>
                                    {
                                        noteDetailsManager.currentNote.noteLines?.filter(
                                            (nl) =>
                                                nl.state ==
                                                NoteLineState.Validated
                                        ).length
                                    }
                                </Typography.Text>
                            </Descriptions.Item>
                        </Descriptions>
                    </>
                )}
        </PageHeader>
    );
};

export default NoteDetailsHeader;
