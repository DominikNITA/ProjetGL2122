import { Types } from 'mongoose';
import { ExpenseType, NoteLineState, VehicleType } from '../../../shared/enums';
import { NoteLineModel } from '../models/note';
import { VehicleMatrixModel } from '../models/vehicleMatrix';
import vehicleService from '../services/vehicleService';
import { throwIfNull } from './other';
import { IVehicle, IVehicleMatrix } from './types';

export async function calculatePrice(
    vehicleId: Types.ObjectId,
    kilometerCount: number,
    date: Date
) {
    const vehicle = await vehicleService.getVehicleById(vehicleId);
    throwIfNull([vehicle]);
    const year = date.getFullYear();
    const vehicleMatrix = await VehicleMatrixModel.findOne({
        year: year,
        vehicleType: vehicle?.type,
    });
    throwIfNull([vehicleMatrix]);
    const noteLinesForGivenYear = await NoteLineModel.find({
        $and: [
            {
                date: {
                    $gte: new Date(year + ''), // From January 1st 00:00 of given year
                    $lt: new Date(year + 1 + ''), //To 31 December 23:59 of same year
                },
            },
            {
                fraisType: ExpenseType.Kilometrique,
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
        (p, c) => p + c.kilometerCount!,
        0
    );

    switch (vehicle!.type) {
        case VehicleType.Car:
            return calculateCarPrice(
                vehicle!,
                kilometerCount,
                totalKilometers,
                vehicleMatrix!
            );
        case VehicleType.Motorcycle:
            return 'Moto';
        case VehicleType.Scooter:
            return 'Scooter';
    }
}

function calculateCarPrice(
    car: IVehicle,
    kilometersToCount: number,
    lastKilometerCount: number,
    vehicleMatrix: IVehicleMatrix
) {
    const POWER_INDEX = getPowerIndex(car, vehicleMatrix);

    let kilometersLeft = kilometersToCount;

    const multiplierForMilestone = [];

    for (
        let index = 0;
        index < vehicleMatrix.kilometerMilestones.length;
        index++
    ) {
        const kilometerMilestone = vehicleMatrix.kilometerMilestones[index];

        if (kilometerMilestone < lastKilometerCount) {
            multiplierForMilestone.push(0);
            continue;
        }

        const kilometersInThisMilestone =
            kilometerMilestone - kilometersLeft - lastKilometerCount < 0
                ? kilometersLeft +
                  (kilometerMilestone - kilometersLeft - lastKilometerCount)
                : kilometersLeft;

        multiplierForMilestone.push(kilometersInThisMilestone);
        kilometersLeft -= kilometersInThisMilestone;
    }
    let res = 0;
    multiplierForMilestone.forEach((m, i) => {
        res += vehicleMatrix.data[POWER_INDEX][i] * m;
    });
    if (kilometersLeft > 0) {
        res +=
            vehicleMatrix.data[POWER_INDEX][multiplierForMilestone.length] *
            kilometersLeft;
    }
    return res;
}

function getPowerIndex(vehicle: IVehicle, vehicleMatrix: IVehicleMatrix) {
    const CV = vehicle.horsePower;
    let res = 0;
    vehicleMatrix.horsePowerMilestones.forEach((hp, index) => {
        if (hp <= CV) res = index;
    });
    return res;
}
