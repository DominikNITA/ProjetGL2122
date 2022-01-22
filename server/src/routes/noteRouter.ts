import express, { Response, NextFunction } from 'express';
import { UserRole } from '../../../shared/enums';
import noteLineService from '../services/noteLineService';
import noteService from '../services/noteService';
import serviceService from '../services/serviceService';
import { UserReturn } from '../services/userService';
import { ErrorResponse } from '../utility/errors';
import { AuthenticatedRequest, requireAuthToken } from '../utility/middlewares';
import { convertStringToObjectId } from '../utility/other';
import { INote } from '../utility/types';
const noteRouter = express.Router();

async function checkUserViewNote(user: UserReturn, note: INote | null) {
    //Check user
    if (note?.owner.toString() == user?._id) return;

    const service = await serviceService.getLeader(user?.service);
    if (service?.leader?.toString() == user?._id) return;

    if (
        user?.roles.includes(UserRole.Director) ||
        user?.roles.includes(UserRole.FinanceLeader)
    )
        return;

    throw new ErrorResponse(ErrorResponse.unauthorizedStatusCode);
}

noteRouter.get(
    '/:noteId',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const noteId = convertStringToObjectId(req.params.noteId);
            const note = await noteService.getNoteById(noteId);
            const noteLines = await noteLineService.getNoteLinesForNote(noteId);
            await checkUserViewNote(req.user!, note);
            res.json({ ...note?.toObject(), noteLines: noteLines });
        } catch (err) {
            next(err);
        }
    }
);

noteRouter.post(
    '/line',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const noteId = convertStringToObjectId(req.body.noteId);
            const noteLine = await noteLineService.createNoteLine({
                noteLine: req.body.noteLine,
                noteId: noteId,
            });
            res.json(noteLine);
        } catch (err) {
            next(err);
        }
    }
);

noteRouter.patch(
    '/line',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const noteLineId = convertStringToObjectId(req.body.noteLineId);
            const noteLine = await noteLineService.updateNoteLine({
                noteLineId: noteLineId,
                noteLine: req.body.noteLine,
            });
            res.json(noteLine);
        } catch (err) {
            next(err);
        }
    }
);

noteRouter.get(
    '/',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = convertStringToObjectId(req.query.owner as string);
            const notes = await noteService.getUserNotes(userId);
            if (notes.length > 0) {
                await checkUserViewNote(req.user!, notes[0]);
            }

            res.json(notes);
        } catch (err) {
            next(err);
        }
    }
);

noteRouter.post(
    '/',
    requireAuthToken,
    async (req: AuthenticatedRequest, res, next) => {
        try {
            if (req.user?._id.toString() !== req.body.note.owner) {
                throw new ErrorResponse(ErrorResponse.unauthorizedStatusCode);
            }
            const note = await noteService.createNote(req.body.note);
            res.json(note);
        } catch (err) {
            next(err);
        }
    }
);

noteRouter.post(
    '/state',
    requireAuthToken,
    async (req: AuthenticatedRequest, res, next) => {
        try {
            //TODO: Check who can change to which state
            const note = await noteService.changeState(
                req.body.note,
                req.body.state
            );
            res.json(note);
        } catch (err) {
            next(err);
        }
    }
);

export default noteRouter;
