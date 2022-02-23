import { Types } from 'mongoose';
import { IExpenseCategory, IUser, IVehicle } from '../utility/types';
import { throwIfNullParameters } from '../utility/other';
import { ExpenseType, VehicleType } from '../../../shared/enums';
import { VehicleModel } from '../models/vehicle';
import { ExpenseCategoryModel } from '../models/expenseCategory';

export type ExpenseCategoryReturn =
    | (IExpenseCategory & { _id: Types.ObjectId })
    | null;

interface ICreateExpenseCategoryInput {
    name: string;
    expenseType: ExpenseType;
}

async function createExpenseCategory(
    input: ICreateExpenseCategoryInput
): Promise<ExpenseCategoryReturn> {
    throwIfNullParameters([input]);

    const newExpenseCategory = new ExpenseCategoryModel(input);
    await newExpenseCategory.save();

    return newExpenseCategory;
}

interface IUpdateVehicleInput {
    expenseCategory: {
        name: string;
        expenseType: ExpenseType;
    };
    expenseCategoryId: Types.ObjectId;
}
async function updateExpenseCategory(
    input: IUpdateVehicleInput
): Promise<ExpenseCategoryReturn> {
    throwIfNullParameters([input, input.expenseCategory]);

    await ExpenseCategoryModel.findByIdAndUpdate(
        input.expenseCategoryId,
        input.expenseCategory
    );
    const newVehicle = await getExpenseCategoryById(input.expenseCategoryId);

    return newVehicle;
}

async function getExpenseCategoryById(expenseCategoryId: Types.ObjectId) {
    return ExpenseCategoryModel.findById(expenseCategoryId);
}

async function deleteVehicle(expenseCategoryId: Types.ObjectId) {
    ExpenseCategoryModel.deleteOne({ _id: expenseCategoryId });
}

async function getAll() {
    return ExpenseCategoryModel.find();
}

async function getAllNotCancelled() {
    return getAll();
}

export default {
    createExpenseCategory,
    deleteVehicle,
    getExpenseCategoryById,
    updateExpenseCategory,
    getAll,
    getAllNotCancelled,
};
