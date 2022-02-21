import { Form, FormInstance, Select } from 'antd';
import { useEffect, useState } from 'react';
import { FraisType } from '../../../enums';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';
import { FormMode, getFrenchFraisType } from '../../../utility/common';
import PricesInput from './PricesInput';
import PricesKilometriquesInput from './PricesKilometriquesInput';

interface Props {
    form: FormInstance<any>;
    formMode: FormMode;
    selectedFraisType: FraisType;
    onChange: (fraisType: FraisType) => void;
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
                        onChange={(value: number) => props.onChange(value)}
                        disabled={props.formMode == FormMode.View}
                    />
                </Form.Item>
                {props.selectedFraisType == FraisType.Standard && (
                    <PricesInput formMode={props.formMode}></PricesInput>
                )}
                {props.selectedFraisType == FraisType.Kilometrique && (
                    <PricesKilometriquesInput
                        form={props.form}
                        formMode={props.formMode}
                    ></PricesKilometriquesInput>
                )}
            </Form.Item>
        </>
    );
};

export default FraisTypeInput;
