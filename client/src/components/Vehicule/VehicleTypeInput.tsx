import { Checkbox, Form, Select } from 'antd';
import { useState } from 'react';
import { VehicleType } from '../../enums';
import { getFrenchVehicleType } from '../../utility/common';

const VehicleTypeInput = () => {
    const vehicleTypesEntries = [];
    for (const value in VehicleType) {
        if (!isNaN(Number(value))) {
            vehicleTypesEntries.push({
                value: Number(value),
                label: getFrenchVehicleType(Number(value)),
            });
        }
    }

    const [selectedType, setSelectedType] = useState<VehicleType>(
        VehicleType.Car
    );

    return (
        <>
            <Form.Item shouldUpdate>
                <Form.Item
                    name="type"
                    label="Type de vehicule"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        options={vehicleTypesEntries}
                        onChange={(value: number) => setSelectedType(value)}
                    />
                </Form.Item>
                {selectedType == VehicleType.Car && (
                    <Form.Item name="isElectric" valuePropName="checked">
                        <Checkbox>Voiture electrique?</Checkbox>
                    </Form.Item>
                )}
            </Form.Item>
        </>
    );
};

export default VehicleTypeInput;
