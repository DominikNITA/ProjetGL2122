import { Document } from 'mongoose';

export interface ResponseFuncs {
    GET?: Function;
    POST?: Function;
    PUT?: Function;
    DELETE?: Function;
}

//Enums
export enum NoteState {
    Created = 'Created',
    InValidation = 'InValidation',
    Fixing = 'Fixing',
    Validated = 'Validated',
    Completed = 'Completed',
}

export enum UserRole {
    Collaborator = 'Collaborator',
    Leader = 'Leader',
    FinanceLeader = 'FinanceLeader',
    Director = 'Director',
}

export enum NoteLineState {
    Created = 'Created',
    Fixing = 'Fixing',
    Validated = 'Validated',
}

export enum Month {
    January = 1,
    February = 2,
    March = 3,
    April = 4,
    May = 5,
    June = 6,
    July = 7,
    August = 8,
    September = 9,
    October = 10,
    November = 11,
    December = 12,
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
