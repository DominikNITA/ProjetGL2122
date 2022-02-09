import { blue, purple, red } from '@ant-design/colors';
import {
    Button,
    Col,
    Collapse,
    Descriptions,
    Divider,
    PageHeader,
    Popconfirm,
    Row,
    Space,
    Table,
} from 'antd';
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
import NoteLineTable from '../components/NoteDetailsPage/NoteLineTable/NoteLineTable';
import { FraisType, NoteViewMode } from '../enums';
import { useNoteDetailsManager } from '../stateProviders/selectedNoteLineProvider';
import { INoteLine } from '../types';
import { FormMode, getFrenchMonth, noteStateTag } from '../utility/common';

const NoteDetailsPage = () => {
    const [noteLines, setNoteLines] = useState<INoteLine[]>([]);
    const [titleText, setTitleText] = useState('');
    const selectedNoteLine = useNoteDetailsManager();
    const params = useParams();

    const [viewMode, setViewMode] = useState(NoteViewMode.Unknown);

    useEffect(() => {
        getNoteViewMode(params.noteId!).then((response) => {
            if (response.isOk) {
                setViewMode(response.data!);
            }
        });
    }, [params.noteId]);

    useEffect(() => {
        if (viewMode == NoteViewMode.Unknown) return;
        getNote(params.noteId!).then((response) => {
            if (response?.isOk) {
                selectedNoteLine.updateCurrentNote(response!.data!);
                setNoteLines(response.data!.noteLines!);
                setTitleText(
                    `Note de frais de ${getFrenchMonth(
                        response!.data!.month
                    )} ${response!.data!.year}`
                );
            } else {
                //TODO: Redirect to notes? Show some message?
            }
        });
    }, [viewMode, selectedNoteLine.reloadHack]);

    const noteLineFormModalRef = useRef<any>();

    return (
        <div>
            <NoteLineFormModal ref={noteLineFormModalRef}></NoteLineFormModal>
            <Space direction="vertical" size={25} style={{ width: '100%' }}>
                <NoteDetailsHeader titleText={titleText}></NoteDetailsHeader>
                <CreateNoteLineButton
                    onClick={() => {
                        selectedNoteLine?.updateNoteLine(null);
                        noteLineFormModalRef.current?.showModal(
                            FormMode.Creation
                        );
                    }}
                    text="Ajouter un remboursement"
                ></CreateNoteLineButton>
                <NoteLineTable
                    noteLines={noteLines}
                    openModifyModal={(formMode: FormMode) => {
                        noteLineFormModalRef.current?.showModal(formMode);
                    }}
                ></NoteLineTable>
                {noteLines.length >= 10 && (
                    <CreateNoteLineButton
                        onClick={() => {
                            selectedNoteLine?.updateNoteLine(null);
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
