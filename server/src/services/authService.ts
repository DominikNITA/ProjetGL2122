import { SHA256 } from 'crypto-js';
import { randomUUID } from 'crypto';
import { throwIfNullParameters } from '../utility/other';
import { IUser, UserRole } from '../utility/types';
import UserService, { UserReturn } from './userService';
import { ErrorResponse } from '../utility/errors';
import jwt from 'jsonwebtoken';

export type AuthUserReturn = (UserReturn & { roles: UserRole[] }) | null;

function hashPassword(password: string, salt: string): string {
    return SHA256(salt + password).toString();
}

function validatePassword(password: string) {
    if (!password) {
        throw new ErrorResponse(
            ErrorResponse.badRequestStatusCode,
            'Password not passed!'
        );
    }
    if (password.length < 5) {
        throw new ErrorResponse(
            ErrorResponse.badRequestStatusCode,
            'Password is too short'
        );
    }
    if (password.length > 64) {
        throw new ErrorResponse(
            ErrorResponse.badRequestStatusCode,
            'Password is too long'
        );
    }
}

function validateEmail(email: string) {
    if (
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            email
        )
    ) {
        throw new ErrorResponse(
            ErrorResponse.badRequestStatusCode,
            'Invalid email format'
        );
    }
}

async function loginUser(email: string, password: string) {
    const user = await verifyCredentials(email, password);
    const accessToken = await generateAccessToken(user?.id);

    return {
        accessToken: accessToken,
        user: user,
    };
}

async function verifyCredentials(
    email: string,
    password: string
): Promise<AuthUserReturn> {
    if (email == null || password == null) {
        throw new ErrorResponse(
            ErrorResponse.badRequestStatusCode,
            'Password or email not passed!'
        );
    }
    const user = await UserService.populateService(
        UserService.getUserByEmail(email)
    );
    console.log(user);
    if (user == null) {
        throw new ErrorResponse(
            ErrorResponse.badRequestStatusCode,
            'Password or email not valid!'
        );
    }

    const hashedPassword = hashPassword(password, user.authData!.salt);

    if (hashedPassword == null) {
        throw new ErrorResponse(
            ErrorResponse.internalServerError,
            'Password not found! Contact administrator for help'
        );
    }

    if (hashedPassword != user.authData!.passwordHash) {
        throw new ErrorResponse(
            ErrorResponse.badRequestStatusCode,
            'Password or email not valid!'
        );
    }

    return user;
}

async function generateAccessToken(userId: string) {
    //console.log('signing jwt', userId, process.env.ACCESS_TOKEN_SECRET);
    console.log('secret', process.env);
    const token = jwt.sign(
        { userId: userId },
        process.env.ACCESS_TOKEN_SECRET!
    );
    console.log(token);
    return token;
}

interface IRegisterUserInput {
    email: IUser['email'];
    firstName: IUser['firstName'];
    lastName: IUser['lastName'];
    service: IUser['service'];
}

async function registerUser(user: IRegisterUserInput, password: string) {
    throwIfNullParameters([user, password]);

    validatePassword(password);
    validateEmail(user.email);

    //Check if email is available
    if ((await UserService.getUserByEmail(user.email)) !== null) {
        throw new ErrorResponse(
            ErrorResponse.badRequestStatusCode,
            'Email already taken!'
        );
    }

    const salt = randomUUID();
    const hashedPassword = hashPassword(password, salt);
    const authData = { salt: salt, passwordHash: hashedPassword.toString() };
    const newUser = await UserService.addNewUser({
        ...user,
        authData: authData,
        roles: [UserRole.COLLABORATOR],
    });
    return newUser;
}

// async function getRoles(user: UserReturn): Promise<UserRole[]> {
//     // const roles: UserRole[] = [];
//     // // const serviceLeader = await getLeader();
//     // // console.log(
//     // //     `leader: ${serviceLeader}, user: ${user}, equal? ${
//     // //         serviceLeader._id.toString() == user?._id
//     // //     }`
//     // // );
//     // const serviceLeader = (user?.service as IService)
//     //     .leader as unknown as IUser & { _id: Types.ObjectId };
//     // if (serviceLeader._id.toString() == user?._id) {
//     //     roles.push(UserRole.LEADER);
//     //     const service = user?.service as IService;
//     //     if (service?.name === 'Compta') {
//     //         roles.push(UserRole.FINANCELEADER);
//     //     }
//     // } else if (user?.email === 'boss@pops.com') {
//     //     roles.push(UserRole.DIRECTOR);
//     // }
//     // roles.push(UserRole.COLLABORATOR);
//     // return roles;
// }

//Not in the current scope of the project
// export async function changePassword(password: string, userId: string) {
//     validatePassword(password);
//     throw new NotImplementedError();
//     return generateAccessToken(userId);
// }

// export async function demandPasswordRecovery(email: string) {
//     //Validate email
//     if (!email)
//         throw new ErrorResponse(
//             ErrorResponse.badRequestStatusCode,
//             'Email not passed'
//         );
//     validateEmail(email);

//     //Check email existence
//     const user = await UserService.getUserByEmail(email);
//     if (!user) return;

//     //Create secret key
//     // const recoveryToken = jwt.sign(
//     //     { userId: user.id },
//     //     process.env.RECOVERY_PASSWORD_SECRET!,
//     //     {
//     //         expiresIn: '1h',
//     //     }
//     // );

//     //TODO: Send recovery token via email
// }

// export async function recoverPassword(recoveryToken: string, password: string) {
//     jwt.verify(
//         recoveryToken,
//         process.env.RECOVERY_PASSWORD_SECRET!,
//         async (err, decodedToken: any) => {
//             if (err)
//                 throw new ErrorResponse(
//                     ErrorResponse.forbiddenStatusCode,
//                     'Problem with token: ' + err.message
//                 );

//             const user = await UserService.getUserById(decodedToken.userId);
//             if (user == null)
//                 throw new ErrorResponse(
//                     ErrorResponse.badRequestStatusCode,
//                     'Token signed for not existing user'
//                 );

//             changePassword(password, user.id);
//             //TODO: make recoverytokens only one time use
//         }
//     );
// }

export default {
    registerUser,
    loginUser,
    // getRoles,
};
