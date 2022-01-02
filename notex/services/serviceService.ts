import { Document, Types } from "mongoose";
import { ServiceModel } from "../models/service";
import { UserModel } from "../models/user";
import { dbConnect } from "../utils/connection";
import { throwIfNullParameters } from "../utils/other";
import { IService, IUser } from "../utils/types";

export type ServiceReturn = (Document<any, any, IService> & IService & {_id: Types.ObjectId;}) | null;

export async function createService(service : IService) : Promise<ServiceReturn> {
    throwIfNullParameters([service])
    await dbConnect();
    
    const newService = new ServiceModel(service);
    await newService.save();
    return newService;
}

export async function getServiceById(serviceId : Types.ObjectId){
    await dbConnect();
    const service = await ServiceModel.findOne({'_id': serviceId});
    return service;
}

export async function setLeader(serviceId : Types.ObjectId, leaderId: Types.ObjectId){
    throwIfNullParameters([serviceId, leaderId]);

    const service = await getServiceById(serviceId);
    
    service!.leader = leaderId;
    service?.save();
    return service;
}

export async function getCollaborants(serviceId : Types.ObjectId){
    throwIfNullParameters([serviceId]);
    const collaborants = await UserModel.find({service: serviceId});
    return collaborants
}