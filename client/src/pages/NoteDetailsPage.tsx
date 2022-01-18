import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, List, Row, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getNotesForUser } from '../clients/noteClient';
import { NoteState } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { INote } from '../types';
import { getFrenchMonth } from '../utility/common';

const NoteDetailsPage = () => {
    const params = useParams();
    return <div>Note details for {params.noteId}</div>;
};

export default NoteDetailsPage;
