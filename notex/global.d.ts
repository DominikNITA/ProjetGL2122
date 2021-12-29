import mongoose, { Connection } from "mongoose";

declare global {
  var mongoose: {
      conn? : Connection;
      promise? : mongoose;
  };
};

declare module 'next-auth/client';