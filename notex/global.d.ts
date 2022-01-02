import mongoose, { Connection } from "mongoose";

declare global {
  var mongoose: {
      conn? : Connection;
      promise? : mongoose;
  };
};

declare module 'next-auth/client';

import NextAuth from "next-auth"
import { IUser } from "./utils/types";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface UserWithId extends IUser{
    _id? : string;
  }

  interface Session {
    user: UserWithId
  }
}

// import { JWT } from "next-auth/jwt"

// declare module "next-auth/jwt" {
//   /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
//   interface JWT {
//     user: UserWithId
//   }
// }