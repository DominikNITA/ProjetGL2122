import { SHA256 } from 'crypto-js';
import { randomUUID } from 'crypto';
import { throwIfNullParameters } from '../utility/other';
import { IUser } from '../utility/types';
import UserService, { UserReturn } from './userService';
import { ErrorResponse } from '../utility/errors';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../../shared/enums';

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
    console.log('Created token: ', accessToken);

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
    const token = jwt.sign(
        { userId: userId },
        process.env.ACCESS_TOKEN_SECRET!
    );
    return token;
}

interface IRegisterUserInput {
    email: IUser['email'];
    firstName: IUser['firstName'];
    lastName: IUser['lastName'];
    service?: IUser['service'];
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
        roles: [UserRole.Collaborator],
    });
    return newUser;
}

export default {
    registerUser,
    loginUser,
};
