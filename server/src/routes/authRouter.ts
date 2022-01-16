import express, { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService';
// import { AuthenticatedRequest, requireAuthToken } from '../utility/middlewares';
const authRouter = express.Router();

authRouter.post(
    '/login',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await AuthService.loginUser(
                req.body.email,
                req.body.password
            );
            res.json(user);
        } catch (err) {
            next(err);
        }
    }
);

authRouter.post('/register', async (req, res, next) => {
    try {
        const user = await AuthService.registerUser(
            req.body.user,
            req.body.password
        );
        res.json(user);
    } catch (err) {
        next(err);
    }
});

// authRouter.post(
//     '/changePassword',
//     requireAuthToken,
//     async (req: AuthenticatedRequest, res, next) => {
//         try {
//             const newAccessToken = changePassword(
//                 req.body.password,
//                 req.user?.id
//             );
//             res.json(newAccessToken);
//         } catch (err) {
//             next(err);
//         }
//     }
// );

// authRouter.post('/demandPasswordRecovery', async (req, res, next) => {
//     try {
//         await demandPasswordRecovery(req.body.email);
//         res.status(200).end();
//     } catch (err) {
//         next(err);
//     }
// });

// authRouter.post('/recoverPassword', async (req, res, next) => {
//     try {
//         await recoverPassword(req.body.recoverToken, req.body.password);
//         res.status(200).end();
//     } catch (err) {
//         next(err);
//     }
// });

export default authRouter;
