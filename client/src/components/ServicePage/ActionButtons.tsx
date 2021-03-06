import { blue, purple, red } from '@ant-design/colors';
import {
    BarChartOutlined,
    DeleteOutlined,
    EditOutlined,
} from '@ant-design/icons';
import { Space, Button, Popconfirm } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import { deleteMission } from '../../clients/missionClient';
import { MissionState, UserRole } from '../../enums';
import { useAuth } from '../../stateProviders/authProvider';
import { useSelectedMission } from '../../stateProviders/selectedMissionProvider';
import { IMission } from '../../types';
import { FormMode } from '../../utility/common';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import StatisticsButton from '../Buttons/StatisticsButton';

type Props = {
    openModifyModal: (formMode: FormMode) => void;
    openStatisticsModal: () => void;
    mission: IMission;
};

const ActionButtons = ({
    mission,
    openModifyModal,
    openStatisticsModal,
}: Props) => {
    const selectedMission = useSelectedMission();
    const auth = useAuth();

    const statisticsButton = (
        <StatisticsButton
            onClick={() => {
                selectedMission.updateMission(mission);
                openStatisticsModal();
            }}
        ></StatisticsButton>
    );

    const editButton = (
        <EditButton
            onClick={() => {
                selectedMission.updateMission(mission);
                openModifyModal(FormMode.Modification);
            }}
        ></EditButton>
    );

    const deleteButton = (
        <DeleteButton
            popConfirmTitle="Supprimer cette mission?"
            onConfirm={() => {
                deleteMission(mission._id).then((x) => {
                    if (x.isOk) {
                        selectedMission.reload();
                    }
                });
            }}
        ></DeleteButton>
    );

    const createNoteLineButton = (
        <Button disabled>Demander un remboursement</Button>
    );

    const createAvanceButton = <Button disabled>Demander une avance</Button>;

    const [buttonsToDisplay, setButtonsToDisplay] = useState<ReactNode[]>([]);

    useEffect(() => {
        let buttons = [];
        const isLeader = () => auth?.user?.roles.includes(UserRole.Leader);
        if (isLeader()) {
            buttons.push(statisticsButton);
            buttons.push(editButton);
            buttons.push(deleteButton);
        }
        switch (mission.state) {
            case MissionState.NotStarted:
                buttons.push(createAvanceButton);
                break;
            case MissionState.InProgress:
                buttons.push(createNoteLineButton);
                break;
            case MissionState.Finished:
                buttons.push(createNoteLineButton);
                break;
            case MissionState.Cancelled:
                if (isLeader()) {
                    buttons = buttons.filter((x) => x != deleteButton);
                }
                break;
            default:
                break;
        }
        setButtonsToDisplay(buttons);
    }, [selectedMission.mission, mission]);

    return <Space size="small">{buttonsToDisplay.map((x) => x)}</Space>;
};

export default ActionButtons;
