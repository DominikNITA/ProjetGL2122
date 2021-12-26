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
        const note = (await collections.notes?.findOne(query)) as Note;

        if (note) {
            res.status(200).send(note);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});
// POST
notesRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newGame = req.body as Note;
        const result = await collections.notes?.insertOne(newGame);

        result
            ? res.status(201).send(`Successfully created a new game with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new game.");
    } catch (error) {
        console.error(error);
        res.status(400).send((error as Error).message);
    }
});
// PUT

// DELETE