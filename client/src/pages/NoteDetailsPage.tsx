import { blue, red } from '@ant-design/colors';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, List, Popconfirm, Row, Space, Table, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getNote, getNotesForUser } from '../clients/noteClient';
import ModifyNoteLineModal from '../components/ModifyNoteLineModal';
import { NoteState } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import {
    SelectedNoteLineProvider,
    useSelectedNoteLine,
} from '../stateProviders/selectedNoteLineProvider';
import { INote, INoteLine, IMission } from '../types';
import { getFrenchMonth, getFrenchNoteState } from '../utility/common';

const NoteDetailsPage = () => {
    const [note, setNote] = useState<INote | null>(null);
    const [noteLines, setNoteLines] = useState<INoteLine[]>([]);
    const [titleText, setTitleText] = useState('');
    const auth = useAuth();
    const selectedNoteLine = useSelectedNoteLine();
    const params = useParams();
    useEffect(() => {
        getNote(params.noteId!).then((response) => {
            if (response?.isOk) {
                setNote(response!.data!);
                setNoteLines(response.data!.noteLines!);
                console.log(response!.data!);
                setTitleText(
                    `Note de frais de ${getFrenchMonth(
                        response!.data!.month
                    )} ${response!.data!.year}`
                );
            } else {
                //TODO: Redirect to notes? Show some message?
            }
        });
    }, [auth, params.noteId, selectedNoteLine.reloadHack]);

    const modifyNoteLineModalRef = useRef<any>();

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: Date) => {
                const correctDate = new Date(
                    Date.parse(date as unknown as string)
                );
                return <span>{correctDate.toLocaleDateString('fr')}</span>;
            },
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: 'Mission',
            dataIndex: 'mission',
            key: 'mission',
            render: (mission: IMission) => <span>{mission?.name}</span>,
        },
        {
            title: 'TTC',
            dataIndex: 'ttc',
            key: 'ttc',
            render: (num: number) => <span>{num.toFixed(2)}</span>,
        },
        {
            title: 'TVA',
            dataIndex: 'tva',
            key: 'tva',
            render: (num: number) => <span>{num.toFixed(2)}</span>,
        },
        {
            title: 'HT',
            dataIndex: 'ht',
            key: 'ht',
            render: (num: number) => <span>{num.toFixed(2)}</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: any, record: INoteLine) => (
                <Space size="middle">
                    <Button
                        style={{ color: blue.primary }}
                        onClick={() => {
                            console.log(selectedNoteLine);
                            selectedNoteLine?.updateNoteLine(record);
                            modifyNoteLineModalRef.current?.showModal();
                        }}
                    >
                        Modifier
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this task?"
                        onConfirm={() => console.log('Delete note line : TODO')}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button style={{ color: red.primary }}>
                            Supprimer
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <h2>{titleText}</h2>
            <Table
                columns={columns}
                dataSource={noteLines}
                size="small"
                pagination={false}
            />
            <ModifyNoteLineModal
                ref={modifyNoteLineModalRef}
            ></ModifyNoteLineModal>
        </>
    );
};

export default NoteDetailsPage;
