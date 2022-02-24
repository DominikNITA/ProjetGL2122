import testUtility from './testUtility';
import avanceService from '../src/services/avanceService';
import dotenv from 'dotenv';
import { MissionModel } from '../src/models/mission';
import { UserModel } from '../src/models/user';
import { InvalidParameterValue } from '../src/utility/errors';
import { AvanceState } from '../../shared/enums';

beforeAll(async () => {
    await testUtility.connectAndReinitializeTestDB();
    dotenv.config();
});

afterAll(() => {
    testUtility.closeConnection();
});

describe('AvanceService', () => {
    describe('creates avance when', () => {
        test('correct data is provided', async () => {
            const mission = await MissionModel.findOne();
            const user = await UserModel.findOne();
            const avance = await avanceService.createAvance({
                owner: user?._id,
                description: 'Ceci est une description',
                mission: mission?._id,
                amount: 150,
            });
            expect(avance).toBeDefined();
            expect(avance?._id).toBeDefined();
        });
    });
    describe('reject avance creation when', () => {
        test('wrong data is provided', async () => {
            try {
                const mission = await MissionModel.findOne();
                const user = await UserModel.findOne();
                await avanceService.createAvance({
                    owner: user?._id,
                    description: 'Ceci est une description',
                    mission: mission?._id,
                    amount: -15,
                });
            } catch (error: unknown) {
                expect(error).toBeInstanceOf(InvalidParameterValue);
            }
        });
    });
    describe('update avance state', () => {
        test('correct data is provided', async () => {
            const mission = await MissionModel.findOne();
            const user = await UserModel.findOne();
            const avance = await avanceService.createAvance({
                owner: user?._id,
                description: 'Ceci est une description',
                mission: mission?._id,
                amount: 150,
            });
            await avanceService.setAvanceState(
                avance?._id,
                AvanceState.Validated
            );
            const newAvance = await avanceService.getAvanceById(avance?._id);
            expect(newAvance?.state).toBe(AvanceState.Validated);
        });
    });
    describe('refuse to update avance state', () => {
        test('avance data state is already validated or refused', async () => {
            const mission = await MissionModel.findOne();
            const user = await UserModel.findOne();
            const avance1 = await avanceService.createAvance({
                owner: user?._id,
                description: 'Ceci est une description 1',
                mission: mission?._id,
                amount: 150,
            });
            const avance2 = await avanceService.createAvance({
                owner: user?._id,
                description: 'Ceci est une description 2',
                mission: mission?._id,
                amount: 150,
            });
            await avanceService.setAvanceState(
                avance1?._id,
                AvanceState.Validated
            );
            await avanceService.setAvanceState(
                avance2?._id,
                AvanceState.Refused
            );

            try {
                await avanceService.setAvanceState(
                    avance1?._id,
                    AvanceState.Refused
                );
            } catch (error: unknown) {
                expect(error).toBeInstanceOf(InvalidParameterValue);
            }
            try {
                await avanceService.setAvanceState(
                    avance2?._id,
                    AvanceState.Validated
                );
            } catch (error: unknown) {
                expect(error).toBeInstanceOf(InvalidParameterValue);
            }
        });
    });
});
