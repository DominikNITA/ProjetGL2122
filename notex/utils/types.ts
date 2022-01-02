import { Types } from "mongoose";
import { NextApiRequest } from "next";
import { NoteState } from "../models/note";

export interface ResponseFuncs {
    GET?: Function
    POST?: Function
    PUT?: Function
    DELETE?: Function
}

// Model types
export interface INote {
    state: NoteState
    owner: Types.ObjectId
    noteLines: INoteLine[]
}

export interface INoteLine {
    description: string,
    mission: Types.ObjectId
    amount: number
}

export interface IService {
    name: string,
    leader?: Types.ObjectId,
}

export interface IUser {
    surname: string
    name: string
    email: string
    service: Types.ObjectId
    notes?: Types.DocumentArray<INote>
    authData?: IAuthData
}

export interface IAuthData{
    passwordHash: string
    salt: string
}
export interface IMission{
    name: string
    description: string
    service: Types.ObjectId
}

// Request types
export interface PostUserCredentialsApiRequest extends NextApiRequest{
    body:{
        email: string
    }
}

export interface SetupDbBody {
    doClearDB: boolean,
    doInsertTestData: boolean
}