import { Row, Col } from 'antd';
import React, { ReactNode } from 'react';

type Props = {
    children: ReactNode;

    xs?: number;
    sm?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
};

const ResponsiveColumn = ({ children, xs, sm, lg, xl, xxl }: Props) => {
    return (
        <Row justify="center">
            <Col
                xs={xs ?? 24}
                sm={sm ?? 20}
                lg={lg ?? 12}
                xl={xl ?? 10}
                xxl={xxl ?? 8}
            >
                {children}
            </Col>
        </Row>
    );
};

export default ResponsiveColumn;
