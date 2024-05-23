import React, { FC, useEffect, useState } from 'react';
import { Flex, Button, Card, Text, Box,Input  } from '@chakra-ui/react';
import { FaShoppingCart } from "react-icons/fa";
import { Link as NavLink } from 'react-router-dom';
import { useAuthContext } from '../auth/authContext';
import { useCartContext } from '../cart/cartContext';
import { useNavigate } from 'react-router-dom';



export const NavBar: FC = () => {
    const { authToken } = useAuthContext();
    const { getTotalNofItems } = useCartContext();
    const [totalItems, setTotalItems] = useState<number>(0);
    const [searchInput, setSearchInput] = useState<string>('');

    
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
    const handleSearch = () => {
        if (searchInput.trim() !== '') {
            navigate("/search", { state: { isSearch: true, query: searchInput } });
        }
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
            <Flex justifyContent="center" alignItems="center">
                <Input 
                    placeholder="Kifejezés keresése"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    marginRight="2"
                />
                <Button onClick={handleSearch}>Keresés</Button>
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