import mongoose, { Model } from "mongoose"

const ServiceSchema = new mongoose.Schema({
    item: String,
    leader: String,
    completed: Boolean,
})

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);