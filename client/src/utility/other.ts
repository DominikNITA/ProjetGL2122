import { MissionState, Month } from '../enums';
import { getFrenchMissionState, getFrenchMonth } from './common';

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

export function getMonthFilter(): {
    value: string | number;
    text: string;
}[] {
    const missionFilters = [];
    for (const value in Month) {
        if (isNaN(Number(value))) {
            continue;
        }
        const temp = Number(value);
        if (value) {
            missionFilters.push({
                value: temp,
                text: getFrenchMonth(temp),
            });
        }
    }
    return missionFilters;
}

export function remove_duplicates_es6(arr: any[]) {
    const s = new Set(arr);
    const it = s.values();
    return Array.from(it);
}
