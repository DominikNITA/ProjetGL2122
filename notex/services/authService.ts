import { Model, Document, Types } from "mongoose"
import { dbConnect } from "../utils/connection";
import { IAuthData, IUser } from "../utils/types";
import { InvalidParameterValue, NotImplementedError } from "../utils/errors";
import * as UserService from "./userService";
import { AuthDataModel } from "../models/authData";
import { throwIfNullParameters, validateEmail } from "../utils/other";
import { SHA256 } from "crypto-js";
import { randomUUID } from "crypto";


export async function authenticate(email: string, password: string): Promise<UserService.UserReturn> {
    if (!validateEmail(email)) {
        throw new InvalidParameterValue(email, "Email pattern does not match");
    }

    await dbConnect();
    const user = await UserService.getUserByEmail(email);
    if (user == null) {
        return null;
    }
    const authData = await getAuthDataForUser(user);
    if(authData?.passwordHash !== SHA256(authData!.salt + password).toString()){
        return null;
    }

    return user;
}

export async function getAuthDataForUser(user: UserService.UserReturn) {
    throwIfNullParameters([user]);
    return await AuthDataModel.findOne({ 'user': user!._id });
}

export async function createAuthUser(user: IUser, password: string) {
    throwIfNullParameters([user,password])
    // if (await UserService.getUserByEmail(user.email) !== null) {
    //     throw new Error();
    // }
    const salt = randomUUID();
    const hashedPassword = SHA256(salt + password);

    const newUser = await UserService.addNewUser(user);
    console.log("newUser", newUser?.id)
    const newAuthData = await addNewAuthData({user: newUser!._id, salt: salt, passwordHash: hashedPassword.toString()})
    console.log(`New user created: email-${newUser?.email}, id-${newUser?.id}, authId-${newAuthData.id}`)
}

async function addNewAuthData(authData : IAuthData ){
    const authDataToAdd = new AuthDataModel(authData);
    await authDataToAdd.save();
    return authDataToAdd;
}