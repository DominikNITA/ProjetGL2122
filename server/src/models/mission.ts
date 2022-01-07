import mongoose from 'mongoose';
import { IMission } from '../utility/types';

const MissionSchema = new mongoose.Schema<IMission>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
});

export const MissionModel =
    (mongoose.models.Mission as unknown as mongoose.Model<
        IMission,
        {},
        {},
        {}
    >) || mongoose.model<IMission>('Mission', MissionSchema);
