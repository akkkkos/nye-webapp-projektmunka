import React, { FC } from 'react';
import { Product } from '../../model';
import { Box, Flex, AspectRatio, Image, VStack, Heading, Text, Badge, Button } from '@chakra-ui/react';
import { FaStar } from "react-icons/fa";

export interface ProductDetailsProps {
    product: Product;
}

export const ProductDetails: FC<ProductDetailsProps> = ({ product }) => {
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= product.rating; i++) {
            stars.push(<FaStar key={i} />);
        }
        return stars;
    };
    return (
        <Box 
            as="article" bgColor="gray.900"  p="8" 
            borderWidth="1px" borderRadius="xl" 
            maxWidth="1000px" mx="auto" 
            boxShadow="2xl" overflow="hidden"
        >
            <Flex 
                direction={{ base: "column", md: "row" }} 
                justifyContent="space-between" 
                gap={10}
                alignItems="flex-start"
            >
                <AspectRatio 
                    ratio={323 / 486} 
                    flexBasis="30%" flexShrink={0}
                    borderRadius="lg" overflow="hidden" boxShadow="lg"
                >
                    <Image src={product.image} objectFit="cover" />
                </AspectRatio>
                <Box 
                    flexGrow={1} p={6} 
                    bg="gray.800" borderWidth="1px" borderRadius="lg" boxShadow="lg"
                    color="white"
                >
                    <VStack align="flex-start" spacing={5}>
                        <Box as="header">
                            <Heading fontSize="4xl" textTransform="uppercase" color="teal.300">{product.name}</Heading>
                        </Box>
                        <VStack spacing={3} align="flex-start" color="teal.200">
                        <Flex align="center">
                            <Badge colorScheme="teal" fontSize="lg" mr="2">Értékelés:</Badge>
                                <Flex>{renderStars()}</Flex>
                        </Flex>
                            <Badge colorScheme="orange" fontSize="lg">Raktáron: {product.stock}</Badge>
                        </VStack>
                        <Text fontSize="lg" lineHeight="tall" textAlign="justify">{product.description}</Text>
                        <Button 
                            mt={4}
                            size="lg"
                            colorScheme="teal"
                            variant="solid"
                        >
                            Add to Cart
                        </Button>
                    </VStack>
                </Box>
            </Flex>
        </Box>
    );
};