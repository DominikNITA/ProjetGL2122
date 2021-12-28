import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { dbConnect } from '../../../utils/connection';
import { MongoClient } from 'mongodb';
var mongo = require('mongodb').MongoClient;

export default NextAuth({
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
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
  adapter: MongoDBAdapter(dbConnect().then(x => {
    return x == undefined ? new MongoClient(process.env.USER_DATABASE_URL as string) : x.connections[0].client //C'est bon... ca marche... on touche plus a cette ligne...
  }))
})