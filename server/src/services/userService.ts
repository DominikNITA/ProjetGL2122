import { Document, Types } from 'mongoose';
import { IUser } from '../utility/types';
import { ServiceModel } from '../models/service';
import { UserModel } from '../models/user';

export type UserReturn =
    | (Document<any, any, IUser> & IUser & { _id: Types.ObjectId })
    | null;

export async function getUserByEmail(email: string): Promise<UserReturn> {
    const user = await UserModel.findOne({ email: email });
    return user;
}

export async function getUserById(id: string): Promise<UserReturn> {
    const user = await UserModel.findOne({ _id: id });
    return user;
}

export async function addNewUser(newUser: IUser): Promise<UserReturn> {
    if ((await getUserByEmail(newUser.email)) !== null) {
        throw new Error(`User with email ${newUser.email} already exists!`);
    }

    const userDocToAdd = new UserModel(newUser);
    // console.log("email", userDocToAdd.email);
    await userDocToAdd.save();
    return userDocToAdd;
}

export async function isAnyServiceLeader(userId: Types.ObjectId) {
    const services = await ServiceModel.find({ leader: userId });
    return services.length > 0;
}
