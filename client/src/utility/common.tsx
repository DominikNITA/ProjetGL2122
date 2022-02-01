import { Tag } from 'antd';
import { Month, NoteState, FraisType } from '../enums';

export enum FormMode {
    Creation,
    Modification,
    Unknown,
}

export function getFrenchMonth(monthNumber?: Month) {
    switch (monthNumber) {
        case Month.January:
            return 'Janvier';
        case Month.February:
            return 'Fevrier';
        case Month.March:
            return 'Mars';
        case Month.April:
            return 'Avril';
        case Month.May:
            return 'Mai';
        case Month.June:
            return 'Juin';
        case Month.July:
            return 'Juillet';
        case Month.August:
            return 'Aout';
        case Month.September:
            return 'Septembre';
        case Month.October:
            return 'Octobre';
        case Month.November:
            return 'Novembre';
        case Month.December:
            return 'Decembre';
        default:
            return 'Unknown';
    }
}

export function getFrenchNoteState(noteState?: NoteState) {
    switch (noteState) {
        case NoteState.Created:
            return 'En constitution';
        case NoteState.InValidation:
            return 'Validation';
        case NoteState.Fixing:
            return 'A corriger';
        case NoteState.Validated:
            return 'Validée';
        case NoteState.Completed:
            return 'Complete';
        default:
            return 'Unknown';
    }
}

export function getFrenchFraisType(fraisType: FraisType) {
    switch (fraisType) {
        case FraisType.Standard:
            return 'Standard';
        case FraisType.Kilometrique:
            return 'Kilometrique';
        default:
            return 'Unknown';
    }
}

export function noteStateTag(state: NoteState) {
    const text = getFrenchNoteState(state);
    switch (state) {
        case NoteState.Created:
            return <Tag color="lime">{text}</Tag>;
        case NoteState.InValidation:
            return <Tag color="geekblue">{text}</Tag>;
        case NoteState.Fixing:
            return <Tag color="pink">{text}</Tag>;
        case NoteState.Validated:
            return <Tag color="gold">{text}</Tag>;
        case NoteState.Completed:
            return <Tag color="success">{text}</Tag>;
        default:
            return <Tag color="error">{text}</Tag>;
    }
}
