import { dbConnect } from '../utils/connection';
import { IUser } from '../utils/types';
import { InvalidParameterValue } from '../utils/errors';
import * as UserService from './userService';
import { throwIfNullParameters, validateEmail } from '../utils/other';
import { SHA256 } from 'crypto-js';
import { randomUUID } from 'crypto';

export async function authenticate(
  email: string,
  password: string
): Promise<UserService.UserReturn> {
  if (!validateEmail(email)) {
    throw new InvalidParameterValue(email, 'Email pattern does not match');
  }

  await dbConnect();
  const user = await UserService.getUserByEmail(email);
  if (user == null) {
    return null;
  }

  if (
    user.authData!.passwordHash !==
    SHA256(user.authData!.salt + password).toString()
  ) {
    return null;
  }

  return user;
}

export async function createAuthUser(user: IUser, password: string) {
  throwIfNullParameters([user, password]);

  const salt = randomUUID();
  const hashedPassword = SHA256(salt + password);
  user.authData = { salt: salt, passwordHash: hashedPassword.toString() };
  const newUser = await UserService.addNewUser(user);

  return newUser;
}
