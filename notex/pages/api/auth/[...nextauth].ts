import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { dbConnect } from '../../../utils/connection';
import { MongoClient } from 'mongodb';
import {UserModel} from '../../../models/user';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name:"Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        await dbConnect();
        const user = await UserModel.findOne({'email':credentials?.email})
  
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          console.log(`signed as ${user.email}`)
          return user
        } else {
          // If you return null or false then the credentials will be rejected
          return null
          // You can also Reject this callback with an Error or with a URL:
          // throw new Error("error message") // Redirect to error page
          // throw "/path/to/redirect"        // Redirect to a URL
        }
      }
    }),
  ],
  secret: process.env.SECRET,

  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnaaaavc8PSnX', //use a random secret token here
  },

  debug: true,
})