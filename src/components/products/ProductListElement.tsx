import { FC } from 'react';
import { Card, CardBody, Image, Text, Flex } from '@chakra-ui/react';
import { Product } from '../../model';
import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { AddToCartModule } from '../../cart/addToCartModule';

export const ProductListElement: FC<Product> = (product) => {
    const navigate = useNavigate()

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= product.rating; i++) {
            stars.push(<FaStar />);
        }
        return stars;
    };

    const handleProductClick = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <Card margin="2" minWidth={200} size="md">
            <Image
                // objectFit='none'
                maxW={{ base: '100%', sm: '400px' }}
                src={`${product.image}?cache=${Math.random()}`}
                _hover={{ cursor: 'pointer' }} onClick={handleProductClick}
            />
            <CardBody>
                <Text>{product.name}</Text>
                <Text>Ár: {product.price}</Text>
                {
                    product.stock > 0 ?
                        (<Text>Raktáron: {product.stock}db</Text>) :
                        (<Text>Nincs raktáron</Text>)
                }
                <Flex>{renderStars()}</Flex>

                <AddToCartModule product={product} />
            </CardBody>
        </Card>
    );
}