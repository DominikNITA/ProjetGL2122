import mongoose, { Model } from "mongoose"

const ServiceSchema = new mongoose.Schema({
    name: {type: String, required: true},
    leader: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    users: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}]
})

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);