import express, { Response, NextFunction } from 'express';
import missionService from '../services/missionService';
import noteLineService from '../services/noteLineService';
import { AuthenticatedRequest, requireAuthToken } from '../utility/middlewares';
import { convertStringToObjectId } from '../utility/other';

const missionRouter = express.Router();

// GET mission
// PATH : mission/:missionId
missionRouter.get(
    '/:missionId',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const missionId = convertStringToObjectId(req.params.missionId);

            res.json(await missionService.getMissionById(missionId));
        } catch (err) {
            next(err);
        }
    }
);

missionRouter.get(
    '/:missionId/noteLines',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const missionId = convertStringToObjectId(req.params.missionId);

            res.json(await noteLineService.getNoteLinesForMission(missionId));
        } catch (err) {
            next(err);
        }
    }
);

missionRouter.delete(
    '/:missionId',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const missionId = convertStringToObjectId(req.params.missionId);
            await missionService.deleteMission(missionId);
            res.json();
        } catch (err) {
            next(err);
        }
    }
);

export default missionRouter;
