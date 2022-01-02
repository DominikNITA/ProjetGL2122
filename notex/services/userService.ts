import { Model, Document, Types } from "mongoose"
import { UserModel } from "../models/user"
import { dbConnect } from "../utils/connection";
import { IUser } from "../utils/types"

export type UserReturn = (Document<any, any, IUser> & IUser & {_id: Types.ObjectId;}) | null;

export async function getUserByEmail(email: string) : Promise<UserReturn>{
    await dbConnect();
    const user = await UserModel.findOne({'email': email});
    return user;
}

export async function getUserById(id: string) : Promise<UserReturn>{
    await dbConnect();
    const user = await UserModel.findOne({'_id': id});
    return user;
}

export async function addNewUser(newUser: IUser) : Promise<UserReturn>{
    await dbConnect();
    if(await getUserByEmail(newUser.email) !== null){
        throw new Error(`User with email ${newUser.email} already exists!`);
    }

    const userDocToAdd = new UserModel(newUser);
    // console.log("email", userDocToAdd.email);
    await userDocToAdd.save();
    return userDocToAdd;
}