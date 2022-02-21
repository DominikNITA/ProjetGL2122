import mongoose from 'mongoose';
import { VehicleType } from '../../../shared/enums';
import { IVehicleMatrix } from '../utility/types';

const VehicleMatrixSchema = new mongoose.Schema<IVehicleMatrix>({
    year: { type: Number, required: true },
    vehicleType: {
        type: Number,
        enum: VehicleType,
        required: true,
        default: VehicleType.Car,
    },
    kilometerMilestones: [{ type: Number }],
    horsePowerMilestones: [{ type: Number }],
    data: [[{ type: Number }]],
});

export const VehicleMatrixModel =
    (mongoose.models.VehicleMatrix as unknown as mongoose.Model<
        IVehicleMatrix,
        {},
        {},
        {}
    >) || mongoose.model<IVehicleMatrix>('VehicleMatrix', VehicleMatrixSchema);
