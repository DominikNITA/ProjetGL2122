import { blue, red } from '@ant-design/colors';
import {
    BarChartOutlined,
    CheckOutlined,
    CloseCircleOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    InfoOutlined,
    YuqueOutlined,
} from '@ant-design/icons';
import { Space, Button, Popconfirm } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import { deleteMission } from '../../clients/missionClient';
import { changeNoteLineState } from '../../clients/noteClient';
import {
    MissionState,
    NoteLineState,
    NoteState,
    NoteViewMode,
    UserRole,
} from '../../enums';
import { useAuth } from '../../stateProviders/authProvider';
import { useNoteDetailsManager } from '../../stateProviders/noteDetailsManagerProvider';
import { useSelectedMission } from '../../stateProviders/selectedMissionProvider';
import { IMission, INoteLine } from '../../types';
import { FormMode } from '../../utility/common';
import CancelButton from '../CancelButton';
import ValidateButton from '../ValidateButton';

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
        <Button
            style={{ color: blue.primary }}
            onClick={() => {
                selectedMission.updateMission(mission);
                openStatisticsModal();
            }}
        >
            <BarChartOutlined></BarChartOutlined>
        </Button>
    );

    const editButton = (
        <Button
            style={{ color: blue.primary }}
            onClick={() => {
                selectedMission.updateMission(mission);
                openModifyModal(FormMode.Modification);
            }}
        >
            <EditOutlined></EditOutlined>
        </Button>
    );

    const deleteButton = (
        <Popconfirm
            title="Supprimer cette mission?"
            onConfirm={() => {
                deleteMission(mission._id).then((x) => {
                    if (x.isOk) {
                        selectedMission.reload();
                    }
                });
            }}
            okText="Oui"
            cancelText="Non"
        >
            <Button style={{ color: red.primary }}>
                <DeleteOutlined></DeleteOutlined>
            </Button>
        </Popconfirm>
    );

    const createNoteLineButton = <Button>Demander un remboursement</Button>;

    const createAvanceButton = <Button>Demander une avance</Button>;

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
