import React, { useEffect, useState } from 'react';
import { login } from '../clients/authClient';
import { INote, INoteLine, IUser } from '../types';

interface INoteDetailsManagerProvider {
    noteLine: Partial<INoteLine> | null;
    updateNoteLine: (noteLine: Partial<INoteLine> | null) => void;
    reloadHack: boolean;
    reload: () => void;
    currentNote: INote | null;
    updateCurrentNote: (note: INote | null) => void;
}

const NoteDetailsManagerContext =
    React.createContext<INoteDetailsManagerProvider>(undefined!);

export function useNoteDetailsManager() {
    return React.useContext(NoteDetailsManagerContext);
}

export function NoteDetailsMangerProvider({ children }: any) {
    const [currentNote, setCurrentNote] = useState<INote | null>(null);
    const [currentNoteLine, setCurrentNoteLine] =
        useState<Partial<INoteLine> | null>(null);
    const [reloadHack, setReloadHack] = useState(false);

    const updateNoteLine = (noteLine: Partial<INoteLine> | null) => {
        setCurrentNoteLine(noteLine);
    };

    const updateCurrentNote = (note: INote | null) => {
        setCurrentNote(note);
    };

    const reload = () => {
        setReloadHack(!reloadHack);
    };

    const value = {
        noteLine: currentNoteLine,
        updateNoteLine,
        reloadHack,
        reload,
        currentNote,
        updateCurrentNote,
    };

    return (
        <NoteDetailsManagerContext.Provider value={value}>
            {children}
        </NoteDetailsManagerContext.Provider>
    );
}
