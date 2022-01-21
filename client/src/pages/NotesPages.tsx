import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, List, Row, Space, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNotesForUser } from '../clients/noteClient';
import CreateNoteModal from '../components/CreateNoteModal';
import { NoteState } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { INote } from '../types';
import { getFrenchMonth, getFrenchNoteState } from '../utility/common';

const NotesPage = () => {
    const [notes, setNotes] = useState<INote[]>([]);
    const auth = useAuth();
    useEffect(() => {
        getNotesForUser(auth?.user?._id).then((response) => {
            if (response.isOk) {
                setNotes(
                    response!.data!.sort(
                        (x) => -(x.year * 1000 + x.month.valueOf())
                    )
                );
            }
        });
    }, [auth]);

    function noteStateTag(state: NoteState) {
        const text = getFrenchNoteState(state);
        switch (state) {
            case NoteState.Created:
                return <Tag color="lime">{text}</Tag>;
            case NoteState.InValidation:
                return <Tag color="geekblue">{text}</Tag>;
            case NoteState.Fixing:
                return <Tag color="pink">{text}</Tag>;
            case NoteState.Validated:
                return <Tag color="gold">{text}</Tag>;
            case NoteState.Completed:
                return <Tag color="success">{text}</Tag>;
            default:
                return <Tag color="error">{text}</Tag>;
        }
    }

    const createNoteModalRef = useRef<any>();

    return (
        <div>
            <CreateNoteModal ref={createNoteModalRef}></CreateNoteModal>
            <h2 style={{ textAlign: 'center' }}>Mes notes:</h2>
            {notes.length == 0 ? (
                <div>User has no notes!</div>
            ) : (
                <Space direction="vertical" size={25} style={{ width: '100%' }}>
                    <Col span={12} offset={6}>
                        <List
                            size="large"
                            bordered
                            dataSource={notes}
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
        </div>
    );
};

export default NotesPage;
