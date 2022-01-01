import { NextApiRequest, NextApiResponse } from "next"
import {ServiceModel} from "../../../models/service"
import { dbConnect } from "../../../utils/connection"
import { ResponseFuncs } from "../../../utils/types"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      await dbConnect() // connect to database
      res.json(await ServiceModel.find({}).catch(catcher))
    },
    // RESPONSE POST REQUESTS
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      await dbConnect() // connect to database
      res.json(await ServiceModel.create(req.body).catch(catcher))
    },
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) await response(req, res)
  else res.status(400).json({ error: "No Response for This Request" })
}

export default handler