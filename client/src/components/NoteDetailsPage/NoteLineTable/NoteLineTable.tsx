import { Col, Collapse } from 'antd';
import { useEffect, useState } from 'react';
import { IMission, INoteLine } from '../../../types';
import { FormMode } from '../../../utility/common';
import MissionPanel from './MissionPanel';

import './noteLineTable.css';

type Props = {
    noteLines: INoteLine[];
    openModifyModal: (formMode: FormMode) => void;
    openJustificatifPreview: (src: string | null) => void;
    openCommentModal: (noteLinesToComment: INoteLine[]) => void;
};

const NoteLineTable = ({
    noteLines,
    openModifyModal,
    openJustificatifPreview,
    openCommentModal,
}: Props) => {
    const [uniqueMissions, setUniqueMissions] = useState<IMission[]>([]);
    useEffect(() => {
        const uniqueMissionsTemp: IMission[] = [];
        noteLines.forEach((noteLine) => {
            if (
                !uniqueMissionsTemp.some((x) => x._id === noteLine.mission._id)
            ) {
                uniqueMissionsTemp.push(noteLine.mission);
            }
        });
        setUniqueMissions(uniqueMissionsTemp);
    }, [noteLines]);

    return (
        <Col>
            <Collapse>
                {uniqueMissions.map((mission) => (
                    <MissionPanel
                        mission={mission}
                        noteLines={noteLines.filter(
                            (x) => x.mission._id === mission._id
                        )}
                        openCommentModal={openCommentModal}
                        openJustificatifPreview={openJustificatifPreview}
                        openModifyModal={openModifyModal}
                    ></MissionPanel>
                ))}
            </Collapse>
        </Col>
    );
};

export default NoteLineTable;
