import { Types } from "mongoose";
import { NoteState } from "../models/note";

// Interface to defining our object of response functions
export interface ResponseFuncs {
    GET?: Function
    POST?: Function
    PUT?: Function
    DELETE?: Function
}

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

}

export interface IUser {
    surname: string
    name: string
    email: string
    service?: Types.ObjectId
    notes?: Types.DocumentArray<INote>
    authData: IAuthData
}

export interface IAuthData{
    user: Types.ObjectId
    passwordHash: string
    salt: string
}