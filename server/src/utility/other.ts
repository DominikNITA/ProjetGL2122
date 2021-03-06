import { Types } from 'mongoose';
import { InvalidParameterValue } from './errors';

export function validateEmail(email: string): boolean {
    const regexp = new RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regexp.test(email);
}

export function throwIfNullParameters(parameters: any[]) {
    parameters.forEach((param) => {
        if (param == null) {
            throw new InvalidParameterValue(
                `Parametre ${param} ne peut pas etre nul!`
            );
        }
    });
}

export function throwIfNull(values: any[]) {
    values.forEach((value) => {
        if (value == null) {
            throw new InvalidParameterValue(
                `Value of ${value} cannot be null!`
            );
        }
    });
}

export function convertStringToObjectId(value: string) {
    return new Types.ObjectId(value);
}

export function isNullOrNaN(value: number | null | undefined) {
    return value == null || isNaN(value);
}

export function compareObjectIds(
    id1: Types.ObjectId | string,
    id2: Types.ObjectId | string
) {
    if (id1 == null || id2 == null) return false;
    return new Types.ObjectId(id1).equals(new Types.ObjectId(id2));
}

export function addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
}
