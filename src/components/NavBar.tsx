import React, { FC, useEffect, useState } from 'react';
import { Flex, Button, Card, Text, Box, SkipNavContent } from '@chakra-ui/react';
import { FaShoppingCart } from "react-icons/fa";
import { Link as NavLink } from 'react-router-dom';
import { useAuthContext } from '../auth/authContext';
import { useCartContext } from '../cart/cartContext';
import { useNavigate } from 'react-router-dom';



export const NavBar: FC = () => {
    const { authToken, user } = useAuthContext();
    const { getTotalNofItems } = useCartContext();
    const [totalItems, setTotalItems] = useState<number>(0);


    useEffect(() => {
        const fetchTotalItems = async () => {
            const total = await getTotalNofItems();
            setTotalItems(total);
        };
        fetchTotalItems();
    }, [getTotalNofItems]);

    const navigate = useNavigate();
    const handleGotoCart = () => {
        navigate("/cart")
    }

    return (
        <Flex justifyContent="space-between" marginBottom="2" marginTop="4" alignItems="center">
            <Flex>
                <Button as={NavLink} to="/" margin="2">Kezdőlap</Button>
                {
                    authToken &&
                    (
                        <Box display="flex" alignItems="center" borderRadius="md" padding="2" marginLeft="2" _hover={{ cursor: 'pointer' }} onClick={handleGotoCart}>
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
                    <>
                        <Button as={NavLink} to="/login" margin="2">Belépés</Button>
                        <Button as={NavLink} to="/register" margin="2">Regisztráció</Button>
                    </>

                )
            }

            {
                user &&
                (
                    <Button as={NavLink} to="/profile" margin="2">Profil</Button>
                )
            }

        </Flex>
    );
}