import express, { Response, NextFunction } from 'express';
import avanceService from '../services/avanceService';
import { AvanceState, UserRole } from '../../../shared/enums';
import { AuthenticatedRequest, requireAuthToken } from '../utility/middlewares';
import { compareObjectIds, convertStringToObjectId } from '../utility/other';
import { AvanceModel } from '../models/avance';
import { IAvance } from '../utility/types';
import { UserReturn } from '../services/userService';
import serviceService from '../services/serviceService';
import { ErrorResponse } from '../utility/errors';

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
// PATH : avance/user/:userId/balance
avanceRouter.get(
    '/user/:userId/balance',
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
// PATH : avance/:avanceId/balance
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

            res.json(await avanceService.getNoteLines(avance!));
        } catch (err) {
            next(err);
        }
    }
);

// GET potential corrolated noteLines for avance
// PATH : avance/balance
avanceRouter.get(
    '/:avanceId/corrolatednotelines',
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
avanceRouter.put(
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

async function checkUserViewAvance(user: UserReturn, avance: IAvance | null) {
    //Check user
    if (compareObjectIds(avance?.owner, user?._id)) return;

    const leader = await serviceService.getLeader(user?.service);
    if (compareObjectIds(leader, user?._id)) return;

    if (
        user?.roles.includes(UserRole.Director) ||
        user?.roles.includes(UserRole.FinanceLeader)
    )
        return;

    throw new ErrorResponse(ErrorResponse.unauthorizedStatusCode);
}

// GET avances for subordinates users
// PATH : avance/subordinates/avances
avanceRouter.get(
    '/subordinates/avances',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = convertStringToObjectId(req.query.owner as string);
            let avances = null;

            const queryAvanceState = req.query.states as AvanceState[];

            if (queryAvanceState != null) {
                avances =
                    await avanceService.getSubordinateUsersAvancesWithState(
                        userId,
                        queryAvanceState
                    );
            } else {
                avances = await avanceService.getSubordinateUsersAvances(
                    userId
                );
            }

            if (avances.length > 0) {
                await checkUserViewAvance(req.user!, avances[0]);
            }

            res.json(avances);
        } catch (err) {
            next(err);
        }
    }
);

// PUT avance state
// PATH : avance/:avanceId/state
avanceRouter.put(
    '/:avanceId/state',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const avance = await avanceService.setAvanceState(
                convertStringToObjectId(req.params.avanceId),
                req.body.state
            );
            res.json(avance);
        } catch (err) {
            next(err);
        }
    }
);

export default avanceRouter;
