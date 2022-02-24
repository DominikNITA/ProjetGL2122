import { Types } from 'mongoose';
import {
    IExpenseCategory,
    IMission,
    INoteLine,
    IVehicle,
} from '../utility/types';
import {
    isNullOrNaN,
    throwIfNull,
    throwIfNullParameters,
} from '../utility/other';
import { NoteLineModel } from '../models/note';
import { ErrorResponse, InvalidParameterValue } from '../utility/errors';
import { ExpenseType, NoteLineState } from '../../../shared/enums';
import missionService from './missionService';
import expenseCategoryService from './expenseCategoryService';
import { calculatePrice } from '../utility/kilometriquePricesCalculator';

export type NoteLineReturn = (INoteLine & { _id: Types.ObjectId }) | null;

async function createNoteLine(
    input: Partial<INoteLine>
): Promise<NoteLineReturn> {
    throwIfNullParameters([input]);

    const mission = await missionService.getMissionById(input.mission);
    throwIfNull([mission]);

    if (mission!.startDate > input.date! || mission!.endDate < input.date!) {
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
            noteLine = validateKilometriePrices(noteLine);
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
    noteLine: Partial<INoteLine>;
}
async function updateNoteLine(
    input: IUpdateNoteLineInput
): Promise<NoteLineReturn> {
    throwIfNullParameters([input.noteLineId, input.noteLine]);

    // Check if mission is in the same service
    const mission = await missionService.getMissionById(input.noteLine.mission);
    throwIfNull([mission]);

    if (
        mission!.startDate > input.noteLine.date! ||
        mission!.endDate < input.noteLine.date!
    ) {
        throw new InvalidParameterValue('Mauvaise date de remboursement');
    }
    const oldNoteLine = await getNoteLineById(input.noteLineId);

    let noteLine = input.noteLine;
    const expense = await expenseCategoryService.getExpenseCategoryById(
        input.noteLine.expenseCategory
    );
    throwIfNull([expense]);
    switch (expense!.expenseType) {
        case ExpenseType.Standard:
            noteLine = validateStandardPrices(noteLine);
            break;
        case ExpenseType.Kilometrique:
            noteLine = validateKilometriePrices(noteLine);
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

function validateStandardPrices(noteLine: Partial<INoteLine>) {
    noteLine.ht = parseFloat(parseFloat(noteLine.ht + '').toFixed(2));
    noteLine.ttc = parseFloat(parseFloat(noteLine.ttc + '').toFixed(2));
    noteLine.tva = parseFloat(parseFloat(noteLine.tva + '').toFixed(2));

    if (isNullOrNaN(noteLine.ttc)) {
        throw new InvalidParameterValue('La valeur de TTC est necessaire');
    }

    if (isNullOrNaN(noteLine.tva)) {
        noteLine.tva = noteLine.ttc! - noteLine.ht!;
    }
    if (isNullOrNaN(noteLine.ht)) {
        noteLine.ht = noteLine.ttc! - noteLine.tva!;
    }
    if (noteLine.ht < 0 || noteLine.ttc < 0 || noteLine.tva < 0) {
        throw new InvalidParameterValue(
            'Les valeurs ne peuvent pas etre negatifs'
        );
    }
    if (noteLine.ttc !== noteLine.tva + noteLine.ht) {
        throw new ErrorResponse(
            ErrorResponse.badRequestStatusCode,
            'Les prix TVA+HT ne sont pas egales a TTC!'
        );
    }

    noteLine.kilometerCount = 0;
    noteLine.vehicle = undefined;

    return noteLine;
}

function validateKilometriePrices(noteLine: Partial<INoteLine>) {
    noteLine.ttc = undefined;
    noteLine.tva = undefined;
    noteLine.ht = undefined;

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
