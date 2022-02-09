import { Form, FormInstance, Select } from 'antd';
import { useEffect, useState } from 'react';
import { FraisType } from '../../../enums';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';
import { getFrenchFraisType } from '../../../utility/common';
import PricesInput from './PricesInput';
import PricesKilometriquesInput from './PricesKilometriquesInput';

interface Props {
    form: FormInstance<any>;
}

const FraisTypeInput = (props: Props) => {
    const fraisTypesEntries = [];
    for (const value in FraisType) {
        if (!isNaN(Number(value))) {
            fraisTypesEntries.push({
                value: Number(value),
                label: getFrenchFraisType(Number(value)),
            });
        }
    }

    const [selectedType, setSelectedType] = useState<FraisType>(
        FraisType.Standard
    );

    useEffect(() => {
        setSelectedType(props.form.getFieldValue('fraisType'));
    }, [props.form.getFieldsValue(true)]);

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
                    <PricesKilometriquesInput
                        form={props.form}
                    ></PricesKilometriquesInput>
                )}
            </Form.Item>
        </>
    );
};

export default FraisTypeInput;
