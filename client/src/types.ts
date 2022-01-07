export interface ResponseFuncs {
    GET?: Function;
    POST?: Function;
    PUT?: Function;
    DELETE?: Function;
}

export interface IBaseModelInterface {
    _id: string;
}

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
export interface INote extends IBaseModelInterface {
    state: NoteState;
    owner: IUser;
    noteLines: INoteLine[];
}

export interface INoteLine extends IBaseModelInterface {
    description: string;
    mission: IMission;
    amount: number;
}

export interface IService extends IBaseModelInterface {
    name: string;
    leader?: IUser;
}

export interface IUser extends IBaseModelInterface {
    surname: string;
    name: string;
    email: string;
    service: IService;
    notes?: INote[];
    authData?: IAuthData;
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
