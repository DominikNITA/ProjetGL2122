import { Types } from 'mongoose';
import { IMission } from '../utility/types';
import { throwIfNullParameters } from '../utility/other';
import { MissionModel } from '../models/mission';
import { InvalidParameterValue } from '../utility/errors';

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
            newMission,
            'There is already a mission with the same name in that service'
        );
    }

    //Check mission dates
    if (!checkIfDatesAreValid(newMission)) {
        throw new InvalidParameterValue(
            newMission,
            'Dates are invalid, mission start Date must be anterior or equal to mission end Date'
        );
    }

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
    //TODO : Check if mission infos are valid
    throwIfNullParameters([modifiedMission]);

    //Check mission name
    if (await checkIfMissionNameAlreadyExists(modifiedMission)) {
        throw new InvalidParameterValue(
            modifiedMission,
            'There is already a mission with the same name in that service'
        );
    }

    //Check mission dates
    if (!checkIfDatesAreValid(modifiedMission)) {
        throw new InvalidParameterValue(
            modifiedMission,
            'Dates are invalid, mission start Date must be anterior or equal to mission end Date'
        );
    }

    const updatedMission = await MissionModel.findByIdAndUpdate(missionId, {
        name: modifiedMission.name,
        description: modifiedMission.description,
        startDate: modifiedMission.startDate,
        endDate: modifiedMission.endDate,
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

async function checkIfMissionNameAlreadyExists(mission: IMission) {
    const missionList = await getMissionsByService(mission.service._id);

    missionList.forEach((missionInList) => {
        if (
            mission._id != missionInList?._id &&
            mission.name == missionInList?.name
        )
            return true;
    });

    return false;
}

function checkIfDatesAreValid(mission: IMission) {
    return mission.startDate <= mission.endDate ||
        mission.startDate.getTime() === mission.endDate.getTime()
        ? true
        : false;
}

export default {
    createMission,
    getMissionById,
    updateMission,
    getMissionsByService,
};
