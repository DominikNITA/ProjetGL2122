import { Document, Types } from 'mongoose';
import { IService, IUser } from '../utility/types';
import { ServiceModel } from '../models/service';
import { UserModel } from '../models/user';
import { throwIfNullParameters } from '../utility/other';

export type ServiceReturn =
    | (Document<any, any, IService> & IService & { _id: Types.ObjectId })
    | null;

export async function createService(service: IService): Promise<ServiceReturn> {
    throwIfNullParameters([service]);

    const newService = new ServiceModel(service);
    await newService.save();
    return newService;
}

export async function getServiceById(serviceId: Types.ObjectId) {
    const service = await ServiceModel.findOne({ _id: serviceId });
    return service;
}

export async function setLeader(
    serviceId: Types.ObjectId,
    leaderId: Types.ObjectId
) {
    throwIfNullParameters([serviceId, leaderId]);

    const service = await getServiceById(serviceId);

    service!.leader = leaderId;
    service?.save();
    return service;
}

export async function getLeader(
    serviceId: Types.ObjectId | undefined
): Promise<Types.ObjectId & IUser> {
    throwIfNullParameters([serviceId]);
    const serviceWithLeader = await ServiceModel.findById(serviceId).populate<{
        leader: IUser;
    }>('leader');
    return serviceWithLeader.leader;
}

export async function getCollaborants(serviceId: Types.ObjectId) {
    throwIfNullParameters([serviceId]);
    const collaborants = await UserModel.find({ service: serviceId });
    return collaborants;
}
