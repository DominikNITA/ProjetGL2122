import React, { useEffect, useState } from 'react';
import { login } from '../clients/authClient';
import { INoteLine, IUser } from '../types';

interface ISelectedNoteLineProvider {
    noteLine: INoteLine | null;
    updateNoteLine: (noteLine: INoteLine) => void;
    reloadHack: boolean;
    reload: () => void;
}

const SelectedNoteLineContext = React.createContext<ISelectedNoteLineProvider>(
    undefined!
);

export function useSelectedNoteLine() {
    return React.useContext(SelectedNoteLineContext);
}

export function SelectedNoteLineProvider({ children }: any) {
    const [noteLine, setNoteLine] = useState<INoteLine | null>(null);
    const [reloadHack, setReloadHack] = useState(false);

    const updateNoteLine = (noteLine: INoteLine) => {
        console.log('In update noteline: ', noteLine);

        setNoteLine(noteLine);
    };

    const reload = () => {
        setReloadHack(!reloadHack);
    };

    const value = { noteLine, updateNoteLine, reloadHack, reload };

    return (
        <SelectedNoteLineContext.Provider value={value}>
            {children}
        </SelectedNoteLineContext.Provider>
    );
}
