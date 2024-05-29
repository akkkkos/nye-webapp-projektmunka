import React, { FC, useEffect, useState } from 'react';
import { Product, Category } from '../../model';
import { useWebshopApi } from '../../state';
import { ProductDetails } from './Product-Details';
import { useParams, Link } from 'react-router-dom';

import { Box, Text, Button } from '@chakra-ui/react';

const BASE_URL = 'http://localhost:5000';


export const ProductPage: FC = () => {
    const { getProductById, getCategories } = useWebshopApi();
    const { productId } = useParams<{ productId: string | undefined }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!productId) return;
                const productData = await getProductById(productId);
                setProduct(productData);

                // Termékhez tartozó kategóriákat lekérjük
                const productCategories = await getCategoriesForProduct(productData);
                setCategories(productCategories);
            } catch (error) {
                setError('Hiba történt az adatok lekérdezése során.');
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [getProductById, getCategories, productId]);

    // Kategóriákat keres a termékhez
    const getCategoriesForProduct = async (product: Product): Promise<Category[]> => {
        const allCategories = await getCategories();
        return allCategories.filter(category => product.categories.includes(category.id));
    };

    if (error) {
        return (
            <Box p={6} textAlign="center">
                <Text color="red.500" fontSize="xl">{error}</Text>
                <Button mt={4} as={Link} to="/" colorScheme="teal">Vissza a kezdőlapra</Button>
            </Box>
        );
    }
    
    if (!product) {
        return null;
    }

    return (
        <ProductDetails product={product} categories={categories} />
    );
};
