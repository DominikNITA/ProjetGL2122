import serviceService from './serviceService';
import mongoose from 'mongoose';
import AuthService from './authService';
import userService from './userService';
import noteService from './noteService';
import noteLineService from './noteLineService';
import {
    FraisType,
    Month,
    NoteState,
    UserRole,
    VehicleType,
} from '../../../shared/enums';
import missionService from './missionService';
import vehicleService from './vehicleService';
import fs from 'fs';
import path from 'path';

async function clearUploadFolder() {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    fs.readdir(uploadDir, (err, files) => {
        if (err) throw err;
        const doLog = process.env.NODE_ENV !== 'test';
        doLog &&
            console.log(
                `-  Clearing justificatifs (total count ${files.length}) started`
            );
        for (const file of files) {
            fs.unlink(path.join(uploadDir, file), (err) => {
                if (err) throw err;
            });
        }
        doLog && console.log('-  Clearing finished');
    });
}

function copyFromExampleDataToUploadFolder() {
    const examplesDir = 'tests/exampleData/justificatifs';
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    fs.readdir(examplesDir, (err, files) => {
        if (err) throw err;
        const doLog = process.env.NODE_ENV !== 'test';
        doLog &&
            console.log(
                `-  Moving justificatifs (total count ${files.length}) to uploads folder started`
            );
        for (const file of files) {
            fs.copyFile(
                path.join(examplesDir, file),
                path.join(uploadDir, file),
                fs.constants.COPYFILE_EXCL,
                (err) => {
                    if (err) throw err;
                }
            );
        }
        doLog && console.log('-  Moving finished');
    });
}

async function clearDB() {
    const collections = await mongoose.connection.db.collections();
    const doLog = process.env.NODE_ENV !== 'test';
    doLog && console.log('-  Clearing started');
    for (const collection of collections) {
        doLog &&
            console.log(`Clearing collection: ${collection.collectionName}`);
        await collection.deleteMany({});
    }
    doLog && console.log('-  Clearing finished');
}

async function initializeDB() {
    clearUploadFolder();
    copyFromExampleDataToUploadFolder();
    await clearDB();

    const service1 = await serviceService.createService({ name: 'R&D' });
    const service2 = await serviceService.createService({ name: 'RH' });
    await serviceService.createService({ name: 'Compta' });
    await serviceService.createService({ name: 'Informatique' });

    const mission1 = await missionService.createMission({
        name: 'Mission 1',
        description: 'description mission 1',
        service: service1?._id,
        startDate: new Date(2022, 0, 15),
        endDate: new Date(2022, 1, 15),
    });

    await missionService.createMission({
        name: 'Mission 2',
        description: 'description mission 2',
        service: service1?._id,
        startDate: new Date(2022, 0, 16),
        endDate: new Date(2022, 1, 19),
    });

    const user1 = await AuthService.registerUser(
        {
            email: 'test1@abc.com',
            firstName: 'Mike',
            lastName: 'Test1',
            service: service1?.id,
        },
        '123456'
    );
    const user2 = await AuthService.registerUser(
        {
            email: 'test2@abc.com',
            firstName: 'Jack',
            lastName: 'Test2',
            service: service1?.id,
        },
        '123456'
    );
    const user3 = await AuthService.registerUser(
        {
            email: 'test3@abc.com',
            firstName: 'Fran',
            lastName: 'Test3',
            service: service2?.id,
        },
        '123456'
    );

    const userBoss = await AuthService.registerUser(
        {
            email: 'test100@abc.com',
            firstName: 'THE Boss',
            lastName: 'Director',
        },
        '123456'
    );
    await userService.setRoles(userBoss?._id, [UserRole.Director]);

    await serviceService.setLeader(service1?.id, user1?.id);
    await serviceService.setLeader(service2?.id, user3?.id);

    const note1 = await noteService.createNote({
        owner: user1?._id,
        year: 2022,
        month: Month.January,
    });
    await noteService.createNote({
        owner: user1?._id,
        year: 2022,
        month: Month.February,
    });
    await noteService.createNote({
        owner: user1?._id,
        year: 2021,
        month: Month.December,
        state: NoteState.Validated,
    });
    await noteService.createNote({
        owner: user2?._id,
        year: 2022,
        month: Month.January,
    });
    await noteService.createNote({
        owner: user3?._id,
        year: 2022,
        month: Month.January,
    });

    await noteLineService.createNoteLine({
        noteId: note1?._id,
        noteLine: {
            fraisType: FraisType.Standard,
            mission: mission1!._id,
            description: 'Restaurant',
            ttc: 12.99,
            ht: 10,
            note: note1?.id,
            date: new Date(Date.now()),
            justificatif: 'example1.png',
        },
    });

    await noteLineService.createNoteLine({
        noteId: note1?._id,
        noteLine: {
            fraisType: FraisType.Standard,
            mission: mission1!._id,
            description: 'Hotel',
            ht: 45.99,
            tva: 10.25,
            note: note1?.id,
            date: new Date(Date.now() - 15000),
            justificatif: 'example2.png',
        },
    });

    await vehicleService.createVehicle({
        vehicle: {
            description: 'BMW e60',
            horsePower: 5,
            owner: user1?._id,
            type: VehicleType.Car,
            isElectric: false,
        },
    });

    console.log('Initialization finished without errors');
}

export default { clearDB, initializeDB, clearUploadFolder };
