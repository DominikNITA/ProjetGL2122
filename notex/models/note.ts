import mongoose, { Model } from "mongoose"

const NoteSchema = new mongoose.Schema({
    item: String,
    completed: Boolean,
})

export default NoteSchema;