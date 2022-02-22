import express, { NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import UserService, { UserReturn } from '../services/userService';
import { ErrorResponse } from './errors';

export interface AuthenticatedRequest extends express.Request {
    user?: UserReturn;
}

export interface AuthToken {
    user: UserReturn;
}

export async function requireAuthToken(
    req: AuthenticatedRequest,
    res: express.Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers['auth'];
        if (authHeader == null || authHeader.constructor.name === 'Array') {
            throw new ErrorResponse(
                ErrorResponse.forbiddenStatusCode,
                'Please provide auth token!'
            );
        }
        const token = authHeader; // && authHeader.split(' ')[1] //uncomment when using Bearer token
        if (token == null || token === '' || token === 'null') {
            throw new ErrorResponse(
                ErrorResponse.forbiddenStatusCode,
                'Please provide auth token!'
            );
        }
        let userFromToken;
        try {
            userFromToken = jwt.verify(
                token as string,
                process.env.ACCESS_TOKEN_SECRET!
            );
        } catch {
            throw new ErrorResponse(
                ErrorResponse.forbiddenStatusCode,
                'Problem with token'
            );
        }
        const user = await UserService.getUserById(
            (userFromToken as any).userId
        );
        if (user == null)
            throw new ErrorResponse(
                ErrorResponse.badRequestStatusCode,
                'Token signed for not existing user'
            );

        req.user = user;

        next();
    } catch (err) {
        next(err);
    }
}

const isoDateFormat =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

function isIsoDateString(value: any): boolean {
    return value && typeof value === 'string' && isoDateFormat.test(value);
}

function parseISO(value: string): Date {
    return new Date(value);
}

function handleDates(body: any) {
    if (body === null || body === undefined || typeof body !== 'object')
        return body;

    for (const key of Object.keys(body)) {
        const value = body[key];
        if (isIsoDateString(value)) body[key] = parseISO(value);
        else if (typeof value === 'object') handleDates(value);
    }
    return body;
}

export async function convertDates(
    req: express.Request,
    res: express.Response,
    next: NextFunction
) {
    try {
        req.body = handleDates(req.body);
        next();
    } catch (e) {
        next(e);
    }
}
