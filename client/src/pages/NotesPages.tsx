import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, List, Row, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNotesForUser } from '../clients/noteClient';
import { NoteState } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { INote } from '../types';
import { getFrenchMonth } from '../utility/common';

const NotesPage = () => {
    const [notes, setNotes] = useState<INote[]>([]);
    const auth = useAuth();
    useEffect(() => {
        getNotesForUser(auth!.user?._id).then((data) =>
            setNotes(data.sort((x) => -(x.year * 1000 + x.month.valueOf())))
        );
    }, [auth]);

    function noteStateTag(state: NoteState) {
        switch (state) {
            case NoteState.Created:
                return <Tag color="lime">En constitution</Tag>;

            default:
                return <Tag color="error">Unknown</Tag>;
        }
    }

    return (
        <div>
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
                        <Button type="primary" icon={<PlusCircleOutlined />}>
                            Ajouter une note
                        </Button>
                    </Row>
                </Space>
            )}
        </div>
    );
};

export default NotesPage;
