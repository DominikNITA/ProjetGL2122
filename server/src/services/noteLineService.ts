import { Document, Types } from 'mongoose';
import { IMission, INote, INoteLine, IVehicle } from '../utility/types';
import { isNullOrNaN, throwIfNullParameters } from '../utility/other';
import { NoteLineModel } from '../models/note';
import {
    ErrorResponse,
    InvalidParameterValue,
    NotImplementedError,
} from '../utility/errors';
import noteService from './noteService';
import { FraisType } from '../../../shared/enums';

export type NoteLineReturn = (INoteLine & { _id: Types.ObjectId }) | null;

interface ICreateNoteLineInput {
    noteId: Types.ObjectId;
    noteLine: {
        fraisType: FraisType;
        description: string;
        mission: IMission['_id'];
        note: INote['_id'];
        date: Date;
        justificatif: string;

        ttc?: number;
        tva?: number;
        ht?: number;

        kilometerCount?: number;
        vehicule?: IVehicle['_id'];
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

    let noteLine = input.noteLine;
    switch (noteLine.fraisType) {
        case FraisType.Standard:
            noteLine = validateStandardPrices(noteLine);
            break;
        case FraisType.Kilometrique:
            noteLine = noteLine;
            break;
        default:
            break;
    }

    const newNoteLine = new NoteLineModel(noteLine);
    await newNoteLine.save();

    return newNoteLine;
}

interface IUpdateNoteLineInput {
    noteLineId: Types.ObjectId;
    noteLine: {
        fraisType: FraisType;
        description: string;
        mission: IMission['_id'];
        note: INote['_id'];
        date: Date;
        justificatif: string;

        ttc?: number;
        tva?: number;
        ht?: number;

        kilometerCount?: number;
        vehicule?: IVehicle['_id'];
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
    let noteLine = input.noteLine;
    switch (noteLine.fraisType) {
        case FraisType.Standard:
            noteLine = validateStandardPrices(noteLine);
            break;
        case FraisType.Kilometrique:
            //TODO: verifier les frais kilo
            break;
        default:
            break;
    }

    await NoteLineModel.findByIdAndUpdate(input.noteLineId, noteLine);
    const newNoteLine = await getNoteLineById(input.noteLineId);

    return newNoteLine;
}

function validateStandardPrices(noteLine: any) {
    noteLine.ht = parseFloat(noteLine.ht + '');
    noteLine.ttc = parseFloat(noteLine.ttc + '');
    noteLine.tva = parseFloat(noteLine.tva + '');
    // Check if at least 2 prices are given
    if (
        (noteLine.ttc === null && noteLine.ht === null) ||
        (noteLine.ttc === null && noteLine.tva === null) ||
        (noteLine.tva === null && noteLine.ht === null)
    ) {
        throw new InvalidParameterValue(noteLine);
    }

    if (isNullOrNaN(noteLine.ttc)) {
        noteLine.ttc = noteLine.ht! + noteLine.tva!;
    }
    if (isNullOrNaN(noteLine.tva)) {
        noteLine.tva = noteLine.ttc! - noteLine.ht!;
    }
    if (isNullOrNaN(noteLine.ht)) {
        noteLine.ht = noteLine.ttc! - noteLine.tva!;
    }
    if (noteLine.ttc !== noteLine.tva + noteLine.ht) {
        throw new ErrorResponse(
            ErrorResponse.badRequestStatusCode,
            'Les prix TVA+HT ne sont pas egales a TTC!'
        );
    }

    return noteLine;
}

async function getNoteLineById(noteLineId: Types.ObjectId) {
    return await NoteLineModel.findById(noteLineId);
}

async function getNoteLinesForNote(noteId: Types.ObjectId) {
    return await NoteLineModel.find({ note: noteId })
        .populate<{
            mission: IMission;
        }>('mission')
        .populate<{
            vehicle: IVehicle;
        }>('vehicle');
}

async function deleteNoteLine(noteLineId: Types.ObjectId) {
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
