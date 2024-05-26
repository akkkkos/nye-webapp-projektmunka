import React, { FC, useCallback, useEffect, useState } from 'react';
import { Card, CardBody, Image, Text, Flex, Box, Button, Input, FormErrorMessage, FormControl, Divider } from '@chakra-ui/react';
import { Product } from '../../model';
import { FaStar } from "react-icons/fa";
import { useFormik } from 'formik';
import { number, object } from 'yup';
import { useCartContext } from '../../cart/cartContext';
import { useAuthContext } from '../../auth/authContext';
import { useNavigate } from 'react-router-dom';

export const ProductListElement: FC<Product> = (product) => {
    const { addItem, getAmountOfSpecificItemAlreadyInCart, getCartAsRawData } = useCartContext()
    const [maxStock, setMaxStock] = useState(product.stock)
    const [alreadyInCart, setAlreadyInCart] = useState(0)

    useEffect(() => {
        getAddableMax()
    }, [getCartAsRawData()]);

    const getAddableMax = async () => {
        const getAddable = await getAmountOfSpecificItemAlreadyInCart(product.id)
        //console.log("already in cart:", getAddable)
        //console.log("setmax as:", product.stock - getAddable)
        setAlreadyInCart(getAddable)
        setMaxStock(product.stock - getAddable)
    };

    const addToCartValidate = useCallback(() => {
        return object({
            amount: number()
                .required('Kérjük adja meg a mennyiséget')
                .min(1, 'A mennyiség nem lehet kevesebb, mint 1')
                .max(maxStock, `A maximális mennyiség ${maxStock}`)
        });
    }, [maxStock]);

    const { errors, values, isSubmitting, isValid, isValidating, handleChange, handleSubmit, setFieldValue } = useFormik({
        initialValues: {
            amount: 1
        },
        onSubmit: async ({ amount }, { setFieldValue, setSubmitting }) => {
            addItem(product, amount)
            setFieldValue("amount", 1)
        },
        validationSchema: addToCartValidate,
    });

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

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fieldValue = e.target.value
        if (fieldValue == "") {
            setFieldValue("amount", fieldValue);
            return;
        }
        if (fieldValue.includes(".") || fieldValue.includes("-")) return
        if (Number.isNaN(fieldValue)) return;

        const fieldValueAsNumber = Number(fieldValue)
        if (!Number.isInteger(fieldValueAsNumber)) return
        if (Number.isNaN(fieldValueAsNumber)) return
        if (1 > fieldValueAsNumber || fieldValueAsNumber > maxStock) return

        setFieldValue("amount", fieldValue)
    }

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

                <>
                    <Divider marginTop={3} marginBottom={3} />
                    {
                        alreadyInCart > 0 &&
                        <Text>Már {alreadyInCart} darab a kosaradban</Text>
                    }

                    <Box marginTop={2} as="form" onSubmit={handleSubmit}>
                        <Flex>
                            <FormControl isInvalid={!!errors.amount}>
                                <Input name="amount" type="text" value={values.amount} onChange={handleAmountChange} defaultValue={1} min={1} max={maxStock} step={1} isDisabled={isSubmitting || 1 > maxStock}/>
                                <FormErrorMessage>{errors.amount}</FormErrorMessage>
                                <Button paddingInline={4} marginTop={2} type="submit" isDisabled={isSubmitting || isValidating || !isValid || 1 > maxStock}
                                    size="md"
                                    colorScheme="teal"
                                >Kosárba tétel</Button>
                            </FormControl>
                        </Flex>
                    </Box>
                </>
            </CardBody>
        </Card>
    );
}