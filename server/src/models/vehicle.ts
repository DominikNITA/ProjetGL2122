import mongoose from 'mongoose';
import { VehicleType } from '../../../shared/enums';
import { IVehicle } from '../utility/types';

const VehicleSchema = new mongoose.Schema<IVehicle>({
    description: { type: String, required: true },
    horsePower: { type: Number, required: true },
    type: {
        type: Number,
        enum: VehicleType,
        required: true,
        default: VehicleType.Car,
    },
    isElectric: { type: Boolean, required: true, default: false },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

export const VehicleModel =
    (mongoose.models.Vehicle as unknown as mongoose.Model<
        IVehicle,
        {},
        {},
        {}
    >) || mongoose.model<IVehicle>('Vehicle', VehicleSchema);
