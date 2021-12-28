import mongoose, { model } from "mongoose"
import { IUser } from "../utils/types";

const UserSchema = new mongoose.Schema<IUser>({
    surname: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    service: {type: mongoose.Schema.Types.ObjectId, ref:'Service', required: false},
    notes: [{type: mongoose.Schema.Types.ObjectId, ref:'Note'}]
})

export const UserModel = (mongoose.models.User as unknown as mongoose.Model<IUser, {}, {}, {}> || model<IUser>("User", UserSchema))

//mongoose.models.User as unknown as mongoose.Model<IUser, {}, {}, {}> ||