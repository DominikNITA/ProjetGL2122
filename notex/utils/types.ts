import { Types } from "mongoose";

// Interface to defining our object of response functions
export interface ResponseFuncs {
    GET?: Function
    POST?: Function
    PUT?: Function
    DELETE?: Function
}

// Interface to define our Todo model on the frontend
export interface INote {
    _id?: number
    item: string
    completed: boolean
}

export interface IService {

}

export interface IUser {
    surname: string
    name: string
    email: string
    service?: Types.ObjectId
    notes: Types.DocumentArray<INote>
}