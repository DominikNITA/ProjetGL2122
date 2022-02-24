import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Row, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { getNotesForUserWithState } from '../clients/noteClient';
import EditButton from '../components/Buttons/EditButton';
import ViewButton from '../components/Buttons/ViewButton';
import CreateNoteModal from '../components/CreateNoteModal';
import NoteList from '../components/NoteList';
import { NoteState } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { INote } from '../types';

const NotesPage = () => {
    const [openNotes, setOpenNotes] = useState<INote[]>([]);
    const [archiveNotes, setArchiveNotes] = useState<INote[]>([]);
    const auth = useAuth();
    useEffect(() => {
        if (auth?.user?._id == null) return;

        getNotesForUserWithState(auth!.user!._id, [
            NoteState.Created,
            NoteState.Fixing,
            NoteState.InValidation,
        ]).then((response) => {
            if (response.isOk) {
                setOpenNotes(
                    response!.data!.sort(
                        (x) => -(x.year * 1000 + x.month.valueOf())
                    )
                );
            }
        });
        getNotesForUserWithState(
            auth!.user!._id,
            [NoteState.Validated, NoteState.Completed],
            10,
            1
        ).then((response) => {
            if (response.isOk) {
                setArchiveNotes(
                    response!.data!.sort(
                        (x) => -(x.year * 1000 + x.month.valueOf())
                    )
                );
            }
        });
    }, [auth]);

    const createNoteModalRef = useRef<any>();

    return (
        <div>
            <CreateNoteModal ref={createNoteModalRef}></CreateNoteModal>

            <Space direction="vertical" size={25} style={{ width: '100%' }}>
                <Col span={12} offset={6}>
                    <NoteList
                        notes={openNotes}
                        buttonText={(noteState) => {
                            switch (noteState) {
                                case NoteState.Created:
                                case NoteState.Fixing:
                                    return <EditButton></EditButton>;
                                case NoteState.InValidation:
                                    return <ViewButton></ViewButton>;
                                default:
                                    return <>'Erreur'</>;
                            }
                        }}
                        titleText="Mes notes:"
                    ></NoteList>
                </Col>
                <Row justify="center">
                    <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        onClick={() => createNoteModalRef.current?.showModal()}
                    >
                        Ajouter une note
                    </Button>
                </Row>
            </Space>

            <Divider></Divider>
            <Space direction="vertical" size={25} style={{ width: '100%' }}>
                <Col span={12} offset={6}>
                    <NoteList
                        notes={archiveNotes}
                        buttonText={() => <ViewButton></ViewButton>}
                        titleText="Archive de notes:"
                    ></NoteList>
                </Col>
            </Space>
        </div>
    );
};

export default NotesPage;
