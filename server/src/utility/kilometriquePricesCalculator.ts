import { Types } from 'mongoose';
import { FraisType, NoteLineState, VehicleType } from '../../../shared/enums';
import { NoteLineModel } from '../models/note';
import vehicleService from '../services/vehicleService';
import { throwIfNull } from './other';
import { IVehicle } from './types';

export async function calculatePrice(
    vehicleId: Types.ObjectId,
    kilometerCount: number,
    date: Date
) {
    const vehicle = await vehicleService.getVehicleById(vehicleId);
    throwIfNull([vehicle]);
    const year = date.getFullYear();
    const noteLinesForGivenYear = await NoteLineModel.find({
        $and: [
            {
                date: {
                    $gte: new Date(year + ''),
                    $lte: new Date(year + 1 + ''),
                },
            },
            {
                fraisType: FraisType.Kilometrique,
            },
            {
                vehicle: vehicleId,
            },
            {
                state: NoteLineState.Validated,
            },
        ],
    });
    const totalKilometers = noteLinesForGivenYear.reduce(
        (p, c) => p + c.kilometerCount,
        0
    );

    switch (vehicle!.type) {
        case VehicleType.Car:
            return calculateCarPrice(vehicle!, kilometerCount, totalKilometers);
        case VehicleType.Motorcycle:
            return 'Moto';
        case VehicleType.Scooter:
            return 'Scooter';
    }
}

function calculateCarPrice(
    car: IVehicle,
    kilometerCount: number,
    lastKilometerCount: number
) {
    const FIRST_MILESTONE = 5000;
    const SECOND_MILESTONE = 20000;

    const POWER_INDEX = getPowerIndex(car);

    let strefaB = 0;
    let strefaC = 0;
    let strefaA = 0;

    strefaA = FIRST_MILESTONE - lastKilometerCount;
    strefaA = strefaA < 0 ? 0 : strefaA;

    if (strefaA < kilometerCount) {
        strefaB = SECOND_MILESTONE - lastKilometerCount - strefaA;
        strefaB = strefaB < 0 ? 0 : strefaB;

        if (strefaB + strefaA > kilometerCount) {
            strefaB = kilometerCount - strefaA;
        } else {
            strefaC = kilometerCount - strefaB - strefaA;
        }
    } else {
        strefaA = kilometerCount;
    }

    return (
        carMatrix[POWER_INDEX][0](strefaA) +
        carMatrix[POWER_INDEX][1](strefaB) +
        carMatrix[POWER_INDEX][2](strefaC)
    );
}

const carMatrix: ((kilometers: number) => number)[][] = [
    [multiplyRule(0.456), multiplyRule(0.273), multiplyRule(0.318)],
    [multiplyRule(0.523), multiplyRule(0.294), multiplyRule(0.352)],
    [multiplyRule(0.548), multiplyRule(0.308), multiplyRule(0.368)],
    [multiplyRule(0.574), multiplyRule(0.323), multiplyRule(0.386)],
    [multiplyRule(0.601), multiplyRule(0.34), multiplyRule(0.405)],
];

function multiplyRule(coefficient: number) {
    return (kilometers: number) => coefficient * kilometers;
}

function getPowerIndex(vehicle: IVehicle) {
    const CV = vehicle.horsePower;
    switch (vehicle!.type) {
        case VehicleType.Car:
            if (CV <= 3) {
                return 0;
            }
            if (CV == 4) {
                return 1;
            }
            if (CV == 5) {
                return 2;
            }
            if (CV == 6) {
                return 3;
            }
            return 4;
        case VehicleType.Motorcycle:
            if (CV <= 2) {
                return 0;
            }
            if (CV <= 5) {
                return 1;
            }
            return 2;
        case VehicleType.Scooter:
            return 0;
    }
}
