import { Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    getCalculatedPrice,
    getNote,
    getNoteViewMode,
} from '../clients/noteClient';
import CreateNoteLineButton from '../components/CreateNoteLineButton';
import NoteDetailsHeader from '../components/NoteDetailsPage/NoteDetailsHeader/NoteDetailsHeader';
import NoteLineFormModal from '../components/NoteDetailsPage/NoteLineFormModal/NoteLineFormModal';
import JustificatifTablePreview from '../components/NoteDetailsPage/NoteLineTable/JustificatifTablePreview';
import NoteLineTable from '../components/NoteDetailsPage/NoteLineTable/NoteLineTable';
import NoteLineCommentModal from '../components/NoteLineCommentModal';
import { ExpenseType, NoteViewMode } from '../enums';
import { useNoteDetailsManager } from '../stateProviders/noteDetailsManagerProvider';
import { INoteLine } from '../types';
import { FormMode, getFrenchMonth } from '../utility/common';

const NoteDetailsPage = () => {
    const [noteLines, setNoteLines] = useState<INoteLine[]>([]);
    const [titleText, setTitleText] = useState('');
    const noteDetailsManager = useNoteDetailsManager();
    const params = useParams();

    useEffect(() => {
        getNoteViewMode(params.noteId!).then((response) => {
            if (response.isOk) {
                noteDetailsManager.setViewMode(response.data!);
            }
        });
    }, [params.noteId, noteDetailsManager.reloadHack]);

    useEffect(() => {
        if (noteDetailsManager.viewMode == NoteViewMode.Unknown) return;

        getNote(params.noteId!).then((response) => {
            if (response?.isOk) {
                noteDetailsManager.updateCurrentNote(response!.data!);
                const noteLines = response.data!.noteLines!;
                setNoteLines(noteLines);
                setTitleText(
                    `Note de frais de ${getFrenchMonth(
                        response!.data!.month
                    )} ${response!.data!.year}`
                );
            } else {
                //TODO: Redirect to notes? Show some message?
            }
        });
    }, [noteDetailsManager.viewMode, noteDetailsManager.reloadHack]);

    const noteLineFormModalRef = useRef<any>();
    const noteLineCommentModalRef = useRef<any>();

    const [visibleJustificatif, setVisibleJustificatif] = useState(false);
    const [justificatifSrc, setJustificatifSrc] = useState<string | null>('');
    const openJustificatifPreview = (src: string | null) => {
        setJustificatifSrc(src);
        setVisibleJustificatif(true);
    };

    const openCommentModal = (noteLinesToComment: INoteLine[]) =>
        noteLineCommentModalRef.current?.showModal(noteLinesToComment);

    return (
        <div>
            <NoteLineFormModal ref={noteLineFormModalRef}></NoteLineFormModal>
            <JustificatifTablePreview
                src={justificatifSrc!}
                updateVisible={setVisibleJustificatif}
                visible={visibleJustificatif}
            ></JustificatifTablePreview>
            <NoteLineCommentModal
                ref={noteLineCommentModalRef}
            ></NoteLineCommentModal>

            <Space direction="vertical" size={25} style={{ width: '100%' }}>
                <NoteDetailsHeader
                    titleText={titleText}
                    openCommentModal={openCommentModal}
                ></NoteDetailsHeader>

                {[NoteViewMode.Fix, NoteViewMode.InitialCreation].includes(
                    noteDetailsManager.viewMode
                ) && (
                    <CreateNoteLineButton
                        onClick={() => {
                            noteDetailsManager?.updateNoteLine(null);
                            noteLineFormModalRef.current?.showModal(
                                FormMode.Creation
                            );
                        }}
                        text="Ajouter un remboursement"
                    ></CreateNoteLineButton>
                )}

                <NoteLineTable
                    noteLines={noteLines}
                    openModifyModal={(formMode: FormMode) => {
                        noteLineFormModalRef.current?.showModal(formMode);
                    }}
                    openJustificatifPreview={openJustificatifPreview}
                    openCommentModal={openCommentModal}
                ></NoteLineTable>

                {[NoteViewMode.Fix, NoteViewMode.InitialCreation].includes(
                    noteDetailsManager.viewMode
                ) &&
                    noteLines.length >= 10 && (
                        <CreateNoteLineButton
                            onClick={() => {
                                noteDetailsManager?.updateNoteLine(null);
                                noteLineFormModalRef.current?.showModal(
                                    FormMode.Creation
                                );
                            }}
                            text="Ajouter un remboursement"
                        ></CreateNoteLineButton>
                    )}
            </Space>
        </div>
    );
};

export default NoteDetailsPage;
