import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../../model';
import { useWebshopApi } from '../../state';
import { ProductDetails } from './Product-Details';

const BASE_URL = 'http://localhost:5000';

export const ProductPage: FC = () => {
    const { getProductById } = useWebshopApi();
    const { productId } = useParams<{ productId: string | undefined }>(); // Type productId as string | undefined
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!productId) return; // Check if productId is undefined
                const productData = await getProductById(productId ?? ''); // Use the actual productId value
                setProduct(productData);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchData();
    }, [getProductById, productId]); // Include productId as dependency

    if (!product) {
        return null;
    }

    return <ProductDetails product={product} />;
};
