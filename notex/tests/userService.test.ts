//Boilerplate code to load test environment variables
import { loadEnvConfig } from '@next/env'
const projectDir = process.cwd()
loadEnvConfig(projectDir)

import * as UserService from '../services/userService';

beforeEach(() => {
    //TODO: initialize db
});

test('getUserByEmail() returns null for not existing users', async () => {
    expect( await UserService.getUserByEmail("notExisitingUser@test.com")).toBeNull();
})