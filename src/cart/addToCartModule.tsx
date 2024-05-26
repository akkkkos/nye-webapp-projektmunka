import { useFormik } from 'formik';
import { FC, useCallback, useEffect, useState } from 'react';
import { object, number } from 'yup';
import { useCartContext } from './cartContext';
import { Divider, Flex, FormControl, Input, FormErrorMessage, Button, Box, Text } from '@chakra-ui/react';
import { Product } from '../model';

export const AddToCartModule: FC<{product: Product}> = ({product}) => {
    const { addItem, getAmountOfSpecificItemAlreadyInCart, getCartAsRawData } = useCartContext()
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

    const { errors, values, isSubmitting, isValid, isValidating, handleChange, setFieldValue, handleSubmit } = useFormik({
        initialValues: {
            amount: 1
        },
        onSubmit: async ({ amount }, { setFieldValue, setSubmitting }) => {
            addItem(product, amount)
            setFieldValue("amount", 1)
        },
        validationSchema: addToCartValidate,
    });


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
        <>
            <Divider marginTop={3} marginBottom={3} />
            {
                alreadyInCart > 0 &&
                <Text>Már {alreadyInCart} darab a kosaradban</Text>
            }

            <Box marginTop={2} as="form" onSubmit={handleSubmit}>
                <Flex>
                    <FormControl isInvalid={!!errors.amount}>
                        <Input name="amount" type="text" value={values.amount} onChange={handleAmountChange} defaultValue={1} min={1} max={maxStock} step={1} isDisabled={isSubmitting || 1 > maxStock} />
                        <FormErrorMessage>{errors.amount}</FormErrorMessage>
                        <Button paddingInline={4} marginTop={2} type="submit" isDisabled={isSubmitting || isValidating || !isValid || 1 > maxStock}
                            size="md"
                            colorScheme="teal"
                        >Kosárba tétel</Button>
                    </FormControl>
                </Flex>
            </Box>
        </>
    )
}