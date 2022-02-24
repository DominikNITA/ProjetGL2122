import { grey } from '@ant-design/colors';
import { Form, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { getMissionsByService } from '../../../clients/serviceClient';
import { MissionState } from '../../../enums';
import { useAuth } from '../../../stateProviders/authProvider';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';
import { IMission } from '../../../types';
import { FormMode } from '../../../utility/common';

interface Props {
    formMode: FormMode;
    selectedMission?: IMission;
    onChange: (mission: IMission) => void;
}

const MissionSelect = ({ formMode, selectedMission, onChange }: Props) => {
    const [missions, setMissions] = useState<IMission[]>([]);

    const auth = useAuth();
    const noteDetailsManager = useNoteDetailsManager();
    useEffect(() => {
        getMissionsByService(
            noteDetailsManager.currentNote?.owner.service as any
        ).then((resp) => {
            if (resp.isOk) {
                setMissions(
                    resp.data!.filter((m) =>
                        [
                            MissionState.InProgress,
                            MissionState.Finished,
                        ].includes(m.state)
                    )
                );
            }
        });
    }, [auth]);

    const missionDatesSpan = (mission: IMission) => (
        <span
            style={{ fontSize: '0.85em', color: grey[3] }}
        >{`${mission.startDate.format('LL')} - ${mission.endDate.format(
            'LL'
        )}`}</span>
    );

    return (
        <Form.Item
            name={['mission', '_id']}
            label="Mission"
            style={{ width: 350 }}
            rules={[
                {
                    required: true,
                    message: 'TODO: mission',
                },
            ]}
        >
            <Select
                disabled={formMode == FormMode.View}
                onChange={(e) => {
                    onChange(missions.find((x) => x._id == e)!);
                }}
                optionLabelProp="label"
            >
                {missions.map((m) => (
                    <Select.Option value={m._id} key={m._id} label={m.name}>
                        <Space direction="vertical" size={0}>
                            <strong>{m.name}</strong>
                            {missionDatesSpan(m)}
                        </Space>
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
    );
};

export default MissionSelect;
