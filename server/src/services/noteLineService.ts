import { Document, Types } from 'mongoose';
import {
    IExpenseCategory,
    IMission,
    INote,
    INoteLine,
    IVehicle,
} from '../utility/types';
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
import { ExpenseType, NoteLineState } from '../../../shared/enums';
import missionService from './missionService';
import expenseCategoryService from './expenseCategoryService';
import { calculatePrice } from '../utility/kilometriquePricesCalculator';

export type NoteLineReturn = (INoteLine & { _id: Types.ObjectId }) | null;

interface ICreateNoteLineInput {
    description: string;
    mission: IMission['_id'];
    note: INote['_id'];
    date: Date;
    justificatif?: string;

    expenseCategory: IExpenseCategory['_id'];
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

    const expense = await expenseCategoryService.getExpenseCategoryById(
        input.expenseCategory
    );
    throwIfNull([expense]);

    let noteLine = input;
    switch (expense!.expenseType) {
        case ExpenseType.Standard:
            noteLine = validateStandardPrices(noteLine);
            break;
        case ExpenseType.Kilometrique:
            noteLine = noteLine;
            break;
        default:
            break;
    }

    const newNoteLine = new NoteLineModel(noteLine);
    await newNoteLine.save();

    return await NoteLineModel.findById(newNoteLine._id)
        .populate<{
            mission: IMission;
        }>('mission')
        .populate<{
            vehicle: IVehicle;
        }>('vehicle')
        .populate<{ expenseCategory: IExpenseCategory }>('expenseCategory');
}

interface IUpdateNoteLineInput {
    noteLineId: Types.ObjectId;
    noteLine: {
        fraisType: ExpenseType;
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
        case ExpenseType.Standard:
            noteLine = validateStandardPrices(noteLine);
            break;
        case ExpenseType.Kilometrique:
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
    const noteLines = await NoteLineModel.find({ note: noteId })
        .populate<{
            mission: IMission;
        }>('mission')
        .populate<{
            vehicle: IVehicle;
        }>('vehicle')
        .populate<{ expenseCategory: IExpenseCategory }>('expenseCategory');
    const noteLinesWithKilometerExpense = [];
    for (let index = 0; index < noteLines.length; index++) {
        const newNoteLine = noteLines[index].toObject();
        if (
            newNoteLine.expenseCategory.expenseType == ExpenseType.Kilometrique
        ) {
            (newNoteLine as any).kilometerExpense = await calculatePrice(
                newNoteLine.vehicle._id,
                newNoteLine.kilometerCount,
                newNoteLine.date
            );
        }
        noteLinesWithKilometerExpense.push(newNoteLine);
    }
    return noteLinesWithKilometerExpense;
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
    const noteLines = await NoteLineModel.find({ mission: missionId })
        .populate<{
            mission: IMission;
        }>('mission')
        .populate<{
            vehicle: IVehicle;
        }>('vehicle')
        .populate<{ expenseCategory: IExpenseCategory }>('expenseCategory');

    const noteLinesWithKilometerExpense = [];
    for (let index = 0; index < noteLines.length; index++) {
        const newNoteLine = noteLines[index].toObject();
        if (
            newNoteLine.expenseCategory.expenseType == ExpenseType.Kilometrique
        ) {
            (newNoteLine as any).kilometerExpense = await calculatePrice(
                newNoteLine.vehicle._id,
                newNoteLine.kilometerCount,
                newNoteLine.date
            );
        }
        noteLinesWithKilometerExpense.push(newNoteLine);
    }
    return noteLinesWithKilometerExpense;
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
