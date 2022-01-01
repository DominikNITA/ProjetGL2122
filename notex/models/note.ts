import mongoose, { Model } from "mongoose"
import { INote } from "../utils/types";

export enum NoteState {
    CREATING = 'CREATING',
    VALIDATION = 'VALIDATION',
    CORRECTION = 'CORRECTION',
    VALIDATED ='VALIDATED',
    COMPLETED = 'COMPLETED'
}

const NoteLineSchema = new mongoose.Schema({
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

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);