import mongoose from 'mongoose';
import { ExpenseType } from '../../../shared/enums';
import { IExpenseCategory } from '../utility/types';

const ExpenseCategorySchema = new mongoose.Schema<IExpenseCategory>({
    name: { type: String, required: true },
    expenseType: {
        type: Number,
        enum: ExpenseType,
        required: true,
        default: ExpenseType.Standard,
    },
});

export const ExpenseCategoryModel =
    (mongoose.models.ExpenseCategory as unknown as mongoose.Model<
        IExpenseCategory,
        {},
        {},
        {}
    >) ||
    mongoose.model<IExpenseCategory>('ExpenseCategory', ExpenseCategorySchema);
