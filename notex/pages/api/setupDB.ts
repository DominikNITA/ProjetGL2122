import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../utils/connection';
import { ResponseFuncs, SetupDbBody } from '../../utils/types';
import mongoose from 'mongoose';
import { createAuthUser } from '../../services/authService';
import {
  createService,
  getCollaborants,
  setLeader,
} from '../../services/serviceService';

interface SetupDbApiRequest extends NextApiRequest {
  body: SetupDbBody;
}

const handler = async (req: SetupDbApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV === 'production')
    throw new Error('Not available in production :(');

  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error });

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE POST REQUESTS
    POST: async (req: SetupDbApiRequest, res: NextApiResponse) => {
      await dbConnect(); // connect to database
      console.log('Setup DB in progress');
      if (req.body.doClearDB) {
        //TODO: Move to service or utils
        // mongoose.modelNames().forEach(async modelName => {
        //   const model = x?.models[modelName]
        //   await model!.deleteMany({})

        // });
        // console.log(x?.models)
        // console.log(mongoose.modelNames())
        const collections = await mongoose.connection.db.collections();

        for (const collection of collections) {
          await collection.deleteMany({}).catch(catcher);
          // console.log(`${collection.collectionName} => ${collection?.count({})}`)
        }
      }
      if (req.body.doInsertTestData) {
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
        ).catch(catcher);

        await setLeader(service1?.id, user1?.id);
        await setLeader(service2?.id, user3?.id);

        console.log(await getCollaborants(service1?.id));
      }
      res.status(200).end();
    },
  };

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method];
  if (response) await response(req, res);
  else res.status(400).json({ error: 'No Response for This Request' });
};

export default handler;
