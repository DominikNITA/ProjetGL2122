import mongoose from 'mongoose';
import { INote, INoteLine, NoteState } from '../utility/types';

const NoteLineSchema = new mongoose.Schema<INoteLine>({
    description: { type: String, required: true },
    mission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mission',
        required: true,
    },
    amount: { type: Number, required: true },
    note: { type: mongoose.Schema.Types.ObjectId, required: true },
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
        default: NoteState.CREATED,
        required: true,
    },
    noteLines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NoteLine' }],
    month: { type: Number, required: true },
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
