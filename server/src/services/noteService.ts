import { Document, Types } from 'mongoose';
import { INote, INoteLine, IUser, NoteState } from '../utility/types';
import { throwIfNull, throwIfNullParameters } from '../utility/other';
import { NoteModel } from '../models/note';
import { InvalidParameterValue } from '../utility/errors';

export type NoteReturn =
    | (Document<any, any, INote> & INote & { _id: Types.ObjectId })
    | null;

interface ICreateNoteInput {
    owner: INote['owner'];
    month: INote['month'];
    year: INote['year'];
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
    return note;
}

async function getUserNotes(userId: Types.ObjectId): Promise<NoteReturn[]> {
    const notes = await NoteModel.find({ owner: userId });
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

async function populateNoteLines(note: NoteReturn) {
    return note?.populate<{ noteLines: [INoteLine] }>('owner');
}

export default {
    createNote,
    getNoteById,
    getUserNotes,
    changeState,
    populateOwner,
    populateNoteLines,
};
