import { useEffect, useState } from 'react';
import { getNotesForUser } from '../clients/noteClient';
import { useAuth } from '../stateProviders/authProvider';
import { INote } from '../types';

const NotesPage = () => {
    const [notes, setNotes] = useState<INote[]>([]);
    const auth = useAuth();
    useEffect(() => {
        async function fetchData() {
            const temp = await getNotesForUser(auth!.user!._id);
            setNotes(temp);
        }

        fetchData();
    }, []);

    return (
        <div>
            <h1>Notes</h1>
            {notes.length == 0 ? (
                <div>User has no notes!</div>
            ) : (
                notes.map((note) => (
                    <div>
                        {note.month}-{note.year}
                    </div>
                ))
            )}
        </div>
    );
};

export default NotesPage;
