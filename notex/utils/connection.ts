//IMPORT MONGOOSE
import mongoose, { Model } from "mongoose"
import NoteSchema from "../models/note"
import ServiceSchema from "../models/service";


// connection function
export const connect = async () => {
    const conn = await mongoose
        .connect(process.env.mongodb as string)
        .catch(err => console.log(err))
    console.log("Mongoose Connection Established")


    // OUR NOTE MODEL
    const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);
    const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

    return { conn, Note, Service }
};
