import React, { FC } from 'react';
import { Flex, Button, SkipNavContent } from '@chakra-ui/react';
import { Link as NavLink } from 'react-router-dom';
import { useAuthContext } from '../auth/authContext';



export const NavBar: FC = () => {
    const { authToken } = useAuthContext();

    return (
        <Flex justifyContent="end" marginBottom="2" marginTop="4" alignItems="right">
            {
                !authToken &&
                (
                    <Button as={NavLink} to="/login" margin="2">Belépés</Button> 
                    
                )
            }
            <Button as={NavLink} to="/" margin="2">Kezdőlap</Button>
            <Button as={NavLink} to="/profile" margin="2">Profil</Button>
            
        </Flex>
    );
}