import { Types } from 'mongoose';
import { IUser, IVehicle } from '../utility/types';
import { throwIfNullParameters } from '../utility/other';
import { VehicleType } from '../../../shared/enums';
import { VehicleModel } from '../models/vehicle';

export type VehicleReturn = (IVehicle & { _id: Types.ObjectId }) | null;

interface ICreateVehicleInput {
    vehicle: {
        description: string;
        horsePower: number;
        type: VehicleType;
        isElectric?: boolean;
        owner: IUser['_id'];
    };
}

async function createVehicle(
    input: ICreateVehicleInput
): Promise<VehicleReturn> {
    throwIfNullParameters([input, input.vehicle]);

    const newVehicle = new VehicleModel(input.vehicle);
    await newVehicle.save();

    return newVehicle;
}

interface IUpdateVehicleInput {
    vehicle: {
        _id: Types.ObjectId;
        description: string;
        horsePower: number;
        type: VehicleType;
        isElectric?: boolean;
        owner?: IUser['_id'];
    };
}
async function updateVehicle(
    input: IUpdateVehicleInput
): Promise<VehicleReturn> {
    throwIfNullParameters([input, input.vehicle]);

    await VehicleModel.findByIdAndUpdate(input.vehicle._id, input.vehicle);
    const newVehicle = await getVehicleById(input.vehicle._id);

    return newVehicle;
}

async function getVehicleById(vehicleId: Types.ObjectId) {
    return VehicleModel.findById(vehicleId);
}

async function getVehiclesForOwner(ownerId: Types.ObjectId) {
    return VehicleModel.find({ owner: ownerId });
}

async function deleteVehicle(vehicleId: Types.ObjectId) {
    VehicleModel.deleteOne({ _id: vehicleId });
}

export default {
    createVehicle,
    deleteVehicle,
    getVehicleById,
    getVehiclesForOwner,
    updateVehicle,
};
