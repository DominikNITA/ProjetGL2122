import authService from '../src/services/authService';
import { ErrorResponse } from '../src/utility/errors';
import testUtility from './testUtility';
import dotenv from 'dotenv';

beforeAll(async () => {
    await testUtility.connectAndReinitializeTestDB();
    dotenv.config();
});

afterAll(() => {
    testUtility.closeConnection();
});

describe('AuthService', () => {
    //Credentials verification

    describe('logins user when', () => {
        test('correct credentials are provided', () => {
            return authService
                .loginUser('test1@abc.com', '123456')
                .then((data) => expect(data).toBeDefined());
        });
    });

    describe('rejects login attempt when', () => {
        test('incorrect password is passed for existing user', () => {
            return expect(
                authService.loginUser('test1@abc.com', 'InvalidPassword123')
            ).rejects.toBeDefined();
        });

        test('not existing email is passed', () => {
            return expect(
                authService.loginUser('notExistingUser@abc.com', '123456')
            ).rejects.toBeDefined();
        });
    });

    describe('registers new user when', () => {
        test('correct data is provided ', async () => {
            const user = await authService.registerUser(
                {
                    email: 'newUser@abc.com',
                    firstName: 'New',
                    lastName: 'User',
                    service: null,
                },
                '123456'
            );

            expect(user).toBeDefined();
            expect(user?.authData).toBeDefined();
        });
    });

    describe('rejects new user registration when', () => {
        test('passed email is already taken', async () => {
            expect.assertions(1);
            try {
                await authService.registerUser(
                    {
                        email: 'test1@abc.com',
                        firstName: 'TakenEmail',
                        lastName: 'User',
                        service: null,
                    },
                    '123456'
                );
            } catch (error: any) {
                expect(error).toBeInstanceOf(ErrorResponse);
            }
        });

        test('empty email is passed', async () => {
            expect.assertions(1);
            try {
                await authService.registerUser(
                    {
                        email: '',
                        firstName: 'EmptyEmail',
                        lastName: 'User',
                        service: null,
                    },
                    '123456'
                );
            } catch (error: any) {
                expect(error).toBeInstanceOf(ErrorResponse);
            }
        });

        test('empty password is passed', async () => {
            expect.assertions(1);
            try {
                await authService.registerUser(
                    {
                        email: 'abc@test.com',
                        firstName: 'EmptyEmail',
                        lastName: 'User',
                        service: null,
                    },
                    ''
                );
            } catch (error: any) {
                expect(error).toBeInstanceOf(ErrorResponse);
            }
        });
    });
});

export {};
