import express, { Response, NextFunction } from 'express';
import { NoteState, UserRole } from '../../../shared/enums';
import noteLineService from '../services/noteLineService';
import noteService from '../services/noteService';
import serviceService from '../services/serviceService';
import userService, { UserReturn } from '../services/userService';
import { ErrorResponse, InvalidParameterValue } from '../utility/errors';
import { AuthenticatedRequest, requireAuthToken } from '../utility/middlewares';
import { compareObjectIds, convertStringToObjectId } from '../utility/other';
import { INote } from '../utility/types';
const noteRouter = express.Router();

async function checkUserViewNote(user: UserReturn, note: INote | null) {
    //Check user
    if (compareObjectIds(note?.owner, user?._id)) return;

    const leader = await serviceService.getLeader(user?.service);
    if (compareObjectIds(leader, user?._id)) return;

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
            res.json({
                ...note?.toObject(),
                noteLines: noteLines,
                owner: await userService.getUserById(note?.owner),
            });
        } catch (err) {
            next(err);
        }
    }
);

noteRouter.get(
    '/:noteId/viewMode',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const noteId = convertStringToObjectId(req.params.noteId);
            res.json({
                viewMode: await noteService.getViewMode(noteId, req.user?._id),
            });
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
            let notes = null;

            const queryNoteState = req.query.states as NoteState[];

            if (queryNoteState != null) {
                const page = req.query.page as unknown as number;
                const limit = req.query.limit as unknown as number;
                if (page != null && limit != null) {
                    notes = await noteService.getUserNotesWithState(
                        userId,
                        queryNoteState,
                        limit,
                        page
                    );
                } else {
                    notes = await noteService.getUserNotesWithState(
                        userId,
                        queryNoteState
                    );
                }
            } else {
                notes = await noteService.getUserNotes(userId);
            }

            if (notes.length > 0) {
                await checkUserViewNote(req.user!, notes[0]);
            }

            res.json(notes);
        } catch (err) {
            next(err);
        }
    }
);

noteRouter.get(
    '/subordinates/notes',
    requireAuthToken,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = convertStringToObjectId(req.query.owner as string);
            let notes = null;

            const queryNoteState = req.query.states as NoteState[];

            if (queryNoteState != null) {
                const page = req.query.page as unknown as number;
                const limit = req.query.limit as unknown as number;
                if (page != null && limit != null) {
                    notes = await noteService.getSubordinateUsersNotesWithState(
                        userId,
                        queryNoteState,
                        limit,
                        page
                    );
                } else {
                    notes = await noteService.getSubordinateUsersNotesWithState(
                        userId,
                        queryNoteState
                    );
                }
            } else {
                notes = await noteService.getSubordinateUsersNotes(userId);
            }

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
            if (!compareObjectIds(req.user?._id, req.body.note.owner)) {
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
                req.body.noteId,
                req.body.state
            );
            res.json({ note: note });
        } catch (err) {
            next(err);
        }
    }
);

import multer from 'multer';
import path from 'path';
import { calculatePrice } from '../utility/kilometriquePricesCalculator';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join('../', 'server/uploads/'));
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname +
                '-' +
                Date.now() +
                Math.round(Math.random() * 1e9) +
                path.extname(file.originalname).toLowerCase()
        );
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (
            ext !== '.png' &&
            ext !== '.jpg' &&
            ext !== '.pdf' &&
            ext !== '.jpeg'
        ) {
            return callback(
                new InvalidParameterValue(
                    'justificatif',
                    'Seulement les fichiers .png, .jpg, .jpeg, .pdf sont acceptes'
                )
            );
        }
        callback(null, true);
    },
    limits: {
        fileSize: 25 * 1024 * 1024,
    },
});
const fileUpload = upload.single('justificatif');

noteRouter.post(
    '/line/justificatif',
    requireAuthToken,
    fileUpload,
    (req, res, next) => {
        try {
            res.json({
                justificatifUrl: req.file?.filename,
            });
        } catch (err) {
            next(err);
        }
    }
);

noteRouter.post('/line/state', requireAuthToken, async (req, res, next) => {
    try {
        //TODO: check who can change to which state
        res.json(
            await noteLineService.changeState(
                req.body.noteLineId,
                req.body.state,
                req.body.comment
            )
        );
    } catch (err) {
        next(err);
    }
});

noteRouter.post(
    '/calculateKilometrique',
    requireAuthToken,
    async (req, res, next) => {
        try {
            res.json({
                calculatedPrice: await calculatePrice(
                    req.body.vehicleId,
                    req.body.kilometerCount,
                    req.body.date
                ),
            });
        } catch (err) {
            next(err);
        }
    }
);

export default noteRouter;
