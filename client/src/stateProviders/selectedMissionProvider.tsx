import React, { useState } from 'react';
import { IMission } from '../types';

interface ISelectedMissionProvider {
    mission: IMission | null;
    updateMission: (mission: IMission | null) => void;
    reloadHack: boolean;
    reload: () => void;
}

const SelectedMissionContext = React.createContext<ISelectedMissionProvider>(
    undefined!
);

export function useSelectedMission() {
    return React.useContext(SelectedMissionContext);
}

export function SelectedMissionProvider({ children }: any) {
    const [mission, setMission] = useState<IMission | null>(null);
    const [reloadHack, setReloadHack] = useState(false);

    const updateMission = (mission: IMission | null) => {
        setMission(mission);
    };

    const reload = () => {
        setReloadHack(!reloadHack);
    };

    const value = {
        mission,
        updateMission,
        reloadHack,
        reload,
    };

    return (
        <SelectedMissionContext.Provider value={value}>
            {children}
        </SelectedMissionContext.Provider>
    );
}
