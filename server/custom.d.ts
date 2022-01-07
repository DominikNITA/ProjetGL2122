import { UserReturn } from "./src/services/userService";

declare namespace Express {
    export interface Request {
       user?: UserReturn
    }
 }