import testUtility from './testUtility';
import missionService from '../src/services/missionService';
import dotenv from 'dotenv';
import { ServiceModel } from '../src/models/service';
import { InvalidParameterValue } from '../src/utility/errors';
import { MissionModel } from '../src/models/mission';

beforeAll(async () => {
    await testUtility.connectAndReinitializeTestDB();
    dotenv.config();
});

afterAll(() => {
    testUtility.closeConnection();
});

describe('MissionService', () => {
    describe('creates service when', () => {
        test('correct data is provided', async () => {
            const service = await ServiceModel.findOne();
            const mission = await missionService.createMission({
                name: 'testMission',
                description: 'Ceci est une description',
                service: service?._id,
                startDate: new Date(2022, 0, 15), //15 janv 2022
                endDate: new Date(2022, 1, 15), //15 fevr 2022
            });
            expect(mission).toBeDefined();
            expect(mission?._id).toBeDefined();
            expect(mission?.name).toBe('testMission');
        });
    });
    describe('rejects mission creation when', () => {
        test('mission with same name already exists in the same service', async () => {
            try {
                const service = await ServiceModel.findOne();
                await missionService.createMission({
                    name: 'testMission2',
                    description: 'Ceci est une description',
                    service: service?._id,
                    startDate: new Date(2022, 0, 15), //15 janv 2022
                    endDate: new Date(2022, 1, 15), //15 fevr 2022
                });
                await missionService.createMission({
                    name: 'testMission2',
                    description: 'Ceci est une description',
                    service: service?._id,
                    startDate: new Date(2022, 0, 15), //15 janv 2022
                    endDate: new Date(2022, 1, 15), //15 fevr 2022
                });
            } catch (error: any) {
                expect(error).toBeInstanceOf(InvalidParameterValue);
            }
        });
        test('Dates are invalid', async () => {
            try {
                const service = await ServiceModel.findOne();
                await missionService.createMission({
                    name: 'testMission',
                    description: 'Ceci est une description',
                    service: service?._id,
                    startDate: new Date(2022, 2, 15), //15 mars 2022
                    endDate: new Date(2022, 1, 15), //15 fevr 2022
                });
            } catch (error: any) {
                expect(error).toBeInstanceOf(InvalidParameterValue);
            }
        });
    });
    test('get mission by id', async () => {
        const service = await ServiceModel.findOne();
        const mission = await missionService.createMission({
            name: 'testMissionById',
            description: 'Ceci est une description',
            service: service?._id,
            startDate: new Date(2022, 0, 15), //15 janv 2022
            endDate: new Date(2022, 1, 15), //15 fevr 2022
        });
        const missionData = await missionService.getMissionById(mission?._id);
        expect(missionData?.name).toBe('testMissionById');
        expect(missionData?.description).toBe('Ceci est une description');
        expect(missionData?.service).toStrictEqual(mission?.service);
        expect(missionData?.startDate).toStrictEqual(new Date(2022, 0, 15));
        expect(missionData?.endDate).toStrictEqual(new Date(2022, 1, 15));
    });
    describe('accept mission update when', () => {
        test('correct data is provided', async () => {
            const oldMission = await MissionModel.findOne();
            await missionService.updateMission(
                oldMission?._id,
                new MissionModel({
                    name: 'testMissionBis2',
                    description: 'Ceci est une description bis',
                    service: oldMission?.service,
                    startDate: new Date(2022, 0, 17), //17 janv 2022
                    endDate: new Date(2022, 1, 17), //17 fevr 2022
                })
            );
            const newMission = await MissionModel.findById(oldMission?._id);
            expect(newMission?.name).toBe('testMissionBis2');
            expect(newMission?.description).toBe(
                'Ceci est une description bis'
            );
            expect(newMission?.service).toStrictEqual(oldMission?.service);
            expect(newMission?.startDate).toStrictEqual(new Date(2022, 0, 17));
            expect(newMission?.endDate).toStrictEqual(new Date(2022, 1, 17));
        });
    });
    describe('rejects mission update when', () => {
        test('mission with same name already exists in the same service', async () => {
            try {
                const service = await ServiceModel.findOne();
                const mission = await missionService.createMission({
                    name: 'testMissionBis2',
                    description: 'Ceci est une description',
                    service: service?._id,
                    startDate: new Date(2022, 0, 15), //15 janv 2022
                    endDate: new Date(2022, 1, 15), //15 fevr 2022
                });
                const oldMission = await MissionModel.findOne({
                    _id: { $ne: mission?._id },
                });
                await missionService.updateMission(
                    oldMission?._id,
                    new MissionModel({
                        name: 'testMissionBis2',
                        description: 'Ceci est une description bis',
                        service: oldMission?.service,
                        startDate: new Date(2022, 0, 17), //17 janv 2022
                        endDate: new Date(2022, 1, 17), //17 fevr 2022
                    })
                );
            } catch (error: any) {
                expect(error).toBeInstanceOf(InvalidParameterValue);
            }
        });
        test('Dates are invalid', async () => {
            try {
                const service = await ServiceModel.findOne();
                await missionService.createMission({
                    name: 'testMission',
                    description: 'Ceci est une description',
                    service: service?._id,
                    startDate: new Date(2022, 2, 15), //15 mars 2022
                    endDate: new Date(2022, 1, 15), //15 fevr 2022
                });
            } catch (error: any) {
                expect(error).toBeInstanceOf(InvalidParameterValue);
            }
        });
    });
    test('get mission list by service', async () => {
        const service = await ServiceModel.findOne({ name: 'R&D' });
        const missionList = await missionService.getMissionsByService(
            service?._id
        );
        expect(missionList?.length).toBe(7);
    });
});
