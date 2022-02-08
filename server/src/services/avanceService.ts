import { Types } from 'mongoose';
import { IAvance, INoteLine } from '../utility/types';
import { throwIfNull, throwIfNullParameters } from '../utility/other';
import { AvanceModel } from '../models/avance';
import { InvalidParameterValue } from '../utility/errors';
import { AvanceState } from '../../../shared/enums';
import noteService from './noteService';

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
async function setState(
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

//Return avances that correlates (=same mission and user) to the param NoteLine
async function getCorrelateAvancesForNoteLine(
    noteLine: INoteLine
): Promise<AvanceReturn[]> {
    const mission = noteLine.mission;
    const note = await noteService.getNoteById(noteLine.note);

    const avances = await getUserAvancesWithState(note?.owner, [
        AvanceState.Validated,
    ]);

    return avances.filter((avance) => avance?.mission === mission);
}

async function addNoteLinesForAvance(
    avanceId: Types.ObjectId,
    noteLines: INoteLine[]
) {
    const avance = await getAvanceById(avanceId);
    throwIfNull([avance]);

    avance?.noteLines.concat(noteLines);
}

export default {
    createAvance,
    getUserAvancesWithState,
    getAvanceById,
    setState,
    getCorrelateAvancesForNoteLine,
    addNoteLinesForAvance,
};
