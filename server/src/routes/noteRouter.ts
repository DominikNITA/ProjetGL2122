import express, { Response, NextFunction } from 'express';
import noteService from '../services/noteService';
import serviceService from '../services/serviceService';
import { UserReturn } from '../services/userService';
import { ErrorResponse } from '../utility/errors';
import { AuthenticatedRequest, requireAuthToken } from '../utility/middlewares';
import { convertStringToObjectId } from '../utility/other';
import { INote, UserRole } from '../utility/types';
const noteRouter = express.Router();

async function checkUserViewNote(user: UserReturn, note: INote | null) {
    //Check user
    if (note?.owner.toString() == user?._id) return;

    const service = await serviceService.getLeader(user?.service);
    if (service.leader.toString() == user?._id) return;

    if (
        user?.roles.includes(UserRole.DIRECTOR) ||
        user?.roles.includes(UserRole.FINANCELEADER)
    )
        return;

    throw new ErrorResponse(ErrorResponse.unauthorizedStatusCode);
}

noteRouter.get(
    '/note/:noteId',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const noteId = convertStringToObjectId(req.params.noteId);
            const note = await noteService.getNoteById(noteId);
            await checkUserViewNote(req.user!, await note);
            res.json(await noteService.populateNoteLines(note));
        } catch (err) {
            next(err);
        }
    }
);

noteRouter.get(
    '/note',
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
    '/note',
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
    '/note/state',
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
