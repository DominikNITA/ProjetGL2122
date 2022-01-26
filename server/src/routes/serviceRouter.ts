import express, { Response, NextFunction } from 'express';
import { MissionModel } from '../models/mission';
import missionService from '../services/missionService';
import serviceService from '../services/serviceService';
import { AuthenticatedRequest, requireAuthToken } from '../utility/middlewares';
import { convertStringToObjectId } from '../utility/other';

const serviceRouter = express.Router();

// GET service
// PATH : service/:serviceId
serviceRouter.get(
    '/:serviceId',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const serviceId = convertStringToObjectId(req.params.serviceId);

            res.json(await serviceService.getServiceById(serviceId));
        } catch (err) {
            next(err);
        }
    }
);

// POST service
// PATH : service
serviceRouter.post(
    '/',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const service = await serviceService.createService({
                name: req.body.name,
                leader: req.body.leader,
            });
            res.json(service);
        } catch (err) {
            next(err);
        }
    }
);

// GET service users
// PATH : service/:serviceId/users
serviceRouter.get(
    '/:serviceId/users',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const serviceId = convertStringToObjectId(req.params.serviceId);

            res.json(await serviceService.getCollaborants(serviceId));
        } catch (err) {
            next(err);
        }
    }
);

// GET service missions
// PATH : service/:serviceId/mission
serviceRouter.get(
    '/:serviceId/mission',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const serviceId = convertStringToObjectId(req.params.serviceId);

            res.json(await missionService.getMissionsByService(serviceId));
        } catch (err) {
            next(err);
        }
    }
);

// GET service mission by id
// PATH : service/mission/:missionId
serviceRouter.get(
    '/mission/:missionId',
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

// POST service mission
// PATH : service/:serviceId/mission
serviceRouter.post(
    '/:serviceId/mission',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const serviceId = convertStringToObjectId(req.params.serviceId);

            const missionToPost = req.body.mission;
            missionToPost.service = serviceId;

            const mission = await missionService.createMission(missionToPost);
            res.json(mission);
        } catch (err) {
            next(err);
        }
    }
);

// PUT service mission
// PATH : service/mission/:missionId
serviceRouter.put(
    '/mission/:missionId',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const missionId = convertStringToObjectId(req.params.missionId);
            const missionToPut = req.body.mission;

            const mission = await missionService.updateMission(
                missionId,
                missionToPut
            );
            res.json(mission);
        } catch (err) {
            next(err);
        }
    }
);

export default serviceRouter;
