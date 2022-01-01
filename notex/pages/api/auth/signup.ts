import { NextApiRequest, NextApiResponse } from "next"
import { dbConnect } from "../../../utils/connection"
import { ResponseFuncs } from "../../../utils/types"
import * as AuthService from "../../../services/authService"
import { getSession } from "next-auth/react"

interface PostUserCredentialsApiRequest extends NextApiRequest{
    body:{
        email: string
    }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })

  const session = await getSession({ req })
  if(!session){
      res.status(401).end();
  }

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE POST REQUESTS
    POST: async (req: PostUserCredentialsApiRequest, res: NextApiResponse) => {
      await dbConnect() // connect to database
      res.status(201).json({message: "User created"})
    },
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) await response(req, res)
  else res.status(400).json({ error: "No Response for This Request" })
}

export default handler