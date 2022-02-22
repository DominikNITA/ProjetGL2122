import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Tag } from 'antd';
import {
    Month,
    NoteState,
    FraisType,
    VehicleType,
    AvanceState,
    NoteLineState,
    MissionState,
} from '../enums';

export enum FormMode {
    Creation,
    Modification,
    View,
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

export function getFrenchNoteLineState(noteLineState?: NoteLineState) {
    switch (noteLineState) {
        case NoteLineState.Created:
            return 'En attente';
        case NoteLineState.Fixing:
            return 'A corriger';
        case NoteLineState.Fixed:
            return 'Corrigé';
        case NoteLineState.Validated:
            return 'Validé';

        default:
            return 'Unknown';
    }
}

export function getFrenchMissionState(missionState: MissionState) {
    switch (missionState) {
        case MissionState.NotStarted:
            return 'Pas commencée';
        case MissionState.InProgress:
            return 'En cours';
        case MissionState.Finished:
            return 'Finie';
        case MissionState.Cancelled:
            return 'Annulée';
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

export function getFrenchVehicleType(vehicleType: VehicleType) {
    switch (vehicleType) {
        case VehicleType.Car:
            return 'Voiture';
        case VehicleType.Motorcycle:
            return 'Moto';
        case VehicleType.Scooter:
            return 'Scooter';
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

export function avanceStateTag(state: AvanceState) {
    switch (state) {
        case AvanceState.Created:
            return <Tag color="lime">En attente de validation</Tag>;
        case AvanceState.Validated:
            return <Tag color="green">Validée</Tag>;
        case AvanceState.Refused:
            return <Tag color="red">Refusée</Tag>;
        default:
            return <Tag color="error">Unknow</Tag>;
    }
}
export function noteLineStateTag(state: NoteLineState) {
    const text = getFrenchNoteLineState(state);
    switch (state) {
        case NoteLineState.Created:
            return <Tag color="geekblue">{text}</Tag>;
        case NoteLineState.Fixing:
            return <Tag color="error">{text}</Tag>;
        case NoteLineState.Fixed:
            return <Tag color="pink">{text}</Tag>;
        case NoteLineState.Validated:
            return <Tag color="lime">{text}</Tag>;
        default:
            return <Tag color="error">{text}</Tag>;
    }
}

export function missionStateTag(missionState: MissionState) {
    const text = getFrenchMissionState(missionState);
    switch (missionState) {
        case MissionState.NotStarted:
            return <Tag color="geekblue">{text}</Tag>;
        case MissionState.InProgress:
            return <Tag color="gold">{text}</Tag>;
        case MissionState.Finished:
            return <Tag color="lime">{text}</Tag>;
        case MissionState.Cancelled:
            return <Tag color="error">{text}</Tag>;
        default:
            return <Tag color="error">{text}</Tag>;
    }
}

export function getJustificatifUrl(justificatif?: string) {
    if (justificatif == null) return null;
    return `http://localhost:4000/uploads/${justificatif}`;
}

export function convertToDate(date: Date | string) {
    return new Date(Date.parse(date as unknown as string));
}

export const getColumnSearchProps = (
    dataIndices: string[],
    searchInput: Input | null | undefined,
    placeholder?: string
) => ({
    filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
    }: any) => (
        <div style={{ padding: 8 }}>
            <Input
                ref={(node) => {
                    searchInput = node;
                }}
                placeholder={placeholder ?? `Search ${dataIndices[0]}`}
                value={selectedKeys[0]}
                onChange={(e) =>
                    setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
                onPressEnter={() => handleSearch(confirm)}
                style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
                <Button
                    type="primary"
                    onClick={() => handleSearch(confirm)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                >
                    Filtrer
                </Button>
                <Button
                    onClick={() =>
                        handleReset(clearFilters, setSelectedKeys, confirm)
                    }
                    size="small"
                    style={{ width: 90 }}
                >
                    Effacer
                </Button>
            </Space>
        </div>
    ),
    filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) => {
        return dataIndices.some((x) => {
            return handleOnFilter(value, record, x);
        });
    },
    onFilterDropdownVisibleChange: (visible: boolean) => {
        if (visible) {
            console.log(searchInput);
            setTimeout(() => searchInput?.select(), 100);
        }
    },
});

const handleOnFilter = (
    value: any,
    record: any,
    dataIndex: string
): boolean => {
    const indexOfSeparator = dataIndex.indexOf('.');
    if (indexOfSeparator != -1) {
        return handleOnFilter(
            value,
            record[dataIndex.split('.')[0]],
            dataIndex.slice(indexOfSeparator + 1)
        );
    }
    return record[dataIndex]
        ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
        : false;
};

const handleSearch = (confirm: () => void) => {
    confirm();
};

const handleReset = (
    clearFilters: () => void,
    setSelectedKeys: any,
    confirm: any
) => {
    clearFilters();
    setSelectedKeys([]);
    confirm();
};
