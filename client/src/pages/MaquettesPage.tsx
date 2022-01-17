import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Row, List, Tag, Space } from 'antd';

const MesNotesMaquette = () => {
    const exampleNotes = [
        {
            text: 'Janvier 2022',
            state: <Tag color="lime">En constitution</Tag>,
            action: 'Modifier',
        },
        {
            text: 'Decembre 2021',
            state: <Tag color="orange">Correction</Tag>,
            action: 'Corriger',
        },
        {
            text: 'Novembre 2021',
            state: <Tag color="blue">Validation</Tag>,
            action: 'Visualiser',
        },
    ];
    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <h2 style={{ textAlign: 'center' }}>Mes notes:</h2>
            <Col span={12} offset={6}>
                <List
                    size="large"
                    bordered
                    dataSource={exampleNotes}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                item.state,
                                <a href="#test">{item.action}</a>,
                            ]}
                            onClick={() => console.log('See details')}
                            key={'test'}
                        >
                            {item.text}
                        </List.Item>
                    )}
                />
            </Col>
            <Row justify="center">
                <Button type="primary" icon={<PlusCircleOutlined />}>
                    Ajouter une note
                </Button>
            </Row>
        </Space>
    );
};

const NoteArchiveMaquette = () => {
    const exampleNotes = [
        {
            text: 'Octobre 2021',
            state: <Tag color="lime">En constitution</Tag>,
            action: 'Visualiser',
        },
        {
            text: 'Septembre 2021',
            state: <Tag color="orange">Correction</Tag>,
            action: 'Visualiser',
        },
        {
            text: 'Juiller 2021',
            state: <Tag color="blue">Validation</Tag>,
            action: 'Visualiser',
        },
    ];
    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>Archive de notes:</h2>
            <Col span={12} offset={6}>
                <List
                    size="large"
                    bordered
                    dataSource={exampleNotes}
                    renderItem={(item) => (
                        <List.Item
                            actions={[<a href="#test">{item.action}</a>]}
                            onClick={() => console.log('See details')}
                            key={'test'}
                        >
                            {item.text}
                        </List.Item>
                    )}
                />
            </Col>
        </div>
    );
};

const MaquettesPage = () => {
    return (
        <div>
            <Space direction="vertical" style={{ width: '100%' }} size={40}>
                <MesNotesMaquette />
                <NoteArchiveMaquette></NoteArchiveMaquette>
            </Space>
        </div>
    );
};

export default MaquettesPage;
