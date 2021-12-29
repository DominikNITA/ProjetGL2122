import mongoose, { Model } from "mongoose"

export enum NoteState {
    CREATING = 'CREATING',
    VALIDATION = 'VALIDATION',
    CORRECTION = 'CORRECTION',
    VALIDATED ='VALIDATED',
    COMPLETED = 'COMPLETED'
}

const NoteSchema = new mongoose.Schema({
    service: {type: mongoose.Schema.Types.ObjectId, ref:'Service', required:true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    state: { type: String, enum: NoteState, default: NoteState.CREATING, required: true},
    noteLines: [{type: mongoose.Schema.Types.ObjectId, ref:'NoteLine'}],
})

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);