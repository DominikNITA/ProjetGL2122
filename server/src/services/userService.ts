import { Document, Types } from 'mongoose';
import { IUser } from '../utility/types';
import { ServiceModel } from '../models/service';
import { UserModel } from '../models/user';

export type UserReturn =
    | (Document<any, any, IUser> & IUser & { _id: Types.ObjectId })
    | null;

async function getUserByEmail(email: string) {
    const user = await UserModel.findOne({ email: email });
    return user;
}

async function getUserById(id: string): Promise<UserReturn> {
    const user = await UserModel.findOne({ _id: id });
    return user;
}

interface IAddNewUserInput {
    firstName: IUser['firstName'];
    lastName: IUser['lastName'];
    email: IUser['email'];
    service?: IUser['service'];
    authData?: IUser['authData'];
    roles?: IUser['roles'];
}

async function addNewUser(newUser: IAddNewUserInput): Promise<UserReturn> {
    if ((await getUserByEmail(newUser.email)) !== null) {
        throw new Error(`User with email ${newUser.email} already exists!`);
    }

    const userDocToAdd = new UserModel(newUser);
    await userDocToAdd.save();
    return userDocToAdd;
}

async function isAnyServiceLeader(userId: Types.ObjectId) {
    const services = await ServiceModel.find({ leader: userId });
    return services.length > 0;
}

export default { getUserByEmail, getUserById, addNewUser, isAnyServiceLeader };
