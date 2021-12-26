//IMPORT MONGOOSE
import mongoose, { Model, Connection, Mongoose } from "mongoose"
import NoteSchema from "../models/note"
import ServiceSchema from "../models/service";

if (!process.env.mongodb) {
    throw new Error('Please add your Mongo URI to .env.local')
}

// type MongoConnection = {
//     client: Mongoose;
//   };
  
//   declare global {
//     namespace NodeJS {
//       interface Global {
//         mongoose: {
//           conn: Connection | null;
//           promise: Promise<Connection> | null;
//         }
//       }
//     }
//   }


let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: undefined, promise: undefined }
}

async function dbConnect() {
    if (cached.conn) {
        console.log("Using cached connection!");
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }

        cached.promise = mongoose.connect(process.env.mongodb as string, opts).then((mongoose) => {
            return mongoose
        })
    }
    cached.conn = await cached.promise
    return cached.conn
}

export {dbConnect}


// // OUR NOTE MODEL
// const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);
// const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

// return { conn, Note, Service }
// };
