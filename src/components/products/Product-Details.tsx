
import React, { FC, useState, useEffect, useCallback } from 'react';
import { Box, Flex, AspectRatio, Image, VStack, Heading, Text, Badge, Button, FormControl, Input, FormErrorMessage, Divider } from '@chakra-ui/react';
import { Product, Category } from '../../model';
import { FaStar } from "react-icons/fa";
import { useAuthContext } from '../../auth/authContext';
import { useCartContext } from '../../cart/cartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { number, object } from 'yup';

export interface ProductDetailsProps {
    product: Product;
    categories: Category[];
}

export const ProductDetails: FC<ProductDetailsProps> = ({ product, categories }) => {
    const { addItem, getAmountOfSpecificItemAlreadyInCart, getCartAsRawData } = useCartContext()
    const { authToken } = useAuthContext()
    const [maxStock, setMaxStock] = useState(product.stock)
    const [alreadyInCart, setAlreadyInCart] = useState(0)

    useEffect(() => {
        getAddableMax()
    }, [getCartAsRawData()]);

    const getAddableMax = async () => {
        const getAddable = await getAmountOfSpecificItemAlreadyInCart(product.id)
        setAlreadyInCart(getAddable)
        setMaxStock(product.stock - getAddable)
    }

    const addToCartValidate = useCallback(() => {
        return object({
            amount: number()
                .required('Kérjük adja meg a mennyiséget')
                .min(1, 'A mennyiség nem lehet kevesebb, mint 1')
                .max(maxStock, `A maximális mennyiség ${maxStock}`)
        });
    }, [maxStock]);

    const { errors, values, isSubmitting, isValid, isValidating, handleChange, handleSubmit } = useFormik({
        initialValues: {
            amount: 1
        },
        onSubmit: async ({ amount }, { setFieldValue, setSubmitting }) => {
            addItem(product, amount)
            setFieldValue("amount", 1)
        },
        validationSchema: addToCartValidate,
    });

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
                        {
                            authToken &&
                            (
                                <>
                                    <Divider />
                                    {
                                        alreadyInCart > 0 &&
                                        <Text fontSize="lg" lineHeight="tall">Már {alreadyInCart} darab a kosaradban</Text>
                                    }
                                    {
                                        (product.stock > 0 && maxStock > 0) &&
                                        <Box marginTop={2} as="form" onSubmit={handleSubmit}>
                                            <Flex>
                                                <FormControl isInvalid={!!errors.amount}>
                                                    <Input name="amount" type="number" value={values.amount} onChange={handleChange} />
                                                    <FormErrorMessage>{errors.amount}</FormErrorMessage>
                                                    <Button paddingInline={6} marginTop={2} type="submit" isDisabled={isSubmitting || isValidating || !isValid}
                                                        mt={4}
                                                        size="lg"
                                                        colorScheme="teal"
                                                        variant="solid">
                                                        Kosárba tétel
                                                    </Button>
                                                </FormControl>
                                            </Flex>
                                        </Box>
                                    }
                                </>
                            )
                        }
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
