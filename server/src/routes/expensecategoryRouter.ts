import express, { Response, NextFunction } from 'express';
import { AuthenticatedRequest, requireAuthToken } from '../utility/middlewares';
import expenseCategoryService from '../services/expenseCategoryService';
import { convertStringToObjectId } from '../utility/other';

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

expenseCategoryRouter.post(
    '/',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const expenseCategory =
                await expenseCategoryService.createExpenseCategory(
                    req.body.expenseCategory
                );
            res.json(expenseCategory);
        } catch (err) {
            next(err);
        }
    }
);

expenseCategoryRouter.patch(
    '/',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const expenseCategoryId = convertStringToObjectId(
                req.body.expenseCategoryId
            );
            const expenseCategory =
                await expenseCategoryService.updateExpenseCategory({
                    expenseCategoryId: expenseCategoryId,
                    expenseCategory: req.body.expenseCategory,
                });
            res.json(expenseCategory);
        } catch (err) {
            next(err);
        }
    }
);

expenseCategoryRouter.delete(
    '/',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const expenseCategoryId = convertStringToObjectId(
                req.params.expenseCategoryId
            );
            await expenseCategoryService.deleteExpenseCategory(
                expenseCategoryId
            );
            res.json({});
        } catch (err) {
            next(err);
        }
    }
);

export default expenseCategoryRouter;
