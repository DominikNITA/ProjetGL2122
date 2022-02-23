import { Document, Types } from 'mongoose';
import { IMission, INote, INoteLine, IVehicle } from '../utility/types';
import {
    compareObjectIds,
    isNullOrNaN,
    throwIfNull,
    throwIfNullParameters,
} from '../utility/other';
import { NoteLineModel } from '../models/note';
import {
    ErrorResponse,
    InvalidParameterValue,
    NotImplementedError,
} from '../utility/errors';
import noteService from './noteService';
import { FraisType, NoteLineState } from '../../../shared/enums';
import missionService from './missionService';

export type NoteLineReturn = (INoteLine & { _id: Types.ObjectId }) | null;

interface ICreateNoteLineInput {
    fraisType: FraisType;
    description: string;
    mission: IMission['_id'];
    note: INote['_id'];
    date: Date;
    justificatif?: string;

    ttc?: number;
    tva?: number;
    ht?: number;

    kilometerCount?: number;
    vehicle?: IVehicle['_id'];
}

async function createNoteLine(
    input: ICreateNoteLineInput
): Promise<NoteLineReturn> {
    throwIfNullParameters([input]);

    const mission = await missionService.getMissionById(input.mission);
    throwIfNull([mission]);

    if (mission!.startDate > input.date || mission!.endDate < input.date) {
        throw new InvalidParameterValue('Mauvaise date de remboursement');
    }

    let noteLine = input;
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
    const result = await newNoteLine.save();

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
        vehicle?: IVehicle['_id'];
        state?: NoteLineState;
    };
}
async function updateNoteLine(
    input: IUpdateNoteLineInput
): Promise<NoteLineReturn> {
    throwIfNullParameters([input.noteLineId, input.noteLine]);

    // Check if mission is in the same service
    const mission = await missionService.getMissionById(input.noteLine.mission);
    throwIfNull([mission]);

    if (
        mission!.startDate > input.noteLine.date ||
        mission!.endDate < input.noteLine.date
    ) {
        throw new InvalidParameterValue('Mauvaise date de remboursement');
    }
    const oldNoteLine = await getNoteLineById(input.noteLineId);

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

    if (oldNoteLine?.state == NoteLineState.Fixing) {
        noteLine.state = NoteLineState.Fixed;
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

async function changeState(
    noteLineId: Types.ObjectId,
    noteLineState: NoteLineState,
    comment?: string
) {
    return await NoteLineModel.findByIdAndUpdate(
        noteLineId,
        { state: noteLineState, comment },
        { new: true }
    );
}

async function getNoteLinesForMission(missionId: Types.ObjectId) {
    return await NoteLineModel.find({ mission: missionId });
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
    changeState,
    getNoteLinesForMission,
};
