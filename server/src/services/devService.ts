import { createService, getCollaborants, setLeader } from './serviceService';
import mongoose from 'mongoose';
import { registerUser } from './authService';

export async function clearDB() {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
        // console.log(`${collection.collectionName} => ${collection?.count({})}`)
    }
}

export async function initializeDB() {
    const service1 = await createService({ name: 'R&D' });
    const service2 = await createService({ name: 'RH' });

    const user1 = await registerUser(
        {
            email: 'test1@abc.com',
            surname: 'Mike',
            name: 'Test1',
            service: service1?.id,
        },
        '123456'
    );
    await registerUser(
        {
            email: 'test2@abc.com',
            surname: 'Jack',
            name: 'Test2',
            service: service1?.id,
        },
        '123456'
    );
    const user3 = await registerUser(
        {
            email: 'test3@abc.com',
            surname: 'Fran',
            name: 'Test3',
            service: service2?.id,
        },
        '123456'
    );

    await setLeader(service1?.id, user1?.id);
    await setLeader(service2?.id, user3?.id);

    console.log(await getCollaborants(service1?.id));
}
