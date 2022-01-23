import express, { Response, NextFunction } from 'express';
import { UserRole } from '../../../shared/enums';
import missionService from '../services/missionService';
import noteLineService from '../services/noteLineService';
import noteService from '../services/noteService';
import serviceService from '../services/serviceService';
import { UserReturn } from '../services/userService';
import { ErrorResponse } from '../utility/errors';
import { AuthenticatedRequest, requireAuthToken } from '../utility/middlewares';
import { convertStringToObjectId } from '../utility/other';
import { INote } from '../utility/types';

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
