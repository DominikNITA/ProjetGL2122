import { Input } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { Link } from 'react-router-dom';
import { NoteState } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { INote } from '../types';
import { getFrenchMonth, getColumnSearchProps } from '../utility/common';
import { getMonthFilter, remove_duplicates_es6 } from '../utility/other';

type Props = {
    notes: INote[];
    buttonText: (noteState: NoteState) => string;
    titleText: string;
    noNotesMessage?: string;
};

const NoteArchiveTable = ({
    notes,
    buttonText,
    titleText,
    noNotesMessage,
}: Props) => {
    const getYearFilter = () => {
        const years = notes.map((note) => note.year);
        const uniqueYears = remove_duplicates_es6(years);
        return uniqueYears.map((year) => {
            return {
                value: year,
                text: year,
            };
        });
    };

    // eslint-disable-next-line prefer-const
    let searchInput: Input | null = null;

    const allColumns: ColumnsType<INote> = [
        {
            title: 'Mois',
            dataIndex: 'month',
            key: 'month',
            width: '1px',
            render: (text: any, record: INote) => {
                return getFrenchMonth(record.month);
            },
            sorter: {
                compare: (a, b) => a.month - b.month,
                multiple: 1,
            },
            defaultSortOrder: 'descend',
            filters: getMonthFilter(),
            onFilter: (value, record) => {
                return value == record.month;
            },
        },
        {
            title: 'Annee',
            dataIndex: 'year',
            key: 'year',
            width: '1px',
            sorter: {
                compare: (a, b) => a.year - b.year,
                multiple: 2,
            },
            defaultSortOrder: 'descend',
            filters: getYearFilter(),
            onFilter: (value, record) => {
                return value == record.year;
            },
        },
        {
            title: 'Collaborateur',
            dataIndex: 'owner',
            key: 'owner',
            align: 'right',
            render: (text: any, record: INote) => {
                return `${record.owner.firstName} ${record.owner.lastName}`;
            },
            // TODO: add properties on objects
            ...getColumnSearchProps(
                ['owner.firstName', 'owner.lastName'],
                searchInput
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '1px',
            render: (text: any, record: INote) => (
                <Link to={`/notes/${record._id}`}>
                    {buttonText(record.state)}
                </Link>
            ),
        },
    ];

    return (
        <>
            <h2 style={{ textAlign: 'center' }}>{titleText}</h2>
            {notes.length == 0 ? (
                <div style={{ textAlign: 'center' }}>
                    {noNotesMessage ??
                        "Vous n'avez pas de notes en constitution!"}
                </div>
            ) : (
                <Table
                    columns={allColumns}
                    dataSource={notes}
                    size="small"
                    pagination={{ position: ['bottomRight'], pageSize: 10 }}
                />
            )}
        </>
    );
};

export default NoteArchiveTable;
