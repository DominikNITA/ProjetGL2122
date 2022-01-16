import testUtility from './testUtility';
import dotenv from 'dotenv';
import noteService from '../src/services/noteService';
import userService from '../src/services/userService';
import { InvalidParameterValue } from '../src/utility/errors';

beforeAll(async () => {
    await testUtility.connectAndReinitializeTestDB();
    dotenv.config();
});

afterAll(() => {
    testUtility.closeConnection();
});

describe('NoteService', () => {
    describe('creates note when', () => {
        test('correct data is provided', async () => {
            const collab = await userService.getUserByEmail(
                testUtility.getEmailForTestUser(2)
            );
            const note = await noteService.createNote({
                owner: collab?._id,
                year: 2021,
                month: 2,
            });
            expect(note).toBeDefined();
            expect(note!._id).toBeDefined();
        });
    });
    describe('rejects note creation when', () => {
        test('user already has a note for given month', async () => {
            expect.assertions(1);
            try {
                const collab = await userService.getUserByEmail(
                    testUtility.getEmailForTestUser(1)
                );
                await noteService.createNote({
                    owner: collab?._id,
                    year: 2021,
                    month: 2,
                });
                await noteService.createNote({
                    owner: collab?._id,
                    year: 2021,
                    month: 2,
                });
            } catch (error: any) {
                expect(error).toBeInstanceOf(InvalidParameterValue);
            }
        });
        //TODO: add test for invalid month (ex. 13 or 9999)
    });

    //TODO: add more tests -> flemme pour le moment xD
});

export {};
