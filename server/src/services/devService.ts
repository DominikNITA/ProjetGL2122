import serviceService from './serviceService';
import mongoose from 'mongoose';
import AuthService from './authService';
import userService from './userService';
import noteService from './noteService';
import noteLineService from './noteLineService';
import { Month, UserRole } from '../../../shared/enums';
import missionService from './missionService';

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
    const service1 = await serviceService.createService({ name: 'R&D' });
    const service2 = await serviceService.createService({ name: 'RH' });
    await serviceService.createService({ name: 'Compta' });
    await serviceService.createService({ name: 'Informatique' });

    await missionService.createMission({
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
            description: 'NoteLine1',
            ttc: 12.99,
            tva: 10,
            note: note1?.id,
            date: new Date(Date.now()),
            justificatif: '/somepath/toJustificatif',
        },
    });
}

export default { clearDB, initializeDB };
