import { Modal, Row, Space } from 'antd';
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import { getNoteLinesForMission } from '../../../clients/missionClient';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';
import { useSelectedMission } from '../../../stateProviders/selectedMissionProvider';
import { INoteLine } from '../../../types';
import { FormMode } from '../../../utility/common';
import FraisTypePiePlot from './FraisTypePiePlot';
import NoteLinesDatesChart from './NoteLinesDatesChart';

type Props = {};

const StatisticsMissionModal = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(true);

    const selectedMission = useSelectedMission();

    const [titleText, setTitleText] = useState('');

    const [noteLines, setNoteLines] = useState<INoteLine[]>([]);

    useEffect(() => {
        if (selectedMission.mission == null) return;
        setTitleText(`Statistiques pour ${selectedMission.mission.name}`);
        getNoteLinesForMission(selectedMission.mission._id).then((resp) => {
            if (resp.isOk) {
                setNoteLines(resp.data!);
            }
        });
    }, [selectedMission.mission]);

    useImperativeHandle(ref, () => ({
        showModal() {
            setVisible(true);
        },
    }));

    const handleQuit = () => {
        setVisible(false);
    };
    return (
        <Modal
            title={titleText}
            visible={visible}
            confirmLoading={confirmLoading}
            onCancel={handleQuit}
            // width={'90%'}
        >
            <Space direction="horizontal">
                <FraisTypePiePlot noteLines={noteLines}></FraisTypePiePlot>
                <NoteLinesDatesChart
                    noteLines={noteLines}
                ></NoteLinesDatesChart>
            </Space>
        </Modal>
    );
});

export default StatisticsMissionModal;
