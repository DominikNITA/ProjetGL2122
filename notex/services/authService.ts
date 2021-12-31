import { Model, Document, Types } from "mongoose"
import { UserModel } from "../models/user"
import { dbConnect } from "../utils/connection";
import { IUser } from "../utils/types"
import * as UserService from "./userService";

type UserReturn = (Document<any, any, IUser> & IUser & {_id: Types.ObjectId;}) | null;

export async function authenticate(email: string, password: string) : Promise<UserReturn>{
    await dbConnect();
    const user = await UserService.getUserByEmail(email);
    return user;
}

export async function createUser(user: IUser, password: string) {
    
}