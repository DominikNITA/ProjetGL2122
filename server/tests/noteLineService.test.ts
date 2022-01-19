import testUtility from './testUtility';
import dotenv from 'dotenv';

beforeAll(async () => {
    await testUtility.connectAndReinitializeTestDB();
    dotenv.config();
});

afterAll(() => {
    testUtility.closeConnection();
});

describe('NoteLineService', () => {
    describe('deletes noteLine when', () => {
        test('correct id is provided', async () => {
            expect('TODO').toBeDefined();
        });
    });
});

export {};
