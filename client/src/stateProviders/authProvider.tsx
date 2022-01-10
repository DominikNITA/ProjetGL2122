import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        const savedUser = localStorage.getItem('user')!;
        console.log(savedUser);
        setUser(JSON.parse(savedUser));
        setToken(JSON.parse(localStorage.getItem('token')!));
    }, []);

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', JSON.stringify(token));
    }, [user, token]);

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
        setToken(authResponse.accessToken!);
        localStorage.setItem('user', JSON.stringify(authResponse.user!));
        localStorage.setItem(
            'token',
            JSON.stringify(authResponse.accessToken!)
        );
        successCallback();
    };

    const signout = (callback: VoidFunction) => {
        setUser(null);
        setToken(null);

        // localStorage.setItem('user', JSON.stringify(user));
        // localStorage.setItem('token', JSON.stringify(token));
        callback();
    };

    const value = { user, token, signin, signout };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
