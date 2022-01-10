import React, { useState } from 'react';
import { login } from '../api';
import { IUser } from '../types';

interface IAuthContext {
    user: IUser | null;
    token: string | null;
    signin: (
        email: string,
        password: string,
        successCallback: VoidFunction,
        failureCallback: VoidFunction
    ) => Promise<void>;
    signout: (callback: VoidFunction) => void;
}

const AuthContext = React.createContext<IAuthContext | null>(null);

export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }: any) {
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const signin = async (
        email: string,
        password: string,
        successCallback: VoidFunction,
        failureCallback: VoidFunction
    ): Promise<void> => {
        const authResponse = await login(email, password);
        console.log(`Email: ${email}, password: ${password}`);
        if (authResponse == null) {
            failureCallback();
            return;
        }
        setUser(authResponse.user!);
        setToken(authResponse.token!);
        //TODO: Save data to localStorage
        successCallback();
    };

    const signout = (callback: VoidFunction) => {
        setUser(null);
        setToken(null);
        callback();
    };

    const value = { user, token, signin, signout };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
