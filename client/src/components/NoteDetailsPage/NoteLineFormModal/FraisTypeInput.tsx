import { Form, FormInstance, Select } from 'antd';
import { useEffect, useState } from 'react';
import { getAllExpenseCategories } from '../../../clients/expenseCategoryClient';
import { ExpenseType } from '../../../enums';
import { useAuth } from '../../../stateProviders/authProvider';
import { useNoteDetailsManager } from '../../../stateProviders/noteDetailsManagerProvider';
import { IExpenseCategory } from '../../../types';
import { FormMode } from '../../../utility/common';
import PricesInput from './PricesInput';
import PricesKilometriquesInput from './PricesKilometriquesInput';

interface Props {
    form: FormInstance<any>;
    formMode: FormMode;
    selectedFraisType?: IExpenseCategory;
    onChange: (fraisType: IExpenseCategory) => void;
}

const FraisTypeInput = (props: Props) => {
    const [expenseCategories, setExpenseCategories] = useState<
        IExpenseCategory[]
    >([]);

    const auth = useAuth();
    const noteDetailsManager = useNoteDetailsManager();
    useEffect(() => {
        getAllExpenseCategories().then((resp) => {
            if (resp.isOk) {
                setExpenseCategories(resp.data!);
            }
        });
    }, [auth]);
    // const fraisTypesEntries = [];
    // for (const value in FraisType) {
    //     if (!isNaN(Number(value))) {
    //         fraisTypesEntries.push({
    //             value: Number(value),
    //             label: getFrenchFraisType(Number(value)),
    //         });
    //     }
    // }

    return (
        <>
            <Form.Item shouldUpdate>
                <Form.Item
                    name={['expenseCategory', '_id']}
                    label="Type de frais"
                    style={{ width: 250 }}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        options={expenseCategories.map((exp) => {
                            return { value: exp._id, label: exp.name };
                        })}
                        onChange={(value: string) =>
                            props.onChange(
                                expenseCategories.find(
                                    (exp) => exp._id == value
                                )!
                            )
                        }
                        disabled={props.formMode == FormMode.View}
                    />
                </Form.Item>
                {props.selectedFraisType?.expenseType ==
                    ExpenseType.Standard && (
                    <PricesInput formMode={props.formMode}></PricesInput>
                )}
                {props.selectedFraisType?.expenseType ==
                    ExpenseType.Kilometrique && (
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
