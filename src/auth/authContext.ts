import { createContext, useContext } from 'react';

export interface User {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
}

export interface AuthContext {
  user: User | null;
  authToken?: string;
  login: (username: string, password: string) => Promise<string | void>;
  logout: () => void;
};

export const createAuthContext = () => {
  const context = createContext<AuthContext | null>(null);

  const useAuthContext = () => {
    const ctx = useContext<AuthContext | null>(
      //@ts-ignore
      context as AuthContext
    );
    if (!ctx) {
      throw new Error('authContext must be within a AuthContextProvider component');
    }
    return ctx;
  };
  return [useAuthContext, context.Provider] as const;
};

export const [useAuthContext, AuthContextProvider] = createAuthContext();
