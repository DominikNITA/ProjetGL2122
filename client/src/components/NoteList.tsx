import { List } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../stateProviders/authProvider';
import { INote } from '../types';
import { noteStateTag, getFrenchMonth } from '../utility/common';

type Props = {
    notes: INote[];
    buttonText: string;
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
                    size="large"
                    bordered
                    dataSource={notes}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                noteStateTag(item.state),
                                <Link to={`/notes/${item._id}`}>
                                    {buttonText}
                                </Link>,
                            ]}
                            onClick={() => console.log('See details')}
                            key={item._id}
                        >
                            {getFrenchMonth(item.month)}
                            {'   '}
                            {item.year}
                            {item.owner.firstName &&
                            item.owner._id != auth?.user?._id
                                ? ` - ${item.owner.firstName} ${item.owner.lastName}`
                                : ''}
                        </List.Item>
                    )}
                />
            )}
        </>
    );
};

export default NoteList;
