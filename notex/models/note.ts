import mongoose, { Model } from "mongoose"
import { INote, INoteLine } from "../utils/types";

export enum NoteState {
    CREATING = 'CREATING',
    VALIDATION = 'VALIDATION',
    CORRECTION = 'CORRECTION',
    VALIDATED ='VALIDATED',
    COMPLETED = 'COMPLETED'
}

const NoteLineSchema = new mongoose.Schema<INoteLine>({
    description: { type: String, required: true },
    mission: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
    amount: { type: Number, required : true}
})

const NoteSchema = new mongoose.Schema<INote>({
    //service: {type: mongoose.Schema.Types.ObjectId, ref:'Service', required:true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    state: { type: String, enum: NoteState, default: NoteState.CREATING, required: true},
    noteLines: [NoteLineSchema],
})

export const NoteModel = 
    mongoose.models.Note as unknown as mongoose.Model<INote, {}, {}, {}> 
    || mongoose.model<INote>("Note", NoteSchema);