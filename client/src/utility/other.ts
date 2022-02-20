import { MissionState } from '../enums';
import { getFrenchMissionState } from './common';

export function getMissionStateFilter(): {
    value: string;
    text: string;
}[] {
    const missionFilters = [];
    for (const value in MissionState) {
        const temp = <MissionState>value;
        if (value) {
            missionFilters.push({
                value: temp,
                text: getFrenchMissionState(temp),
            });
        }
    }
    return missionFilters;
}
