import express, { Request, Response, NextFunction } from 'express';
import DevService from '../services/devService';
const devRouter = express.Router();

devRouter.post(
    '/clearUploadFolder',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await DevService.clearUploadFolder();
            res.sendStatus(200).end();
        } catch (err) {
            next(err);
        }
    }
);

devRouter.post(
    '/clearDB',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await DevService.clearDB();
            res.sendStatus(200).end();
        } catch (err) {
            next(err);
        }
    }
);

devRouter.post('/initializeDB', async (req, res, next) => {
    try {
        await DevService.initializeDB();
        res.sendStatus(200).end();
    } catch (err) {
        next(err);
    }
});

export default devRouter;
