import { Types } from 'mongoose';
import { IAvance, INoteLine } from '../utility/types';
import { throwIfNull, throwIfNullParameters } from '../utility/other';
import { AvanceModel } from '../models/avance';
import { InvalidParameterValue } from '../utility/errors';
import { AvanceState } from '../../../shared/enums';
import { NoteLineModel } from '../models/note';
import { NoteLineReturn } from './noteLineService';

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
        throw new InvalidParameterValue(
            avance,
            "Le montant saisi n'est pas valide"
        );
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
            avanceId,
            "L'avance indiquée est déjà validée et ne peut être modifiée"
        );
    }

    if (currentState === AvanceState.Refused) {
        throw new InvalidParameterValue(
            avanceId,
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
async function getCorrelateNoteLines(
    avance: IAvance
): Promise<NoteLineReturn[]> {
    return await NoteLineModel.find({
        owner: avance.owner,
        mission: avance.mission,
        state: 'Validated',
    });
}

//Add NoteLines to param avance
async function addNoteLinesForAvance(
    avanceId: Types.ObjectId,
    noteLines: INoteLine[]
) {
    const avance = await getAvanceById(avanceId);
    throwIfNull([avance]);

    avance?.noteLines.concat(noteLines);
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

export default {
    createAvance,
    getUserAvancesWithState,
    getAvanceById,
    setAvanceState,
    addNoteLinesForAvance,
    getUserBalance,
    getCorrelateNoteLines,
    deleteAvance,
    getAvanceBalance,
};
