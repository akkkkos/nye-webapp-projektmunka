import React, { FC } from 'react';
import { Card, CardBody, Image, Text } from '@chakra-ui/react';
import { Product } from '../../model';

export const ProductListElement: FC<Product> = (product) => {
    return (
        <Card margin="2" minWidth={200} size="md" _hover={{ cursor: 'pointer' }}>
            <Image
                // objectFit='none'
                maxW={{ base: '100%', sm: '400px' }}
                src={`${product.image}?cache=${Math.random()}`}
            />
            <CardBody>
                <Text>{product.name}</Text>
                <Text>{product.price} ft</Text>
                {
                    product.stock > 0 ?
                        (<Text>Raktáron: {product.stock}db</Text>) :
                        (<Text>Nincs raktáron</Text>)
                }
                <Text>{product.rating}/5</Text>
            </CardBody>
        </Card>
    );
}