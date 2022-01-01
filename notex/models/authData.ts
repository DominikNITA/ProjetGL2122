import mongoose, { model } from "mongoose"
import { IAuthData } from "../utils/types";

const AuthDataSchema = new mongoose.Schema<IAuthData>({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true, unique: true, index:true},
    passwordHash : {type: String, required: true},
    salt : {type: String, required: true}
})

export const AuthDataModel = (mongoose.models.AuthData as unknown as mongoose.Model<IAuthData, {}, {}, {}> || model<IAuthData>("AuthData", AuthDataSchema))