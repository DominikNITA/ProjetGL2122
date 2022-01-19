import serviceService from './serviceService';
import mongoose from 'mongoose';
import AuthService from './authService';
import userService from './userService';
import { Month, UserRole } from '../utility/types';
import noteService from './noteService';
import missionService from './missionService';

async function clearDB() {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
        // console.log(`${collection.collectionName} => ${collection?.count({})}`)
    }
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

    await noteService.createNote({
        owner: user1?._id,
        year: 2022,
        month: Month.January,
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
}

export default { clearDB, initializeDB };
