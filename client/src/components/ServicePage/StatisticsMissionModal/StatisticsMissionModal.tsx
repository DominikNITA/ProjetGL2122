import { Modal } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';
import { useSelectedMission } from '../../../stateProviders/selectedMissionProvider';
import { FormMode } from '../../../utility/common';
import FraisTypePiePlot from './FraisTypePiePlot';

type Props = {};

const StatisticsMissionModal = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(true);

    const selectedMission = useSelectedMission();

    const [titleText, setTitleText] = useState('');

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
        >
            <FraisTypePiePlot></FraisTypePiePlot>
        </Modal>
    );
});

export default StatisticsMissionModal;
