import express, { Response, NextFunction } from 'express';
import userService from '../services/userService';
import { AuthenticatedRequest, requireAuthToken } from '../utility/middlewares';
import { convertStringToObjectId } from '../utility/other';

const userRouter = express.Router();

// GET user
// PATH : user/:userId
userRouter.get(
    '/:userId',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = convertStringToObjectId(req.params.userId);

            res.json(await userService.getUserById(userId));
        } catch (err) {
            next(err);
        }
    }
);

export default userRouter;
