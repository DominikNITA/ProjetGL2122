import { Document, Types } from 'mongoose';
import { IService, IUser } from '../utility/types';
import { ServiceModel } from '../models/service';
import { UserModel } from '../models/user';
import { throwIfNull, compareObjectIds } from '../utility/other';
import { UserRole } from '../../../shared/enums';

export type UserReturn =
    | (Document<any, any, IUser> & IUser & { _id: Types.ObjectId })
    | null;

async function getUserByEmail(email: string) {
    const user = await UserModel.findOne({ email: email });
    return user;
}

async function getUserById(id: Types.ObjectId) {
    const user = await UserModel.findOne({ _id: id });
    return user;
}

function getUsersWithRoleQuery(role: UserRole) {
    const users = UserModel.find({ roles: role });
    return users;
}

interface IAddNewUserInput {
    firstName: IUser['firstName'];
    lastName: IUser['lastName'];
    email: IUser['email'];
    service?: IUser['service'];
    authData?: IUser['authData'];
    roles?: IUser['roles'];
}

async function addNewUser(newUser: IAddNewUserInput): Promise<UserReturn> {
    if ((await getUserByEmail(newUser.email)) !== null) {
        throw new Error(`User with email ${newUser.email} already exists!`);
    }

    const userDocToAdd = new UserModel(newUser);
    await userDocToAdd.save();
    return userDocToAdd;
}

async function isAnyServiceLeader(userId: Types.ObjectId) {
    const services = await ServiceModel.find({ leader: userId });
    return services.length > 0;
}

async function setRoles(userId: Types.ObjectId, roles: UserRole[]) {
    const user = await getUserById(userId);
    throwIfNull([user]);
    user!.roles = roles;
    user?.save();
    return roles;
}

async function getSubordinateUsers(
    userId: Types.ObjectId
): Promise<UserReturn[]> {
    const user = await getUserById(userId);
    let subordinateUsers: UserReturn[] = [];
    if (user?.roles.includes(UserRole.Leader)) {
        const temp = await getUsersWithRoleQuery(UserRole.Collaborator).find({
            service: user.service,
        });
        subordinateUsers = subordinateUsers.concat(
            temp.filter((su) => !compareObjectIds(userId, su!._id))
        );
    }
    if (user?.roles.includes(UserRole.Director)) {
        const temp = await getUsersWithRoleQuery(UserRole.Leader);
        subordinateUsers = subordinateUsers.concat(
            temp.filter((su) => !compareObjectIds(userId, su!._id))
        );
    }
    if (user?.roles.includes(UserRole.FinanceLeader)) {
        const temp = await getUsersWithRoleQuery(UserRole.Director);
        subordinateUsers = subordinateUsers.concat(
            temp.filter((su) => !compareObjectIds(userId, su!._id))
        );
    }
    return subordinateUsers;
}

async function populateService(
    user: Promise<
        | (IUser & {
              _id: any;
          })
        | null
    >
) {
    return await user.then((x) =>
        x!.populate<{ service: IService }>('service')
    );
}

export default {
    getUserByEmail,
    getUserById,
    getUsersWithRole: getUsersWithRoleQuery,
    addNewUser,
    isAnyServiceLeader,
    setRoles,
    populateService,
    getSubordinateUsers,
};
