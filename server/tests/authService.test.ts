import authService from '../src/services/authService';
import mongoose from 'mongoose';
import devService from '../src/services/devService';

beforeAll(async () => {
    const opts = {
        bufferCommands: false,
    };
    await mongoose.connect(
        'mongodb://localhost:27017/notes_test' as string,
        opts
    );
    await devService.clearDB();
    await devService.initializeDB();
});

//Credentials verification

test('verify correct credentials of existing user', () => {
    return authService
        .verifyCredentials('test1@abc.com', '123456')
        .then((data) => expect(data).toBeDefined());
});

test('verify INCORRECT password of exisiting user', () => {
    return expect(
        authService.verifyCredentials('test1@abc.com', 'InvalidPassword123')
    ).rejects.toBeDefined();
});

test('verify credentials of NOT exisiting user', () => {
    return expect(
        authService.verifyCredentials('notExistingUser@abc.com', '123456')
    ).rejects.toBeDefined();
});

// User registration

// Access token generation

export {};
