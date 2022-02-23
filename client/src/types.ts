import {
    AvanceState,
    Month,
    VehicleType,
    NoteLineState,
    NoteState,
    UserRole,
    MissionState,
    ExpenseType,
} from './enums';

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
    ttc?: number;
    tva?: number;
    ht?: number;
    date: moment.Moment;
    justificatif: string;
    expenseCategory: IExpenseCategory;
    kilometerCount: number;
    vehicle?: IVehicle;

    note: INote;
    state: NoteLineState;
    comment: string;
}

export interface IVehicle extends IBaseModelInterface {
    description: string;
    horsePower: number;
    type: VehicleType;
    isElectric: boolean;
    owner: IUser;
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
    startDate: moment.Moment;
    endDate: moment.Moment;
    state: MissionState;
}

export interface SetupDbBody {
    doClearDB: boolean;
    doInsertTestData: boolean;
}

export interface IAvance extends IBaseModelInterface {
    owner: IUser;
    description: string;
    mission: IMission;
    amount: number;
    noteLines: INoteLine[];
    state: AvanceState;
}

export interface IExpenseCategory extends IBaseModelInterface {
    name: string;
    expenseType: ExpenseType;
}
