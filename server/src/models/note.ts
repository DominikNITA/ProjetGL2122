import mongoose from 'mongoose';
import {
    ExpenseType,
    Month,
    NoteLineState,
    NoteState,
} from '../../../shared/enums';
import { INote, INoteLine } from '../utility/types';

const NoteLineSchema = new mongoose.Schema<INoteLine>({
    expenseCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExpenseCategory',
        required: true,
    },
    description: { type: String, required: true },
    mission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mission',
        required: true,
    },
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
    state: {
        type: String,
        enum: NoteLineState,
        required: true,
        default: NoteLineState.Created,
    },
    date: { type: Date, required: true },
    justificatif: { type: String, required: false },

    ttc: { type: Number, required: false },
    tva: { type: Number, required: false },
    ht: { type: Number, required: false },

    kilometerCount: { type: Number, required: false },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: false,
    },
    comment: { type: String, required: false },
});

const NoteSchema = new mongoose.Schema<INote>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    state: {
        type: String,
        enum: NoteState,
        default: NoteState.Created,
        required: true,
    },
    month: { type: Number, enum: Month, required: true },
    year: { type: Number, required: true },
});

export const NoteLineModel =
    (mongoose.models.NoteLine as unknown as mongoose.Model<
        INoteLine,
        {},
        {},
        {}
    >) || mongoose.model<INoteLine>('NoteLine', NoteLineSchema);

export const NoteModel =
    (mongoose.models.Note as unknown as mongoose.Model<INote, {}, {}, {}>) ||
    mongoose.model<INote>('Note', NoteSchema);
