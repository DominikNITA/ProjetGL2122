import { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "../../utils/connection"
import { ResponseFuncs, SetupDbBody } from "../../utils/types"
import mongoose from "mongoose"
import { MissionModel } from "../../models/mission"
import { NoteModel } from "../../models/note"
import { ServiceModel } from "../../models/service"
import { UserModel } from "../../models/user"
import { createAuthUser } from "../../services/authService"

interface SetupDbApiRequest extends NextApiRequest {
  body: SetupDbBody
}

const handler = async (req: SetupDbApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE POST REQUESTS
    POST: async (req: SetupDbApiRequest, res: NextApiResponse) => {
      const x = await dbConnect() // connect to database
      console.log("Setup DB in progress")
      if (req.body.doClearDB) {
        //TODO: Move to service or utils
        // mongoose.modelNames().forEach(async modelName => {
        //   const model = x?.models[modelName]
        //   await model!.deleteMany({})

        // });
        console.log(x?.models)
        console.log(mongoose.modelNames())
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
          await collection.deleteMany({})
          console.log(`${collection.collectionName} => ${collection?.count({})}`)
        }
      }
      if(req.body.doInsertTestData){
        await createAuthUser({email:"test1@abc.com", surname:"Mike", name:"Test1"},"123456");
        await createAuthUser({email:"test2@abc.com", surname:"Jack", name:"Test2"},"123456");
      }
      res.status(200).end()
    },
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) await response(req, res)
  else res.status(400).json({ error: "No Response for This Request" })
}

export default handler