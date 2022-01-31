import { Alert, Form, FormInstance, Select } from 'antd';
import { useEffect, useState } from 'react';
import { FraisType } from '../../enums';
import { useSelectedNoteLine } from '../../stateProviders/selectedNoteLineProvider';
import { getFrenchFraisType } from '../../utility/common';
import PricesInput from './PricesInput';

const ModifyNoteLineModal = () => {
    const fraisTypesEntries = [];
    for (const value in FraisType) {
        if (!isNaN(Number(value))) {
            fraisTypesEntries.push({
                value: Number(value),
                label: getFrenchFraisType(Number(value)),
            });
        }
    }

    const [selectedType, setSelectedType] = useState<FraisType>();
    const selectedNoteLine = useSelectedNoteLine();
    useEffect(() => {
        console.log(selectedNoteLine?.noteLine);
        if (selectedNoteLine?.noteLine?.fraisType != null) {
            setSelectedType(selectedNoteLine?.noteLine?.fraisType);
        }
    }, [selectedNoteLine?.noteLine]);

    return (
        <>
            <Form.Item shouldUpdate>
                <Form.Item
                    name="fraisType"
                    label="Type de frais"
                    style={{ width: 250 }}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        options={fraisTypesEntries}
                        onChange={(value: number) => setSelectedType(value)}
                    />
                </Form.Item>
                {selectedType == FraisType.Standard && (
                    <PricesInput></PricesInput>
                )}
                {selectedType == FraisType.Kilometrique && (
                    <Alert
                        type="warning"
                        message="Not implemented yet!!!"
                    ></Alert>
                )}
            </Form.Item>
        </>
    );
};

export default ModifyNoteLineModal;
