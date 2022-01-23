import express, { Response, NextFunction } from 'express';
import missionService from '../services/missionService';
import { AuthenticatedRequest, requireAuthToken } from '../utility/middlewares';
import { convertStringToObjectId } from '../utility/other';

const serviceRouter = express.Router();

serviceRouter.get(
    '/:serviceId/mission',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const serviceId = convertStringToObjectId(req.params.serviceId);
            console.log(serviceId);

            res.json(await missionService.getMissionsByService(serviceId));
        } catch (err) {
            next(err);
        }
    }
);

export default serviceRouter;
