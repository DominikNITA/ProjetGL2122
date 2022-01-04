import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../utils/connection';
import { ResponseFuncs, SetupDbBody } from '../../utils/types';
import { clearDB, initializeDB } from '../../services/devService';

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
        await clearDB().catch(catcher);
      }
      if (req.body.doInsertTestData) {
        await initializeDB().catch(catcher);
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
