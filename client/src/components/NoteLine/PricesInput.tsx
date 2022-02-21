import { Form, InputNumber, Row, Space } from 'antd';

const PricesInput = () => {
    return (
        <Row>
            <Space>
                <Form.Item
                    name="ttc"
                    label="TTC"
                    trigger="onBlur"
                    validateTrigger="onBlur"
                    rules={[
                        {
                            required: false,
                        },
                        ({ getFieldValue, setFieldsValue }) => ({
                            validator(_, value) {
                                const ttc = value;
                                const ht = getFieldValue('ht');
                                const tva = getFieldValue('tva');

                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <InputNumber min={0} step={0.01}></InputNumber>
                </Form.Item>
                <Form.Item
                    name="tva"
                    label="TVA"
                    trigger="onBlur"
                    validateTrigger="onBlur"
                    rules={[
                        {
                            required: false,
                        },
                        ({ getFieldValue, setFieldsValue }) => ({
                            validator(_, value) {
                                const ttc = getFieldValue('ttc');
                                const ht = getFieldValue('ht');
                                const tva = value;
                                // if (ht + tva != ttc) {
                                //     return Promise.reject(
                                //         new Error('Big problem!!!')
                                //     );
                                // }
                                // if (ttc == null && ht != null) {
                                //     setFieldsValue({
                                //         ttc: ht + parseFloat(tva),
                                //     });
                                // }
                                // if (ht == null && ttc != null) {
                                //     setFieldsValue({
                                //         ht: ttc - parseFloat(tva),
                                //     });
                                // }
                                // if (ttc != null && ht != null) {
                                //     setFieldsValue({
                                //         ttc: ht + parseFloat(tva),
                                //     });
                                // }

                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <InputNumber min={0} step={0.01}></InputNumber>
                </Form.Item>
                <Form.Item
                    name="ht"
                    label="HT"
                    trigger="onBlur"
                    validateTrigger="onBlur"
                    rules={[
                        {
                            required: false,
                        },
                        ({ getFieldValue, setFieldsValue }) => ({
                            validator(_, value) {
                                // if (value < 0) {
                                //     return Promise.reject(
                                //         new Error('Ne peut pas etre negatif')
                                //     );
                                // }

                                const ttc = getFieldValue('ttc');
                                const ht = getFieldValue('ht');
                                const tva = value;

                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <InputNumber min={0} step={0.01}></InputNumber>
                </Form.Item>
            </Space>
        </Row>
    );
};

export default PricesInput;
