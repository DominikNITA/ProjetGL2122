import mongoose, { Model } from "mongoose"

const NoteLineSchema = new mongoose.Schema({
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
    description: { type: String, required: true },
    mission: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
})

export default mongoose.models.NoteLine || mongoose.model("NoteLine", NoteLineSchema);