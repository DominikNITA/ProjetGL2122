import { Button, Space } from 'antd';
import { clearDB, clearUploadFolder, initializeDB } from '../clients/devClient';

const DevPage = () => {
    return (
        <div>
            <h1>Dev page</h1>
            <Space size="large">
                <Button
                    type="dashed"
                    onClick={async () => await clearUploadFolder()}
                >
                    Clear Upload folder (justificatifs)
                </Button>
                <Button type="dashed" onClick={async () => await clearDB()}>
                    Clear DB
                </Button>
                <Button
                    type="primary"
                    onClick={async () => await initializeDB()}
                >
                    Initialize DB
                </Button>
            </Space>
        </div>
    );
};

export default DevPage;
