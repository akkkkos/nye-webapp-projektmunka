import React, { FC, useEffect, useState } from 'react';
import { Flex, Button, Card, Text, Box } from '@chakra-ui/react';
import { FaShoppingCart } from "react-icons/fa";
import { Link as NavLink } from 'react-router-dom';
import { useAuthContext } from '../auth/authContext';
import { useCartContext } from '../cart/cartContext';



export const NavBar: FC = () => {
    const { authToken } = useAuthContext();
    const { getTotalNofItems } = useCartContext();

    const [totalItems, setTotalItems] = useState<number>(0);

    useEffect(() => {
        const fetchTotalItems = async () => {
            const total = await getTotalNofItems();
            setTotalItems(total);
        };
        fetchTotalItems();
    }, [getTotalNofItems]);

    return (
        <Flex justifyContent="space-between" marginBottom="2" marginTop="4" alignItems="center">
            <Flex>
                <Button as={NavLink} to="/" margin="2">Kezdőlap</Button>
                {
                    authToken &&
                    (
                        <Box display="flex" alignItems="center" borderRadius="md" padding="2" marginLeft="2" _hover={{ cursor: 'pointer' }}>
                            <FaShoppingCart />
                            <Text marginLeft="2">{totalItems}</Text>
                        </Box>
                    )
                }
            </Flex>
            <Flex>

            </Flex>
            {
                !authToken &&
                (
                    <Button as={NavLink} to="/login" margin="2">Belépés</Button>
                )
            }
        </Flex>
    );
}