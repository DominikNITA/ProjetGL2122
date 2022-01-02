import mongoose from "mongoose"
import { IService } from "../utils/types";

const ServiceSchema = new mongoose.Schema<IService>({
    name: {type: String, required: true},
    leader: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: false}
})

export const ServiceModel = (
    mongoose.models.Service as unknown as mongoose.Model<IService, {}, {}, {}> 
    || mongoose.model<IService>("Service", ServiceSchema));