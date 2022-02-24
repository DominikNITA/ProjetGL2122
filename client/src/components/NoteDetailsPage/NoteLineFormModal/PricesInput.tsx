import { Form, InputNumber, Row, Space } from 'antd';
import { FormMode } from '../../../utility/common';

interface Props {
    formMode: FormMode;
}

const PricesInput = ({ formMode }: Props) => {
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
                            required: true,
                        },
                    ]}
                >
                    <InputNumber
                        min={0}
                        precision={2}
                        controls={false}
                        disabled={formMode == FormMode.View}
                    ></InputNumber>
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
                    ]}
                >
                    <InputNumber
                        min={0}
                        precision={2}
                        controls={false}
                        disabled={formMode == FormMode.View}
                    ></InputNumber>
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
                    ]}
                >
                    <InputNumber
                        min={0}
                        precision={2}
                        controls={false}
                        disabled={formMode == FormMode.View}
                    ></InputNumber>
                </Form.Item>
            </Space>
        </Row>
    );
};

export default PricesInput;
