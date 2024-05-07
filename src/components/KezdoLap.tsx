import React, { FC, useCallback, useEffect, useState } from 'react';
import { Flex, Text, Card, CardBody, Image } from '@chakra-ui/react';
import { useWebshopApi } from '../state/useWebshopApi';
import { Category } from '../model/Category';
import { useNavigate } from 'react-router-dom';


export const KezdoLap: FC = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const { getCategories } = useWebshopApi()
    const navigate = useNavigate();

    useEffect(() => {
        loadCategories();
    }, [])

    const loadCategories = async () => {
        const _categories = await getCategories()
        setCategories(_categories);
    }

    const handleCardClick = (categoryId: string) => {
        navigate("/category/" + categoryId);
    }


    return (
        <>
            <Flex flexWrap="wrap" justifyContent="center">
                {
                    categories.map((category, index) =>
                            <Card key={index} margin="2" minWidth={200} onClick={() => handleCardClick(category.id)} size="md" _hover={{ cursor: 'pointer' }}>
                                <Image
                                    objectFit='none'
                                    maxW={{ base: '100%', sm: '200px' }}
                                    src={category.image}
                                />
                                <CardBody>
                                    <Text>{category.name}</Text>
                                    <Text>{category.productCount} db</Text>
                                </CardBody>
                            </Card>
                    )
                }
            </Flex>
        </>
    );
}