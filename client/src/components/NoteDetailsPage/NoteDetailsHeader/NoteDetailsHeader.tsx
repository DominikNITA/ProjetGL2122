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
import { INoteLine } from '../../../types';
import { noteStateTag } from '../../../utility/common';
import CancelButton from '../../Buttons/CancelButton';
import ValidateButton from '../../Buttons/ValidateButton';
import ActionButtons from './ActionButtons';

type Props = {
    titleText: string;
    openCommentModal: (noteLinesToComment: INoteLine[]) => void;
};

const NoteDetailsHeader = ({ titleText, openCommentModal }: Props) => {
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
                                    (curr.expenseCategory.expenseType ==
                                    ExpenseType.Standard
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

            {[NoteViewMode.Validate, NoteViewMode.Fix].includes(
                noteDetailsManager.viewMode
            ) &&
                noteDetailsManager.currentNote != null && (
                    <>
                        <Divider></Divider>
                        <Descriptions
                            size="small"
                            column={3}
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
                            <Descriptions.Item label="Remboursements rejetes">
                                {
                                    noteDetailsManager.currentNote.noteLines?.filter(
                                        (nl) => nl.state == NoteLineState.Fixing
                                    ).length
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Remboursements valides">
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
                        {noteDetailsManager.viewMode ==
                            NoteViewMode.Validate && (
                            <Row
                                justify="end"
                                align="middle"
                                style={{ width: '100%' }}
                            >
                                <Space align="end">
                                    <CancelButton
                                        handleCancel={(e) => {
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
                                    <ValidateButton
                                        handleValidate={(e) => {
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
                                    ></ValidateButton>
                                </Space>
                            </Row>
                        )}
                    </>
                )}
        </PageHeader>
    );
};

export default NoteDetailsHeader;
