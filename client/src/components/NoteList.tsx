import { List, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { NoteState } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { INote } from '../types';
import { noteStateTag, getFrenchMonth } from '../utility/common';

type Props = {
    notes: INote[];
    buttonText: (noteState: NoteState) => JSX.Element;
    titleText: string;
    noNotesMessage?: string;
};

const NoteList = ({ notes, buttonText, titleText, noNotesMessage }: Props) => {
    const auth = useAuth();
    return (
        <>
            <h2 style={{ textAlign: 'center' }}>{titleText}</h2>
            {notes.length == 0 ? (
                <div style={{ textAlign: 'center' }}>
                    {noNotesMessage ??
                        "Vous n'avez pas de notes en constitution!"}
                </div>
            ) : (
                <List
                    size="default"
                    bordered
                    dataSource={notes}
                    pagination={{
                        pageSize: 5,
                        size: 'small',
                    }}
                    renderItem={(item) => (
                        <Row
                            justify="space-between"
                            className="note-list-item"
                            key={item._id}
                        >
                            <span className="note-list-item-info">
                                {getFrenchMonth(item.month)}
                                {'   '}
                                {item.year}
                                {item.owner.firstName &&
                                item.owner._id != auth?.user?._id
                                    ? ` - ${item.owner.firstName} ${item.owner.lastName}`
                                    : ''}
                            </span>
                            <span className="note-list-item-actions">
                                {item.state != NoteState.Validated &&
                                    noteStateTag(item.state)}
                                <Link to={`/notes/${item._id}`}>
                                    {buttonText(item.state)}
                                </Link>
                            </span>
                        </Row>
                    )}
                />
            )}
        </>
    );
};

export default NoteList;
