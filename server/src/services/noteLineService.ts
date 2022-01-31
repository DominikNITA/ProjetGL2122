import { Document, Types } from 'mongoose';
import { IMission, INote, INoteLine } from '../utility/types';
import { throwIfNullParameters } from '../utility/other';
import { NoteLineModel } from '../models/note';
import { ErrorResponse, InvalidParameterValue } from '../utility/errors';
import noteService from './noteService';

export type NoteLineReturn = (INoteLine & { _id: Types.ObjectId }) | null;

interface ICreateNoteLineInput {
    noteId: Types.ObjectId;
    noteLine: {
        description: string;
        mission: IMission['_id'];
        ttc?: number;
        tva?: number;
        ht?: number;
        note: INote['_id'];
        date: Date;
        justificatif: string;
    };
}

async function createNoteLine(
    input: ICreateNoteLineInput
): Promise<NoteLineReturn> {
    throwIfNullParameters([input.noteId, input.noteLine]);

    // Check if mission is in the same service
    const note = await noteService.populateOwner(
        await noteService.getNoteById(input.noteId)
    );
    if (input.noteLine?.note?.toString() !== input.noteId.toString()) {
        throw new InvalidParameterValue(input.noteId);
    }
    const noteLine = input.noteLine;
    noteLine.ht = parseFloat(noteLine.ht + '');
    noteLine.ttc = parseFloat(noteLine.ttc + '');
    noteLine.tva = parseFloat(noteLine.tva + '');
    // Check if at least 2 prices are given
    if (
        (noteLine.ttc === null && noteLine.ht === null) ||
        (noteLine.ttc === null && noteLine.tva === null) ||
        (noteLine.tva === null && noteLine.ht === null)
    ) {
        throw new InvalidParameterValue(input.noteLine);
    }

    if (noteLine.ttc == null) {
        noteLine.ttc = noteLine.ht! + noteLine.tva!;
    }
    if (noteLine.tva == null) {
        noteLine.tva = noteLine.ttc! - noteLine.ht!;
    }
    if (noteLine.ht == null) {
        noteLine.ht = noteLine.ttc! - noteLine.tva!;
    }
    if (noteLine.ttc !== noteLine.tva + noteLine.ht) {
        throw new ErrorResponse(
            ErrorResponse.badRequestStatusCode,
            'Les prix TVA+HT ne sont pas egales a TTC!'
        );
    }

    const newNoteLine = new NoteLineModel(input.noteLine);
    await newNoteLine.save();

    return newNoteLine;
}

interface IUpdateNoteLineInput {
    noteLineId: Types.ObjectId;
    noteLine: {
        description: string;
        mission: IMission['_id'];
        ttc?: number;
        tva?: number;
        ht?: number;
        note: INote['_id'];
        date: Date;
        justificatif: string;
    };
}
async function updateNoteLine(
    input: IUpdateNoteLineInput
): Promise<NoteLineReturn> {
    throwIfNullParameters([input.noteLineId, input.noteLine]);

    // Check if mission is in the same service
    const oldNoteLine = await getNoteLineById(input.noteLineId);

    const note = await noteService.populateOwner(
        await noteService.getNoteById(oldNoteLine?.note)
    );
    // if (input.noteLine.note.toString() !== input.noteId.toString()) {
    //     throw new InvalidParameterValue(input.noteId);
    // }
    const noteLine = input.noteLine;
    // Check if at least 2 prices are given
    if (
        (noteLine.ttc === null && noteLine.ht === null) ||
        (noteLine.ttc === null && noteLine.tva === null) ||
        (noteLine.tva === null && noteLine.ht === null)
    ) {
        throw new InvalidParameterValue(input.noteLine);
    }

    if (noteLine.ttc == null) {
        noteLine.ttc = noteLine.ht! + noteLine.tva!;
    }
    if (noteLine.tva == null) {
        noteLine.tva = noteLine.ttc! - noteLine.ht!;
    }
    if (noteLine.ht == null) {
        noteLine.ht = noteLine.ttc! - noteLine.tva!;
    }
    if (noteLine.ttc !== noteLine.tva + noteLine.ht) {
        throw new ErrorResponse(
            ErrorResponse.badRequestStatusCode,
            'Les prix TVA+HT ne sont pas egales a TTC!'
        );
    }

    await NoteLineModel.findByIdAndUpdate(input.noteLineId, noteLine);
    const newNoteLine = await getNoteLineById(input.noteLineId);

    return newNoteLine;
}

async function getNoteLineById(noteLineId: Types.ObjectId) {
    return await NoteLineModel.findById(noteLineId);
}

async function getNoteLinesForNote(noteId: Types.ObjectId) {
    return await NoteLineModel.find({ note: noteId }).populate<{
        mission: IMission;
    }>('mission');
}

async function deleteNoteLine(noteLineId: Types.ObjectId) {
    // const noteLine = await getNoteLineById(noteLineId);
    // const note = await noteService.getNoteById(noteLine?.note);
    // note?.noteLines.
    //TODO: delete in note and justification
    await NoteLineModel.deleteOne({ _id: noteLineId });
}

export default {
    createNoteLine,
    deleteNoteLine,
    getNoteLineById,
    getNoteLinesForNote,
    updateNoteLine,
};
