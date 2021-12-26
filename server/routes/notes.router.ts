// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../db/conn";
import Note from "../models/note";
// Global Config
export const notesRouter = express.Router();

notesRouter.use(express.json());
// GET
notesRouter.get("/", async (_req: Request, res: Response) => {
    try {
       const notes = (await collections.notes?.find({}).toArray()) as Note[];

        res.status(200).send(notes);
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

notesRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        
        const query = { _id: new ObjectId(id) };
        const game = (await collections.notes?.findOne(query)) as Note;

        if (game) {
            res.status(200).send(game);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});
// POST

// PUT

// DELETE