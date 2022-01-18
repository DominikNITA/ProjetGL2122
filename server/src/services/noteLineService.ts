import { Document, Types } from 'mongoose';
import { IMission, INote, INoteLine } from '../utility/types';
import { throwIfNullParameters } from '../utility/other';
import { NoteLineModel } from '../models/note';
import { InvalidParameterValue } from '../utility/errors';
import noteService from './noteService';

export type NoteLineReturn =
    | (Document<any, any, INoteLine> & INoteLine & { _id: Types.ObjectId })
    | null;

interface ICreateNoteLineInput {
    noteId: Types.ObjectId;
    noteLine: {
        description: string;
        mission?: IMission['_id'];
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
    // if ((note?.owner as IUser).service.toString() !== input.noteId.toString()) {
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

    const newNoteLine = new NoteLineModel(input.noteLine);
    await newNoteLine.save();

    note?.noteLines.push(newNoteLine._id);
    await note?.save();
    return newNoteLine;
}

async function getNoteLineById(noteLineId: Types.ObjectId) {
    return await NoteLineModel.findById(noteLineId);
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
};
