import React, { FC } from 'react';
import { Product } from '../../model';
import { Box, Flex, AspectRatio, Image, HStack, Heading, Text, } from '@chakra-ui/react';



export interface ProductDetailsProps {
    product: Product;
}

export const ProductDetails: FC<ProductDetailsProps> = ({ product }) => {
    return (
        <Box as="article" bgColor="background.dark" pb="7" pt="9" px="16">
            <Flex justifyContent="space-between" gap={10}>
                <AspectRatio ratio={323 / 486} flexBasis="30%" flexShrink={0}>
                    <>
                        <Image src={product.image} />
                        <Box flexGrow={1}>
                            <Box as="header" marginBottom={8}>
                                <HStack spacing={6}>
                                    <Heading fontSize="4xl" textTransform="uppercase">{product.name}</Heading>
                                </HStack>

                            </Box>
                            <HStack as="time" spacing={12} color="text.highlighted" fontSize="2xl" mb="7">
                                <Text as="span"> {product.rating}</Text>
                                <Text as="span">{product.stock}</Text>
                            </HStack>
                            <Text fontSize="xl" opacity={0.5}>{product.description}</Text>
                        </Box>
                    </>
                </AspectRatio>



            </Flex>
        </Box>





    );
};