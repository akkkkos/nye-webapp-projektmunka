import React, { FC } from 'react';
import { Flex, Button } from '@chakra-ui/react';
import { Link as NavLink } from 'react-router-dom';

export const NavBar: FC = () => {
    return (
        <Flex justifyContent="end" marginBottom="2" marginTop="4" alignItems="right">
            <Button as={NavLink} to="/login" margin="2">Belepes</Button>
            <Button as={NavLink} to="/" margin="2">Kezdolap</Button>
        </Flex>
    );
}