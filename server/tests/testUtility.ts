import mongoose from 'mongoose';
import devService from '../src/services/devService';

async function connectAndReinitializeTestDB() {
    const opts = {
        bufferCommands: false,
    };
    await mongoose.connect(
        'mongodb://localhost:27017/notes_test' as string,
        opts
    );
    await devService.clearDB();
    await devService.initializeDB();
}

async function closeConnection() {
    mongoose.connection.close();
}

function getEmailForTestUser(userNumber: Number) {
    return `test${userNumber}@abc.com`;
}

export default {
    connectAndReinitializeTestDB,
    closeConnection,
    getEmailForTestUser,
};
