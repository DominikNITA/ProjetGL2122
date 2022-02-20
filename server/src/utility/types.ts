import { Document } from 'mongoose';
import {
    FraisType,
    MissionState,
    Month,
    NoteLineState,
    NoteState,
    UserRole,
    VehicleType,
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
    vehicle: IVehicle['_id'];
    comment: string;
}

export interface IVehicle extends Document {
    description: string;
    horsePower: number;
    type: VehicleType;
    isElectric: boolean;
    owner: IUser['_id'];
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
    state: MissionState;
}

export interface IVehicleMatrix extends Document {
    year: number;
    vehicleType: VehicleType;
    kilometerMilestones: number[];
    horsePowerMilestones: number[];
    data: number[][];
}

export interface SetupDbBody extends Document {
    doClearDB: boolean;
    doInsertTestData: boolean;
}
