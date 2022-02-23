import { Types } from 'mongoose';
import { IAvance, INoteLine } from '../utility/types';
import { throwIfNull, throwIfNullParameters } from '../utility/other';
import { AvanceModel } from '../models/avance';
import { InvalidParameterValue } from '../utility/errors';
import { AvanceState } from '../../../shared/enums';
import { NoteModel, NoteLineModel } from '../models/note';
import { NoteLineReturn } from './noteLineService';
import { convertStringToObjectId } from '../utility/other';
import userService from './userService';

export type AvanceReturn = (IAvance & { _id: Types.ObjectId }) | null;

interface ICreateAvanceInput {
    owner: IAvance['owner'];
    description: IAvance['description'];
    mission: IAvance['mission'];
    amount: IAvance['amount'];
}

//Create a new avance in DB and return it
async function createAvance(avance: ICreateAvanceInput): Promise<AvanceReturn> {
    throwIfNullParameters([avance]);

    //check amount
    if (avance.amount <= 0) {
        throw new InvalidParameterValue("Le montant saisi n'est pas valide");
    }

    const newAvance = new AvanceModel(avance);

    await newAvance.save();
    return newAvance;
}

//Delete avance in DB
async function deleteAvance(avanceId: Types.ObjectId) {
    await AvanceModel.findByIdAndDelete(avanceId);
}

async function getAvanceById(avanceId: Types.ObjectId): Promise<AvanceReturn> {
    return await AvanceModel.findById(avanceId);
}

//Returns all the avances in DB for param user and filter param
async function getUserAvancesWithState(
    userId: Types.ObjectId,
    queryAvanceState: AvanceState[]
): Promise<AvanceReturn[]> {
    const userAvances = await AvanceModel.find({
        owner: userId,
        state: { $in: queryAvanceState },
    });
    return userAvances;
}

//Changes state for param avance
async function setAvanceState(
    avanceId: Types.ObjectId,
    state: AvanceState
): Promise<AvanceReturn> {
    const avance = await getAvanceById(avanceId);
    throwIfNull([avance]);
    const currentState = avance!.state;

    if (currentState === AvanceState.Validated) {
        throw new InvalidParameterValue(
            "L'avance indiquée est déjà validée et ne peut être modifiée"
        );
    }

    if (currentState === AvanceState.Refused) {
        throw new InvalidParameterValue(
            "L'avance indiquée est déjà refusée et ne peut être modifiée"
        );
    }

    const newAvance = AvanceModel.findOneAndUpdate(
        { _id: avanceId },
        { state: state }
    );
    return newAvance;
}

//Return note lines that correlates (=same mission and user) to the param Avance
async function getNoteLines(avance: IAvance): Promise<NoteLineReturn[]> {
    const res = [];
    for (const noteLine of avance.noteLines) {
        res.push(
            await NoteLineModel.findById(convertStringToObjectId(noteLine))
        );
    }
    return res;
}

//Return note lines that correlates (=same mission and user) to the param Avance
async function getCorrelateNoteLines(
    avance: IAvance
): Promise<NoteLineReturn[]> {
    const noteLines = await NoteLineModel.find({
        //note: { $elemMatch: { owner: avance.owner } }, //TODO A REVOIR
        mission: avance.mission,
        state: 'Validated',
    });

    const res = [];

    for (const noteLine of noteLines) {
        const note = await NoteModel.findById(noteLine.note);
        if (note?.owner.equals(avance.owner)) {
            res.push(noteLine);
        }
    }
    return res;
}

//Add NoteLines to param avance
async function updateNoteLinesForAvance(
    avanceId: Types.ObjectId,
    noteLines: INoteLine[]
) {
    const avance = await getAvanceById(avanceId);
    throwIfNull([avance]);

    const newNoteLines = noteLines ? noteLines : [];

    const newAvance = AvanceModel.findOneAndUpdate(
        { _id: avanceId },
        { noteLines: newNoteLines }
    );
    return newAvance;
}

async function getUserBalance(userId: Types.ObjectId) {
    const userAvances = await getUserAvancesWithState(userId, [
        AvanceState.Validated,
    ]);

    let balance = 0;

    for (const avance of userAvances) {
        balance += avance?.amount as number;
        if (avance?.noteLines) {
            for (const noteLine of avance?.noteLines) {
                const noteLineDetails = await NoteLineModel.findById(noteLine);
                balance -= noteLineDetails?.ttc as number;
            }
        }
    }

    return balance;
}

async function getAvanceBalance(avanceId: Types.ObjectId) {
    const avance = await getAvanceById(avanceId);

    let balance = avance?.amount as number;

    if (avance?.noteLines) {
        for (const noteLine of avance?.noteLines) {
            const noteLineDetails = await NoteLineModel.findById(noteLine);
            balance -= noteLineDetails?.ttc as number;
        }
    }

    return balance;
}

async function getSubordinateUsersAvances(
    userId: Types.ObjectId
): Promise<AvanceReturn[]> {
    const subordinateUsers = await userService.getSubordinateUsers(userId);
    const avances = await AvanceModel.find({
        owner: { $in: subordinateUsers.map((su) => su?._id) },
    });

    return avances;
}

async function getSubordinateUsersAvancesWithState(
    userId: Types.ObjectId,
    queryNoteState: AvanceState[]
): Promise<AvanceReturn[]> {
    const subordinateUsers = await userService.getSubordinateUsers(userId);
    const avance = await AvanceModel.find({
        owner: { $in: subordinateUsers.map((su) => su?._id) },
        state: { $in: queryNoteState },
    });
    return avance;
}

export default {
    createAvance,
    getUserAvancesWithState,
    getAvanceById,
    setAvanceState,
    updateNoteLinesForAvance,
    getUserBalance,
    getNoteLines,
    getCorrelateNoteLines,
    deleteAvance,
    getAvanceBalance,
    getSubordinateUsersAvances,
    getSubordinateUsersAvancesWithState,
};
