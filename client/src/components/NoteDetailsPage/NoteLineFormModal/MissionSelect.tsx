import { Form, Select } from 'antd';
import { useEffect, useState } from 'react';
import { getMissionsByService } from '../../../clients/serviceClient';
import { useAuth } from '../../../stateProviders/authProvider';
import { IMission } from '../../../types';
import { FormMode } from '../../../utility/common';

interface Props {
    formMode: FormMode;
}

const MissionSelect = ({ formMode }: Props) => {
    const [missionEntries, setMissionEntries] = useState<
        {
            value: string;
            label: string;
        }[]
    >([]);

    const auth = useAuth();

    useEffect(() => {
        getMissionsByService(auth?.user?.service._id).then((resp) => {
            if (resp.isOk) {
                setMissionEntries(
                    resp.data!.map((mission) => {
                        return {
                            value: mission._id,
                            label: mission.name,
                        };
                    })
                );
            }
        });
    }, [auth]);

    return (
        <Form.Item
            name={['mission', '_id']}
            label="Mission"
            style={{ width: 250 }}
            rules={[
                {
                    required: true,
                    message: 'TODO: mission',
                },
            ]}
        >
            <Select
                options={missionEntries}
                disabled={formMode == FormMode.View}
            />
        </Form.Item>
    );
};

export default MissionSelect;
