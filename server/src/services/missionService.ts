import { Types } from 'mongoose';
import { IMission } from '../utility/types';
import { throwIfNullParameters } from '../utility/other';
import { MissionModel } from '../models/mission';
import { InvalidParameterValue } from '../utility/errors';
import { MissionState } from '../../../shared/enums';

export type MissionReturn = (IMission & { _id: Types.ObjectId }) | null;

interface ICreateMissionInput {
    name: IMission['name'];
    description: IMission['description'];
    service: IMission['service'];
    startDate: IMission['startDate'];
    endDate: IMission['endDate'];
}

//Create a new mission in DB and return it
async function createMission(
    mission: ICreateMissionInput
): Promise<MissionReturn> {
    throwIfNullParameters([mission]);

    const newMission = new MissionModel(mission);

    //Check mission name
    if (await checkIfMissionNameAlreadyExists(newMission)) {
        throw new InvalidParameterValue(
            'There is already a mission with the same name in that service'
        );
    }

    //Check mission dates
    if (!checkIfDatesAreValid(newMission)) {
        throw new InvalidParameterValue(
            'Dates are invalid, mission start Date must be anterior or equal to mission end Date'
        );
    }

    newMission.state = getStateForMission(newMission);

    await newMission.save();
    return newMission;
}

//Return mission selected by id
async function getMissionById(
    missionId: Types.ObjectId
): Promise<MissionReturn> {
    const mission = await MissionModel.findOne({ _id: missionId });
    return mission;
}

//Update mission by id and return it
async function updateMission(
    missionId: Types.ObjectId,
    modifiedMission: IMission
): Promise<MissionReturn> {
    throwIfNullParameters([modifiedMission]);

    //Check mission name
    if (await checkIfMissionNameAlreadyExists(modifiedMission, missionId)) {
        throw new InvalidParameterValue(
            'There is already a mission with the same name in that service'
        );
    }

    //Check mission dates
    if (!checkIfDatesAreValid(modifiedMission)) {
        throw new InvalidParameterValue(
            'Dates are invalid, mission start Date must be anterior or equal to mission end Date'
        );
    }

    const newState =
        modifiedMission.state == MissionState.Cancelled
            ? MissionState.Cancelled
            : getStateForMission(modifiedMission);

    const updatedMission = await MissionModel.findByIdAndUpdate(missionId, {
        name: modifiedMission.name,
        description: modifiedMission.description,
        startDate: modifiedMission.startDate,
        endDate: modifiedMission.endDate,
        state: newState,
    });
    return updatedMission;
}

//Return all missions for the wanted service
async function getMissionsByService(
    serviceId: Types.ObjectId
): Promise<MissionReturn[]> {
    const missionsList = await MissionModel.find({ service: serviceId });
    missionsList.sort();
    return missionsList;
}

async function checkIfMissionNameAlreadyExists(
    mission: IMission,
    missionId?: Types.ObjectId
) {
    const missionList = await getMissionsByService(mission.service);

    if (missionId != null) {
        return missionList.some(
            (missionInList) =>
                missionInList?.name == mission.name &&
                !missionInList?._id.equals(missionId)
        );
    } else {
        return missionList.some(
            (missionInList) => missionInList?.name == mission.name
        );
    }
}

function checkIfDatesAreValid(mission: IMission) {
    return mission.startDate <= mission.endDate;
}

function getStateForMission(mission: IMission) {
    const currentDate = new Date(Date.now());
    if (mission.startDate > currentDate) {
        return MissionState.NotStarted;
    }
    if (mission.endDate < currentDate) {
        return MissionState.Finished;
    }
    return MissionState.InProgress;
}

export default {
    createMission,
    getMissionById,
    updateMission,
    getMissionsByService,
};
