import { Space, Col, Divider, List } from 'antd';
import { useState, useEffect } from 'react';
import { getSubordinateAvancesForUserWithState } from '../clients/avanceClient';
import { getSubordinateNotesForUserWithState } from '../clients/noteClient';
import AvanceList from '../components/AvanceList';
import OpenValidation from '../components/Buttons/OpenValidation';
import NoteArchiveTable from '../components/NoteArchiveTable';
import NoteList from '../components/NoteList';
import { NoteState, AvanceState } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { IAvance, INote } from '../types';

const ValidationPage = () => {
    const [openNotes, setOpenNotes] = useState<INote[]>([]);
    const [openAvances, setOpenAvances] = useState<IAvance[]>([]);
    const [archiveNotes, setArchiveNotes] = useState<INote[]>([]);
    const [archiveAvances, setArchiveAvances] = useState<IAvance[]>([]);

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

        getSubordinateAvancesForUserWithState(auth!.user!._id, [
            AvanceState.Created,
        ]).then((response) => {
            if (response.isOk) {
                setOpenAvances(response!.data!);
            }
        });

        getSubordinateAvancesForUserWithState(auth!.user!._id, [
            AvanceState.Validated,
            AvanceState.Refused,
        ]).then((response) => {
            if (response.isOk) {
                setArchiveAvances(response!.data!);
            }
        });
    }, [auth]);

    return (
        <div>
            <Space direction="vertical" size={25} style={{ width: '100%' }}>
                <Col span={12} offset={6}>
                    <NoteList
                        notes={openNotes}
                        buttonText={() => <OpenValidation></OpenValidation>}
                        titleText="Notes a valider:"
                        noNotesMessage="Vous n'avez pas de notes a valider!"
                    ></NoteList>
                </Col>
            </Space>

            <Divider></Divider>

            <Space direction="vertical" size={25} style={{ width: '100%' }}>
                <Col span={12} offset={6}>
                    <AvanceList
                        avances={openAvances}
                        buttonText={() => 'Visualiser'}
                        titleText="Avances a valider:"
                        noAvancesMessage="Vous n'avez pas d'avances a valider!"
                        validate={true}
                    ></AvanceList>
                </Col>
            </Space>

            <Divider></Divider>
            <Space direction="vertical" size={25} style={{ width: '100%' }}>
                <Col span={12} offset={6}>
                    <NoteArchiveTable
                        notes={archiveNotes}
                        buttonText={() => 'Visualiser'}
                        titleText="Archive de notes des collaborateurs:"
                        noNotesMessage="L'archive de notes des collaborateurs est vide!"
                    ></NoteArchiveTable>
                </Col>
            </Space>

            <Space direction="vertical" size={25} style={{ width: '100%' }}>
                <Col span={12} offset={6}>
                    <AvanceList
                        avances={archiveAvances}
                        buttonText={() => 'Visualiser'}
                        titleText="Archive des avances des collaborateurs:"
                        noAvancesMessage="L'archive de avances des collaborateurs est vide!"
                        validate={false}
                    ></AvanceList>
                </Col>
            </Space>
        </div>
    );
};

export default ValidationPage;
