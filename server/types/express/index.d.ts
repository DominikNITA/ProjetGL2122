import { UserReturn } from "../../src/services/userService";

declare namespace Express {
    interface Request {
        user?: UserReturn
    }
}