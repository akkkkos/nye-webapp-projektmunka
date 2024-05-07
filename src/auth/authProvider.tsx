import { FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {

    

    return (
        //<AuthContextProvider value={state}>
        <>
            {children}
        </>
        //</AuthContextProvider>
    );
};