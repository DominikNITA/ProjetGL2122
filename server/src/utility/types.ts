import { Document } from 'mongoose';

export interface ResponseFuncs {
    GET?: Function;
    POST?: Function;
    PUT?: Function;
    DELETE?: Function;
}

//Enums
export enum NoteState {
    CREATED = 'CREATED',
    INVALIDATION = 'INVALIDATION',
    FIXING = 'FIXING',
    VALIDATED = 'VALIDATED',
    COMPLETED = 'COMPLETED',
}

export enum UserRole {
    COLLABORATOR = 'COLLABORATOR',
    LEADER = 'LEADER',
    FINANCELEADER = 'FINANCELEADER',
    DIRECTOR = 'DIRECTOR',
}

// Model types
export interface INote extends Document {
    state: NoteState;
    owner: IUser['_id'];
}

export interface INoteLine extends Document {
    description: string;
    mission: IMission['_id'];
    amount: number;
    note: INote['_id'];
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
