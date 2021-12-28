import mongoose, { Model } from "mongoose"

const UserSchema = new mongoose.Schema({
    surname: {type: String, required: true},
    name: {type: String, required: true},
    mail: {type: String, required: true},
    service: {type: mongoose.Schema.Types.ObjectId, ref:'Service', required: true},
    notes: [{type: mongoose.Schema.Types.ObjectId, ref:'Note'}]
})

export default mongoose.models.User || mongoose.model("User", UserSchema);;