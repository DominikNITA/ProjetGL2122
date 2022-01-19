import { NoteLineState, NoteState, UserRole } from '../../shared/enums';
import { Month } from './enums';

export interface ResponseFuncs {
    GET?: Function;
    POST?: Function;
    PUT?: Function;
    DELETE?: Function;
}

export interface IBaseModelInterface {
    _id: string;
}

export class ApiResponse<Type> {
    message: string | null;
    isOk: boolean;
    data: Type | null;

    constructor(message: string | null, isOk: boolean, data: Type | null) {
        this.message = message;
        this.isOk = isOk;
        this.data = data;
    }

    static getOkResponse<Type>(data: Type): ApiResponse<Type> {
        return new ApiResponse<Type>(null, true, data);
    }

    static getErrorResponse<Type>(message: string): ApiResponse<Type> {
        return new ApiResponse<Type>(message, false, null);
    }
}

// Model types
export interface INote extends IBaseModelInterface {
    state: NoteState;
    owner: IUser;
    noteLines?: [INoteLine];
    month: Month;
    year: number;
}

export interface INoteLine extends IBaseModelInterface {
    description: string;
    mission: IMission;
    ttc: number;
    tva: number;
    ht: number;
    note: INote;
    state: NoteLineState;
    date: Date;
    justificatif: string;
}

export interface IService extends IBaseModelInterface {
    name: string;
    leader?: IUser;
}

export interface IUser extends IBaseModelInterface {
    firstName: string;
    lastName: string;
    email: string;
    service: IService;
    authData?: IAuthData;
    roles: UserRole[];
}

export interface IAuthData extends IBaseModelInterface {
    passwordHash: string;
    salt: string;
}
export interface IMission extends IBaseModelInterface {
    name: string;
    description: string;
    service: IService;
    startDate: Date;
    endDate: Date;
}

export interface SetupDbBody {
    doClearDB: boolean;
    doInsertTestData: boolean;
}
