import { FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { AuthContext, AuthContextProvider, User } from './authContext';
import { useNavigate } from 'react-router-dom';
import { useWebshopApi } from '../state/useWebshopApi';

const AUTH_KEY = 'This1s@secr3tKey';

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {

    const [authToken, setAuthToken, removeAuthToken] = useLocalStorage(AUTH_KEY, '');
    const [user, setUser] = useState<User | null>(null);
    const { login: createLoginToken, getUserProfile } = useWebshopApi();

    const navigate = useNavigate();


    const login: AuthContext['login'] = useCallback(
        async (username: string, password: string) => {
            try {
                const authToken = await createLoginToken(username, password);
                setAuthToken(authToken);
            } catch (error) {
                return (error as Error)?.message;
            }
        },
        [setAuthToken]
    );

    const logout: AuthContext['logout'] = useCallback(
        () => {
            removeAuthToken();
            navigate('/');
        },
        [navigate, removeAuthToken]
    );


    const state: AuthContext = useMemo(() => ({
        login,
        logout,
        authToken,
        user,
    }), [login, logout, user, authToken]);


    useEffect(
        () => {
            if (!authToken) {
                setUser(null);
                return;
            }
            (async () => {
                try {
                    const userProfile = await getUserProfile(authToken);
                    setUser(userProfile);
                } catch (error) {
                    removeAuthToken();
                }
            })();
        },
        [authToken, setAuthToken]
    );



    return (
        <AuthContextProvider value={state}>
            {children}
        </AuthContextProvider>
    );
};