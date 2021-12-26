import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import Note from "../models/note";

export const collections: { notes?: mongoDB.Collection<Note> } = {}

export async function connectToDatabase () {
  dotenv.config();

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.MONGO_URI!);
          
  await client.connect();
      
  const db: mongoDB.Db = client.db(process.env.DB_NAME);
 
  const gamesCollection: mongoDB.Collection<Note> = db.collection(process.env.NOTES_COLLECTION_NAME!);

  collections.notes = gamesCollection;
     
  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${gamesCollection.collectionName}`);
}