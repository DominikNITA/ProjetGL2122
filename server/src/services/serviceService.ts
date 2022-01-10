import { Document, Types } from 'mongoose';
import { IService, UserRole } from '../utility/types';
import { ServiceModel } from '../models/service';
import { UserModel } from '../models/user';
import { throwIfNullParameters } from '../utility/other';
import UserService from './userService';

export type ServiceReturn =
    | (Document<any, any, IService> & IService & { _id: Types.ObjectId })
    | null;

interface ICreateServiceInput {
    name: IService['name'];
    leader?: IService['leader'];
}

export async function createService(
    service: ICreateServiceInput
): Promise<ServiceReturn> {
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

    //TODO: Ajouter les cas pour le service comptabilite

    const service = await getServiceById(serviceId);
    const oldLeader = await UserService.getUserById(service?.leader);
    if (oldLeader !== null) {
        oldLeader!.roles = [UserRole.COLLABORATOR];
        oldLeader?.save();
    }

    service!.leader = leaderId;
    service?.save();

    const newLeader = await UserService.getUserById(leaderId.toString());
    newLeader!.roles.push(UserRole.LEADER);
    newLeader?.save();
    return service;
}

export async function getLeader(serviceId: Types.ObjectId | undefined) {
    throwIfNullParameters([serviceId]);
    const serviceWithLeader = await ServiceModel.findById(serviceId);
    return serviceWithLeader?.leader;
}

export async function getCollaborants(serviceId: Types.ObjectId) {
    throwIfNullParameters([serviceId]);
    const collaborants = await UserModel.find({ service: serviceId });
    return collaborants;
}
