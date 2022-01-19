import { Document } from 'mongoose';
import {
    Month,
    NoteLineState,
    NoteState,
    UserRole,
} from '../../../shared/enums';

export interface ResponseFuncs {
    GET?: Function;
    POST?: Function;
    PUT?: Function;
    DELETE?: Function;
}

// Model types
export interface INote extends Document {
    state: NoteState;
    owner: IUser['_id'];
    noteLines: [INoteLine['_id']];
    month: Month;
    year: Number;
}

export interface INoteLine extends Document {
    description: string;
    mission: IMission['_id'];
    ttc: number;
    tva: number;
    ht: number;
    note: INote['_id'];
    state: NoteLineState;
    date: Date;
    justificatif: string;
}

export interface IService extends Document {
    name: string;
    leader?: IUser['_id'];
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    service: IService['_id'];
    authData?: IAuthData['_id'];
    roles: UserRole[];
}

export interface IAuthData extends Document {
    passwordHash: string;
    salt: string;
}
export interface IMission extends Document {
    name: string;
    description: string;
    service: IService['_id'];
    startDate: Date;
    endDate: Date;
}

export interface SetupDbBody extends Document {
    doClearDB: boolean;
    doInsertTestData: boolean;
}
