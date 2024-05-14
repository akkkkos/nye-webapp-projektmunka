import React, { FC } from 'react';
import { Card, CardBody, Image, Text, Flex, Box, Button, Input, FormErrorMessage, FormControl } from '@chakra-ui/react';
import { Product } from '../../model';
import { FaStar } from "react-icons/fa";
import { useFormik } from 'formik';
import { number, object } from 'yup';
import { useCartContext } from '../../cart/cartContext';

export const ProductListElement: FC<Product> = (product) => {
    const { addItem } = useCartContext()

    const addToCartValidate = object({
        amount: number()
            .required('Kérjük adja meg a mennyiséget')
            .min(1, 'A mennyiség nem lehet kevesebb, mint 1')
            .max(product.stock, `A maximális mennyiség ${product.stock}`)
    });

    const { errors, values, isSubmitting, isValid, isValidating, handleChange, handleSubmit } = useFormik({
        initialValues: {
            amount: 1
        },
        onSubmit: async ({ amount }, { setFieldValue, setSubmitting }) => {
            addItem(product, amount)
        },
        validationSchema: addToCartValidate,
    });

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= product.rating; i++) {
            stars.push(<FaStar />);
        }
        return stars;
    };

    return (
        <Card margin="2" minWidth={200} size="md" _hover={{ cursor: 'pointer' }}>
            <Image
                // objectFit='none'
                maxW={{ base: '100%', sm: '400px' }}
                src={`${product.image}?cache=${Math.random()}`}
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

                {
                    product.stock > 0 &&
                    <Box marginTop={2} as="form" onSubmit={handleSubmit}>
                        <Flex>
                            <FormControl isInvalid={!!errors.amount}>
                                <Input name="amount" type="number" value={values.amount} onChange={handleChange} />
                                <FormErrorMessage>{errors.amount}</FormErrorMessage>
                                <Button paddingInline={6} marginTop={2} type="submit" isDisabled={isSubmitting || isValidating || !isValid}>Kosárba tétel</Button>
                            </FormControl>
                        </Flex>
                    </Box>
                }
            </CardBody>
        </Card>
    );
}