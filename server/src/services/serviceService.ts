import { Document, Types } from 'mongoose';
import { IService } from '../utility/types';
import { ServiceModel } from '../models/service';
import { UserModel } from '../models/user';
import { compareObjectIds, throwIfNullParameters } from '../utility/other';
import UserService from './userService';
import { InvalidParameterValue } from '../utility/errors';
import { UserRole } from '../../../shared/enums';

export type ServiceReturn =
    | (Document<any, any, IService> & IService & { _id: Types.ObjectId })
    | null;

interface ICreateServiceInput {
    name: IService['name'];
    leader?: IService['leader'];
}

async function createService(
    service: ICreateServiceInput
): Promise<ServiceReturn> {
    throwIfNullParameters([service]);

    const newService = new ServiceModel(service);
    await newService.save();
    return newService;
}

async function getServiceById(serviceId: Types.ObjectId) {
    const service = await ServiceModel.findOne({ _id: serviceId });
    return service;
}

async function setLeader(serviceId: Types.ObjectId, leaderId: Types.ObjectId) {
    throwIfNullParameters([serviceId, leaderId]);

    //TODO: Ajouter les cas pour le service comptabilite

    const newLeader = await UserService.getUserById(leaderId);
    if (!compareObjectIds(newLeader?.service, serviceId)) {
        throw new InvalidParameterValue(
            serviceId,
            'User is not in the passed service'
        );
    }
    newLeader!.roles.push(UserRole.Leader);
    newLeader?.save();

    const service = await getServiceById(serviceId);
    const oldLeader = await UserService.getUserById(service?.leader);
    if (oldLeader !== null) {
        oldLeader!.roles = [UserRole.Collaborator];
        oldLeader?.save();
    }

    service!.leader = leaderId;
    service?.save();

    return service;
}

async function getLeader(serviceId: Types.ObjectId | undefined) {
    throwIfNullParameters([serviceId]);
    const serviceWithLeader = await ServiceModel.findById(serviceId);
    return serviceWithLeader?.leader;
}

async function getCollaborants(serviceId: Types.ObjectId) {
    throwIfNullParameters([serviceId]);
    const collaborants = await UserModel.find({ service: serviceId });
    return collaborants;
}

export default {
    createService,
    getServiceById,
    setLeader,
    getLeader,
    getCollaborants,
};
