import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Divider, List, Row, Space, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    getNotesForUser,
    getNotesForUserWithState,
} from '../clients/noteClient';
import CreateNoteModal from '../components/CreateNoteModal';
import { NoteState } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { INote } from '../types';
import { getFrenchMonth, getFrenchNoteState, noteStateTag } from '../utility/common';

const NotesPage = () => {
    const [openNotes, setOpenNotes] = useState<INote[]>([]);
    const [archiveNotes, setArchiveNotes] = useState<INote[]>([]);
    const auth = useAuth();
    useEffect(() => {
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
            <h2 style={{ textAlign: 'center' }}>Mes notes:</h2>
            {openNotes.length == 0 ? (
                <div>User has no notes!</div>
            ) : (
                <Space direction="vertical" size={25} style={{ width: '100%' }}>
                    <Col span={12} offset={6}>
                        <List
                            size="large"
                            bordered
                            dataSource={openNotes}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        noteStateTag(item.state),
                                        <Link to={`/notes/${item._id}`}>
                                            Modifier
                                        </Link>,
                                    ]}
                                    onClick={() => console.log('See details')}
                                    key={item._id}
                                >
                                    {getFrenchMonth(item.month)}
                                    {'   '}
                                    {item.year}
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Row justify="center">
                        <Button
                            type="primary"
                            icon={<PlusCircleOutlined />}
                            onClick={() =>
                                createNoteModalRef.current?.showModal()
                            }
                        >
                            Ajouter une note
                        </Button>
                    </Row>
                </Space>
            )}
            <Divider></Divider>
            <h2 style={{ textAlign: 'center' }}>Archive des notes:</h2>
            {archiveNotes.length == 0 ? (
                <Col span={12} offset={6}>
                    User has no notes!
                </Col>
            ) : (
                <Space direction="vertical" size={25} style={{ width: '100%' }}>
                    <Col span={12} offset={6}>
                        <List
                            size="large"
                            bordered
                            dataSource={archiveNotes}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        noteStateTag(item.state),
                                        <Link to={`/notes/${item._id}`}>
                                            Visualiser
                                        </Link>,
                                    ]}
                                    onClick={() => console.log('See details')}
                                    key={item._id}
                                >
                                    {getFrenchMonth(item.month)}
                                    {'   '}
                                    {item.year}
                                </List.Item>
                            )}
                        />
                    </Col>
                </Space>
            )}
        </div>
    );
};

export default NotesPage;
