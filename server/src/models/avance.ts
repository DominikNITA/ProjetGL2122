import mongoose from 'mongoose';
import { AvanceState } from '../../../shared/enums';
import { IAvance } from '../utility/types';

const AvanceSchema = new mongoose.Schema<IAvance>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: { type: String, required: true },
    mission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mission',
        required: true,
    },
    amount: { type: Number, required: true },
    noteLines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NoteLine' }],
    state: {
        type: String,
        enum: AvanceState,
        required: true,
        default: AvanceState.Created,
    },
});

export const AvanceModel =
    (mongoose.models.Avance as unknown as mongoose.Model<
        IAvance,
        {},
        {},
        {}
    >) || mongoose.model<IAvance>('Avance', AvanceSchema);
