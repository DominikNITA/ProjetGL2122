import express, { Response, NextFunction } from 'express';
import avanceService from '../services/avanceService';
import { AvanceState } from '../../../shared/enums';
import { AuthenticatedRequest, requireAuthToken } from '../utility/middlewares';
import { convertStringToObjectId } from '../utility/other';
import { AvanceModel } from '../models/avance';

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

// POST avance
// PATH : avance
avanceRouter.post(
    '/',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const service = await avanceService.createAvance({
                description: req.body.avance.description,
                owner: req.body.avance.owner,
                mission: req.body.avance.mission,
                amount: req.body.avance.amount,
            });
            res.json(service);
        } catch (err) {
            next(err);
        }
    }
);

// DELETE avance
// PATH : avance/:avanceId
avanceRouter.delete(
    '/:avanceId',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const avanceId = convertStringToObjectId(req.params.avanceId);
            await avanceService.deleteAvance(avanceId);

            res.status(204);
        } catch (err) {
            next(err);
        }
    }
);

// GET all avance for user
// PATH : avance?params
avanceRouter.get(
    '/',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const userId = convertStringToObjectId(req.query.owner as string);
        const queryAvancesStates = req.query.states as AvanceState[];

        try {
            const avances = await avanceService.getUserAvancesWithState(
                userId,
                queryAvancesStates
            );
            res.json(avances);
        } catch (err) {
            next(err);
        }
    }
);

// GET avance balance for user
// PATH : avance/balance
avanceRouter.get(
    '/:userId/balance',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = convertStringToObjectId(req.params.userId);

            res.json(await avanceService.getUserBalance(userId));
        } catch (err) {
            next(err);
        }
    }
);

// GET avance balance for avance
// PATH : avance/balance
avanceRouter.get(
    '/:avanceId/balance',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const avanceId = convertStringToObjectId(req.params.avanceId);

            res.json(await avanceService.getAvanceBalance(avanceId));
        } catch (err) {
            next(err);
        }
    }
);

// GET potential corrolated noteLines for avance
// PATH : avance/balance
avanceRouter.get(
    '/:avanceId/notelines',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const avanceId = convertStringToObjectId(req.params.avanceId);

            const avance = await AvanceModel.findById(avanceId);

            res.json(await avanceService.getCorrelateNoteLines(avance!));
        } catch (err) {
            next(err);
        }
    }
);

// PUT avance noteLines
// PATH : avance/:avanceId/notelines
avanceRouter.post(
    '/:avanceId/notelines',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const avance = await avanceService.updateNoteLinesForAvance(
                convertStringToObjectId(req.params.avanceId),
                req.body.noteLines
            );
            res.json(avance);
        } catch (err) {
            next(err);
        }
    }
);

export default avanceRouter;
