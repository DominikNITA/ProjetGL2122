//IMPORT MONGOOSE
import mongoose, { Model, Connection, Mongoose } from "mongoose"

if (!process.env.USER_DATABASE_URL) {
    throw new Error('Please add your Mongo URI to .env.local')
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: undefined, promise: undefined }
}

async function dbConnect() {
    if (cached.conn) {
        console.log("Using cached connection!");
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(process.env.USER_DATABASE_URL as string, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    //console.log("idk",cached.conn?.connections);
    return cached.conn;
}

export {dbConnect}