import mongoose, { Model } from "mongoose"

const MissionSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    service: {type: mongoose.Schema.Types.ObjectId, ref:'Service', required: true}
})

export default mongoose.models.Mission || mongoose.model("Mission", MissionSchema);