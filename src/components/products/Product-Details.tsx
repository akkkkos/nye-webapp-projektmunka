import { FC } from 'react';
import { Box, Flex, AspectRatio, Image, VStack, Heading, Text, Badge } from '@chakra-ui/react';
import { Product, Category } from '../../model';
import { FaStar } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { AddToCartModule } from '../../cart/addToCartModule';

export interface ProductDetailsProps {
    product: Product;
    categories: Category[];
}

export const ProductDetails: FC<ProductDetailsProps> = ({ product, categories }) => {

    const navigate = useNavigate();

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= product.rating; i++) {
            stars.push(<FaStar key={i} />);
        }
        return stars;
    };

    const handleCategoryClick = (categoryId: string) => {
        navigate(`/category/${categoryId}`);
    };

    return (
        <Box
            as="article" bgColor="gray.900" p="8"
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

                        <AddToCartModule product={product} />

                    </VStack>
                </Box>
            </Flex>
            <Box mt={8} p={4} bg="gray.900" borderRadius="xl" boxShadow="lg">
                <Text fontSize="xl" fontWeight="bold" color="white" mb={4}>Kategóriák:</Text>
                <Flex alignItems="center">
                    {categories.map((category, index) => (
                        <Box key={index} mr={4}>
                            <Link to={`/category/${category.id}`}>
                                <VStack spacing={2} alignItems="center">
                                    <Image
                                        src={`${category.image}?cache=${Math.random()}`}
                                        objectFit="cover"
                                        boxSize="70px"
                                        borderRadius="full"
                                        boxShadow="md"
                                    />
                                    <Text textAlign="center" color="white">{category.name}</Text>
                                </VStack>
                            </Link>
                        </Box>
                    ))}
                </Flex>
            </Box>
        </Box>
    );
};
