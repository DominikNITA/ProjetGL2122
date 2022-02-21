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
            throw new InvalidParameterValue(param, 'Param cannot be null!');
        }
    });
}

export function throwIfNull(values: any[]) {
    values.forEach((value) => {
        if (value == null) {
            throw new InvalidParameterValue(value, 'Value cannot be null!');
        }
    });
}

export function convertStringToObjectId(value: string) {
    return new Types.ObjectId(value);
}

export function isNullOrNaN(value: number | null) {
    return value == null || isNaN(value);
}
