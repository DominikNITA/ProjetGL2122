import React, { useEffect, useState } from 'react';
import { login } from '../clients/authClient';
import { INote, INoteLine, IUser } from '../types';

interface ISelectedNoteLineProvider {
    noteLine: INoteLine | null;
    updateNoteLine: (noteLine: INoteLine | null) => void;
    reloadHack: boolean;
    reload: () => void;
    currentNote: INote | null;
    updateCurrentNote: (note: INote | null) => void;
}

const SelectedNoteLineContext = React.createContext<ISelectedNoteLineProvider>(
    undefined!
);

export function useSelectedNoteLine() {
    return React.useContext(SelectedNoteLineContext);
}

export function SelectedNoteLineProvider({ children }: any) {
    const [currentNote, setCurrentNote] = useState<INote | null>(null);
    const [noteLine, setNoteLine] = useState<INoteLine | null>(null);
    const [reloadHack, setReloadHack] = useState(false);

    const updateNoteLine = (noteLine: INoteLine | null) => {
        setNoteLine(noteLine);
    };

    const updateCurrentNote = (note: INote | null) => {
        setCurrentNote(note);
    };

    const reload = () => {
        setReloadHack(!reloadHack);
    };

    const value = {
        noteLine,
        updateNoteLine,
        reloadHack,
        reload,
        currentNote,
        updateCurrentNote,
    };

    return (
        <SelectedNoteLineContext.Provider value={value}>
            {children}
        </SelectedNoteLineContext.Provider>
    );
}
