import { Button } from 'antd';
import { clearDB, initializeDB } from '../api';

const DevPage = () => {
    return (
        <div>
            <h1>Dev page</h1>
            <Button type="primary" onClick={async () => await clearDB()}>
                Clear DB
            </Button>
            <Button type="dashed" onClick={async () => await initializeDB()}>
                Initialize DB
            </Button>
        </div>
    );
};

export default DevPage;
