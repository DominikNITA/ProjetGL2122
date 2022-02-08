import express, { Response, NextFunction } from 'express';
import avanceService from '../services/avanceService';
import { AuthenticatedRequest, requireAuthToken } from '../utility/middlewares';
import { convertStringToObjectId } from '../utility/other';

const avanceRouter = express.Router();

// GET avance
// PATH : avance/:avanceId
avanceRouter.get(
    '/:avanceId',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const avanceId = convertStringToObjectId(req.params.avanceId);

            res.json(await avanceService.getAvanceById(avanceId));
        } catch (err) {
            next(err);
        }
    }
);

// POST service
// PATH : service
avanceRouter.post(
    '/',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const service = await avanceService.createAvance({
                description: req.body.description,
                owner: req.body.owner,
                mission: req.body.mission,
                amount: req.body.amount,
            });
            res.json(service);
        } catch (err) {
            next(err);
        }
    }
);

// GET avance for user
// PATH :
avanceRouter.get(
    '/user/:userId/avance',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        return;
    }
);

export default avanceRouter;
