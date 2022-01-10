import { createService, getCollaborants, setLeader } from './serviceService';
import mongoose from 'mongoose';
import AuthService from './authService';

async function clearDB() {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
        // console.log(`${collection.collectionName} => ${collection?.count({})}`)
    }
}

async function initializeDB() {
    const service1 = await createService({ name: 'R&D' });
    const service2 = await createService({ name: 'RH' });

    const user1 = await AuthService.registerUser(
        {
            email: 'test1@abc.com',
            firstName: 'Mike',
            lastName: 'Test1',
            service: service1?.id,
        },
        '123456'
    );
    await AuthService.registerUser(
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

    await setLeader(service1?.id, user1?.id);
    await setLeader(service2?.id, user3?.id);

    console.log(await getCollaborants(service1?.id));
}

export default { clearDB, initializeDB };
