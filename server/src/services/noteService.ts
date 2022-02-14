import { Document, Types } from 'mongoose';
import { INote, INoteLine, IUser } from '../utility/types';
import {
    compareObjectIds,
    throwIfNull,
    throwIfNullParameters,
} from '../utility/other';
import { NoteModel } from '../models/note';
import { InvalidParameterValue } from '../utility/errors';
import { NoteState, NoteViewMode, UserRole } from '../../../shared/enums';
import userService, { UserReturn } from './userService';

export type NoteReturn = (INote & { _id: Types.ObjectId }) | null;

interface ICreateNoteInput {
    owner: INote['owner'];
    month: INote['month'];
    year: INote['year'];
    state?: INote['state'];
}

async function createNote(note: ICreateNoteInput): Promise<NoteReturn> {
    throwIfNullParameters([note]);

    if (
        await hasUserNoteForGivenMonthAndYear(note.owner, note.month, note.year)
    ) {
        throw new InvalidParameterValue(
            note,
            'User already has a note for this month and year!'
        );
    }

    //TODO: maybe check if this date is available? don't create notes for 2025 in 2022?

    const newNote = new NoteModel(note);
    await newNote.save();
    return newNote;
}

async function hasUserNoteForGivenMonthAndYear(
    userId: Types.ObjectId,
    month: Number,
    year: Number
) {
    const notes = await getUserNotes(userId);

    return notes.findIndex((n) => n!.year === year && n!.month === month) != -1;
}

async function getNoteById(noteId: Types.ObjectId): Promise<NoteReturn> {
    const note = await NoteModel.findOne({ _id: noteId });
    return note!;
}

async function getUserNotes(userId: Types.ObjectId): Promise<NoteReturn[]> {
    const notes = await NoteModel.find({ owner: userId });

    return notes;
}

async function getUserNotesWithState(
    userId: Types.ObjectId,
    queryNoteState: NoteState[],
    limit = 1000,
    page = 1
): Promise<NoteReturn[]> {
    const notes = await NoteModel.find({
        owner: userId,
        state: { $in: queryNoteState },
    })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    return notes;
}

async function getSubordinateUsers(
    userId: Types.ObjectId
): Promise<UserReturn[]> {
    const user = await userService.getUserById(userId);
    if (user?.roles.includes(UserRole.Leader)) {
        const subordinateUsers = await userService
            .getUsersWithRole(UserRole.Collaborator)
            .find({ service: user.service });
        return subordinateUsers.filter(
            (su) => !compareObjectIds(userId, su._id)
        );
    }
    //TODO: Add case for director and finance leader
    return [];
}

async function getSubordinateUsersNotes(
    userId: Types.ObjectId
): Promise<NoteReturn[]> {
    const subordinateUsers = await getSubordinateUsers(userId);
    const notes = await NoteModel.find({
        owner: { $in: subordinateUsers.map((su) => su?._id) },
    });

    return notes;
}

async function getSubordinateUsersNotesWithState(
    userId: Types.ObjectId,
    queryNoteState: NoteState[],
    limit = 1000,
    page = 1
): Promise<NoteReturn[]> {
    const subordinateUsers = await getSubordinateUsers(userId);
    const notes = await NoteModel.find({
        owner: { $in: subordinateUsers.map((su) => su?._id) },
        state: { $in: queryNoteState },
    })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate<{ owner: IUser }>('owner');
    return notes;
}

async function changeState(noteId: Types.ObjectId, newState: NoteState) {
    const note = await getNoteById(noteId);
    throwIfNull([note]);
    const currentState = note!.state;
    //TODO: add additional checks when NoteLine (remboursements) Service is ready
    if (newState === NoteState.Created) {
        throw new InvalidParameterValue(newState);
    }
    if (newState === NoteState.InValidation) {
        if (![NoteState.Created, NoteState.Fixing].includes(currentState)) {
            throw new InvalidParameterValue(newState);
        }
    }
    if (newState === NoteState.Validated) {
        if (currentState !== NoteState.InValidation) {
            throw new InvalidParameterValue(newState);
        }
    }
    if (newState === NoteState.Fixing) {
        if (currentState !== NoteState.InValidation) {
            throw new InvalidParameterValue(newState);
        }
    }
    if (newState === NoteState.Completed) {
        if (currentState !== NoteState.Validated) {
            throw new InvalidParameterValue(newState);
        }
    }
    note!.state = newState;
    note?.save();
    return note;
}

async function populateOwner(note: NoteReturn) {
    return note?.populate<{ owner: IUser }>('owner');
}

async function getViewMode(
    noteId: Types.ObjectId,
    userId: Types.ObjectId
): Promise<NoteViewMode> {
    const note = await getNoteById(noteId);
    const user = await userService.getUserById(userId);
    throwIfNull([note, user]);

    if (compareObjectIds(note!.owner, userId)) {
        switch (note!.state) {
            case NoteState.Validated:
            case NoteState.InValidation:
            case NoteState.Completed:
                return NoteViewMode.View;
            case NoteState.Fixing:
                return NoteViewMode.Fix;
            case NoteState.Created:
                return NoteViewMode.InitialCreation;
        }
    }

    const owner = await userService.getUserById(note!.owner);

    //TODO: Check for director etc...
    if (
        user!.roles.includes(UserRole.Leader) &&
        compareObjectIds(user?.service, owner?.service)
    ) {
        if (
            [
                NoteState.Validated,
                NoteState.Completed,
                NoteState.Fixing,
            ].includes(note!.state)
        ) {
            return NoteViewMode.View;
        }
        if (note!.state == NoteState.InValidation) {
            return NoteViewMode.Validate;
        }
    }

    return NoteViewMode.Unknown;
}

export default {
    createNote,
    getNoteById,
    getUserNotes,
    getSubordinateUsersNotes,
    getSubordinateUsersNotesWithState,
    changeState,
    populateOwner,
    getUserNotesWithState,
    getViewMode,
};
