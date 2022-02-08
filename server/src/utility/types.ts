import { Document } from 'mongoose';
import {
    FraisType,
    Month,
    AvanceState,
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
    month: Month;
    year: Number;
}

export interface INoteLine extends Document {
    fraisType: FraisType;
    description: string;
    mission: IMission['_id'];
    note: INote['_id'];
    state: NoteLineState;
    date: Date;
    justificatif: string;
    ttc: number;
    tva: number;
    ht: number;
    kilometerCount: number;
    vehicule: IVehicule['_id'];
}

export interface IVehicule extends Document {
    name: string;
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

export interface IAvance extends Document {
    owner: IUser['_id'];
    description: string;
    mission: IMission['_id'];
    amount: number;
    noteLines: [INoteLine['_id']];
    state: AvanceState;
}

export interface SetupDbBody extends Document {
    doClearDB: boolean;
    doInsertTestData: boolean;
}
