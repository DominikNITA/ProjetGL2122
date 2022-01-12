import testUtility from './testUtility';
import dotenv from 'dotenv';
import serviceService from '../src/services/serviceService';
import { Types } from 'mongoose';

beforeAll(async () => {
    await testUtility.connectAndReinitializeTestDB();
    dotenv.config();
});

afterAll(() => {
    testUtility.closeConnection();
});

describe('ServiceService', () => {
    let newServiceId: Types.ObjectId;
    describe('createService', () => {
        describe('creates new service when', () => {
            test('new name is provided', async () => {
                const expectedServiceName = 'New service name';
                const service = await serviceService.createService({
                    name: expectedServiceName,
                });
                newServiceId = service?._id;
                expect(service).toBeDefined();
                expect(service?._id).toBeDefined();
                expect(service?.name).toBe(expectedServiceName);
            });
        });
    });
    describe('getServiceById', () => {
        describe('returns correct service when', () => {
            test('existing id is provided', async () => {
                const expectedServiceName = 'New service name';
                const service = await serviceService.getServiceById(
                    newServiceId
                );
                expect(service).toBeDefined();
                expect(service?._id).toBeDefined();
                expect(service?.name).toBe(expectedServiceName);
            });
        });
        describe('returns Null when', () => {
            test('not existing id is provided', async () => {
                const notExistingObjectId = new Types.ObjectId('41224d776a326fb40f000001');
                const service = await serviceService.getServiceById(
                    notExistingObjectId
                );
                expect(service).toBeNull();
            });
        });
    });
});

export {};
