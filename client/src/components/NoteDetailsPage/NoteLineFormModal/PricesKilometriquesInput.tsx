import {
    Form,
    FormInstance,
    InputNumber,
    message,
    Row,
    Select,
    Space,
} from 'antd';
import { useEffect, useState } from 'react';
import { getCalculatedPrice } from '../../../clients/noteClient';
import { getVehiclesForUser } from '../../../clients/vehicleClient';
import { useAuth } from '../../../stateProviders/authProvider';

interface Props {
    form: FormInstance<any>;
}

const PricesKilometriquesInput = ({ form }: Props) => {
    const auth = useAuth();
    const [vehiclesEntries, setVehiclesEntries] = useState<
        {
            value: any;
            label: string;
        }[]
    >([]);

    useEffect(() => {
        getVehiclesForUser(auth?.user?._id).then((x) => {
            if (x.isOk) {
                if (x.data?.length == 0) {
                    message.error('OUPSIE!');
                }
                const temp: { value: any; label: string }[] = [];

                x.data?.forEach((vehicle) => {
                    temp.push({
                        value: vehicle._id,
                        label: `${vehicle.description} (${vehicle.horsePower} CF)`,
                    });
                });

                setVehiclesEntries(temp);
            } else {
                message.error('OUPSIE!');
            }
        });
    }, []);

    useEffect(() => {
        updateCalculatedPrice();
    }, [form.getFieldValue('kilometerCount')]);

    useEffect(() => {
        if (vehiclesEntries.length == 1) {
            form.setFieldsValue({ vehicle: vehiclesEntries[0].value });
        }
    }, [vehiclesEntries]);

    const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

    async function updateCalculatedPrice() {
        const vehicle = form.getFieldValue('vehicle');
        const kilometerCount = form.getFieldValue('kilometerCount');
        if (vehicle == null && kilometerCount == null) return;
        getCalculatedPrice(
            vehicle,
            kilometerCount,
            form.getFieldValue('date') ?? Date.now()
        ).then((x) => {
            if (x.isOk) {
                setCalculatedPrice(x.data!);
            }
        });
    }

    return (
        <>
            <Form.Item
                name="vehicle"
                label="Vehicule"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select
                    options={vehiclesEntries}
                    onChange={updateCalculatedPrice}
                />
            </Form.Item>
            <Space size={'large'} direction={'horizontal'}>
                <Form.Item
                    name="kilometerCount"
                    label="Distance (km)"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <InputNumber
                        min={0}
                        precision={0}
                        controls={false}
                        onChange={updateCalculatedPrice}
                    ></InputNumber>
                </Form.Item>
                <Form.Item label="Cout calcule">
                    <InputNumber
                        disabled
                        value={calculatedPrice}
                        precision={2}
                    ></InputNumber>
                </Form.Item>
            </Space>
        </>
    );
};

export default PricesKilometriquesInput;
