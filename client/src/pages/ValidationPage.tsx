import { Space, Col, Divider } from 'antd';
import { useState, useEffect } from 'react';
import { getSubordinateNotesForUserWithState } from '../clients/noteClient';
import NoteArchiveTable from '../components/NoteArchiveTable';
import NoteList from '../components/NoteList';
import { NoteState } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { INote } from '../types';

const ValidationPage = () => {
    const [openNotes, setOpenNotes] = useState<INote[]>([]);
    const [archiveNotes, setArchiveNotes] = useState<INote[]>([]);
    const auth = useAuth();
    useEffect(() => {
        if (auth?.user?._id == null) return;

        getSubordinateNotesForUserWithState(auth!.user!._id, [
            NoteState.Fixing,
            NoteState.InValidation,
        ]).then((response) => {
            if (response.isOk) {
                setOpenNotes(
                    response!.data!.sort(
                        (x) => -(x.year * 1000 + x.month.valueOf())
                    )
                );
            }
        });
        getSubordinateNotesForUserWithState(
            auth!.user!._id,
            [NoteState.Validated, NoteState.Completed],
            10,
            1
        ).then((response) => {
            if (response.isOk) {
                setArchiveNotes(
                    response!.data!.sort(
                        (x) => -(x.year * 1000 + x.month.valueOf())
                    )
                );
            }
        });
    }, [auth]);

    return (
        <div>
            <Space direction="vertical" size={25} style={{ width: '100%' }}>
                <Col span={12} offset={6}>
                    <NoteList
                        notes={openNotes}
                        buttonText={() => 'Valider'}
                        titleText="Notes a valider:"
                        noNotesMessage="Vous n'avez pas de notes a valider!"
                    ></NoteList>
                </Col>
            </Space>

            <Divider></Divider>
            <Space direction="vertical" size={25} style={{ width: '100%' }}>
                <Col span={12} offset={6}>
                    <NoteArchiveTable
                        notes={archiveNotes}
                        buttonText={() => 'Visualiser'}
                        titleText="Archive de notes des collaborants:"
                        noNotesMessage="L'archive de notes des collaborants est vide!"
                    ></NoteArchiveTable>
                </Col>
            </Space>
        </div>
    );
};

export default ValidationPage;
