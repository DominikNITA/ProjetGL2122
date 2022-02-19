import { grey } from '@ant-design/colors';
import { Form, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { getMissionsByService } from '../../../clients/serviceClient';
import { useAuth } from '../../../stateProviders/authProvider';
import { IMission } from '../../../types';
import { convertToDate, FormMode } from '../../../utility/common';

interface Props {
    formMode: FormMode;
    selectedMission?: IMission;
    onChange: (mission: IMission) => void;
}

const MissionSelect = ({ formMode, selectedMission, onChange }: Props) => {
    const [missions, setMissions] = useState<IMission[]>([]);

    const auth = useAuth();

    useEffect(() => {
        getMissionsByService(auth?.user?.service._id).then((resp) => {
            if (resp.isOk) {
                setMissions(resp.data!);
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
