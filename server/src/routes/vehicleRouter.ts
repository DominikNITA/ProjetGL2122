import express, { Response, NextFunction } from 'express';
import vehicleService from '../services/vehicleService';
import { InvalidParameterValue } from '../utility/errors';
import { AuthenticatedRequest, requireAuthToken } from '../utility/middlewares';
import { convertStringToObjectId } from '../utility/other';

const vehicleRouter = express.Router();

vehicleRouter.get(
    '/',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = convertStringToObjectId(req.query.owner as string);
            const vehicles = await vehicleService.getVehiclesForOwner(userId);

            res.json(vehicles);
        } catch (err) {
            next(err);
        }
    }
);

vehicleRouter.get(
    '/:vehicleId',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const vehicleId = convertStringToObjectId(req.params.vehicleId);

            res.json(await vehicleService.getVehicleById(vehicleId));
        } catch (err) {
            next(err);
        }
    }
);

vehicleRouter.post(
    '/',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            if (req.body.vehicle.owner != req.user?._id) {
                throw new InvalidParameterValue(
                    'owner',
                    "L'utilisateur n'est pas correct"
                );
            }

            const vehicle = await vehicleService.createVehicle({
                vehicle: req.body.vehicle,
            });
            res.json(vehicle);
        } catch (err) {
            next(err);
        }
    }
);

export default vehicleRouter;
