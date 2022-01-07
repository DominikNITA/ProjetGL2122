import { Types } from 'mongoose';

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
export interface INote {
    state: NoteState;
    owner: Types.ObjectId;
    noteLines: INoteLine[];
}

export interface INoteLine {
    description: string;
    mission: Types.ObjectId;
    amount: number;
}

export interface IService {
    name: string;
    leader?: Types.ObjectId;
}

export interface IUser {
    surname: string;
    name: string;
    email: string;
    service: Types.ObjectId;
    notes?: Types.DocumentArray<INote>;
    authData?: IAuthData;
}

export interface IAuthData {
    passwordHash: string;
    salt: string;
}
export interface IMission {
    name: string;
    description: string;
    service: Types.ObjectId;
    startDate: Date;
    endDate: Date;
}

export interface SetupDbBody {
    doClearDB: boolean;
    doInsertTestData: boolean;
}
