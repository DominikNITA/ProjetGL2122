import express, { Response, NextFunction } from 'express';
import { AuthenticatedRequest, requireAuthToken } from '../utility/middlewares';
import expenseCategoryService from '../services/expenseCategoryService';

const expenseCategoryRouter = express.Router();

// GET expenseCategory
// PATH : expenseCategory/
expenseCategoryRouter.get(
    '/',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            res.json(await expenseCategoryService.getAllNotCancelled());
        } catch (err) {
            next(err);
        }
    }
);

export default expenseCategoryRouter;
