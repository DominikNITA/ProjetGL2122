import { createAuthUser } from './authService';
import { createService, getCollaborants, setLeader } from './serviceService';
import mongoose from 'mongoose';

export async function clearDB() {
  //TODO: Move to service or utils
  // mongoose.modelNames().forEach(async modelName => {
  //   const model = x?.models[modelName]
  //   await model!.deleteMany({})

  // });
  // console.log(x?.models)
  // console.log(mongoose.modelNames())
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
    // console.log(`${collection.collectionName} => ${collection?.count({})}`)
  }
}

export async function initializeDB() {
  const service1 = await createService({ name: 'R&D' });
  const service2 = await createService({ name: 'RH' });

  const user1 = await createAuthUser(
    {
      email: 'test1@abc.com',
      surname: 'Mike',
      name: 'Test1',
      service: service1?.id,
    },
    '123456'
  );
  await createAuthUser(
    {
      email: 'test2@abc.com',
      surname: 'Jack',
      name: 'Test2',
      service: service1?.id,
    },
    '123456'
  );
  const user3 = await createAuthUser(
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
