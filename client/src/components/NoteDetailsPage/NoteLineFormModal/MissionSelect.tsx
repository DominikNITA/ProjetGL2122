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
    const [missionEntries, setMissionEntries] = useState<
        {
            value: string;
            label: string;
            key: string;
        }[]
    >([]);

    const [missions, setMissions] = useState<IMission[]>([]);

    const auth = useAuth();

    useEffect(() => {
        getMissionsByService(auth?.user?.service._id).then((resp) => {
            if (resp.isOk) {
                setMissions(resp.data!);
                setMissionEntries(
                    resp.data!.map((mission) => {
                        return {
                            key: mission._id,
                            value: mission._id,
                            label: `${mission.name} ${convertToDate(
                                mission.startDate
                            ).toLocaleDateString('fr')} - ${convertToDate(
                                mission.endDate
                            ).toLocaleDateString('fr')}`,
                        };
                    })
                );
            }
        });
    }, [auth]);

    const missionDatesSpan = (mission: IMission) => (
        <span style={{ fontSize: '0.85em', color: grey[3] }}>{`${convertToDate(
            mission.startDate
        ).toLocaleDateString('fr')} - ${convertToDate(
            mission.endDate
        ).toLocaleDateString('fr')}`}</span>
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
                            <span
                                style={{ fontSize: '0.85em', color: grey[3] }}
                            >{`${convertToDate(m.startDate).toLocaleDateString(
                                'fr'
                            )} - ${convertToDate(m.endDate).toLocaleDateString(
                                'fr'
                            )}`}</span>
                        </Space>
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
    );
};

export default MissionSelect;
