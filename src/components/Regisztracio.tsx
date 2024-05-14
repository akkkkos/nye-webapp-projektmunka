import React, { ChangeEvent, FC, useState, FormEvent, useCallback, useEffect } from 'react';
import { Box, Flex, Text, Card, CardBody, Input, Heading, Button, FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { useAuthContext } from '../auth/authContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import { shippingAddress } from '../model/RegisterData';
import { billingAddress } from '../model/RegisterData';
import { object, string, ref } from 'yup';

export const Register: FC = () => {
    const { register, authToken } = useAuthContext();
    const [registerError, setRegisterError] = useState("");
    const navigate = useNavigate();

    const registerFormValidate = object({
        username: string()
            .required('Kérjük adja meg az E-mail címét')
            .email('Hibás E-mail cím'),
        password: string()
            .required('Kérjük adja meg jelszavát')
            .matches(
                /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
                'A jelszónak legalább 8 karakter hosszúnak kell lennie legalább 1 számmal és 1 kisbetűvel'
            ),
        passwordConfirm: string()
            .required('Kérjük adja meg a jelszavát újra')
            .oneOf([ref('password')],
            'a tartalma meg kell egyezzen a jelszó mezővel'
        ),
        lastname: string()
            .required('Kötelező kitölteni'    
        ),
        firstname: string()
            .required('Kötelező kitölteni'    
        ),
        shippingAddress: object().shape({
            name: string()
            .required('Kötelező kitölteni'),
            country: string()
            .required('Kötelező kitölteni'),
            city: string()
            .required('Kötelező kitölteni'),
            street: string()
            .required('Kötelező kitölteni'),
            zip: string()
            .required('Kötelező kitölteni'),
            phoneNumber: string()
            .required('Kötelező kitölteni'),
        }),
        billingAddress: object().shape({
            name: string()
            .required('Kötelező kitölteni'),
            taxNumber: string()
            .required('Kötelező kitölteni')
            .matches(
                /^(?=.{11,})/,
                '11 számjegyből áll'),
            country: string()
            .required('Kötelező kitölteni'),
            city: string()
            .required('Kötelező kitölteni'),
            street: string()
            .required('Kötelező kitölteni'),
            zip: string()
            .required('Kötelező kitölteni'),
        }),
        
    });

    const { errors, values, isSubmitting, isValid, isValidating, handleChange, handleSubmit } = useFormik({
        initialValues: {
            username: '',
            password: '',
            passwordConfirm: '',
            lastname: '',
            firstname: '',
            shippingAddress:{
                name: '',
                country: '',
                city: '',
                street: '',
                zip: '',
                phoneNumber: ''
            },
            billingAddress:{
                name: '',
                taxNumber: '',
                country: '',
                city: '',
                street: '',
                zip: ''
            }
        },
        onSubmit: async ({ username, password, passwordConfirm, lastname, firstname, shippingAddress, billingAddress }, { setFieldValue, setSubmitting }) => {
            const registered = await onRegister(username, password, passwordConfirm, lastname, firstname, shippingAddress, billingAddress);
            if (!registered) {
                setFieldValue('username', '');
                setFieldValue('password', '');
                setFieldValue('passwordConfirm', '');
                setFieldValue('lastname', '');
                setFieldValue('firstname', '');
                setFieldValue('shippingAddress.name', '');
                setFieldValue('shippingAddress.country', '');
                setFieldValue('shippingAddress.city', '');
                setFieldValue('shippingAddress.street', '');
                setFieldValue('shippingAddress.zip', '');
                setFieldValue('shippingAddress.phoneNumber', '');
                setFieldValue('billingAddress.name', '');
                setFieldValue('billingAddress.taxNumber', '');
                setFieldValue('billingAddress.country', '');
                setFieldValue('billingAddress.city', '');
                setFieldValue('billingAddress.street', '');
                setFieldValue('billingAddress.zip', '');
            }
            setSubmitting(false);
        },
        validationSchema: registerFormValidate,
    });

    const onRegister = useCallback(async (email: string, password: string, passwordConfirm: string, lastname: string, firstname: string, shippingAddress: object, billingAddress: object ): Promise<boolean> => {
        const error = await register(email, password, passwordConfirm, lastname, firstname, shippingAddress, billingAddress);
        if (error) {
            console.log(error);
            setRegisterError(error);
            return false;
        } else {

            navigate('/login');
            return true;
        }
    }, [navigate, register]);

    return (
    <>
        <Box justifyContent="center" as="form" onSubmit={handleSubmit}>
            <Card maxWidth="4xl" marginBottom="4">
                <CardBody>
                    <Heading as="h2" marginBottom="4">Regisztráció</Heading>
                    <FormControl isInvalid={!!errors.username}>
                        <FormLabel>E-mail cím:</FormLabel>
                        <Input name="username" value={values.username} onChange={handleChange} />
                        <FormErrorMessage>{errors.username}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.password}>
                        <FormLabel>Jelszó:</FormLabel>
                        <Input name="password" type="password" value={values.password} onChange={handleChange} />
                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.passwordConfirm}>
                        <FormLabel>Jelszó megerősítése:</FormLabel>
                        <Input name="passwordConfirm" type="password" value={values.passwordConfirm} onChange={handleChange} />
                        <FormErrorMessage>{errors.passwordConfirm}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.lastname}>
                        <FormLabel>Vezetéknév:</FormLabel>
                        <Input name="lastname" value={values.lastname} onChange={handleChange} />
                        <FormErrorMessage>{errors.lastname}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.firstname}>
                        <FormLabel>Keresztnév:</FormLabel>
                        <Input name="firstname" value={values.firstname} onChange={handleChange} />
                        <FormErrorMessage>{errors.firstname}</FormErrorMessage>
                    </FormControl>
                </CardBody>
            </Card>
            <Card maxWidth="4xl"  marginBottom="4">
                <CardBody>
                    <Heading as ="h2" marginBottom="4">Szállítási cím (kötelező megadni)</Heading>
                    <FormControl isInvalid={!!errors.shippingAddress?.name}>
                        <FormLabel>Név:</FormLabel>
                        <Input name="shippingAddress.name" value={values.shippingAddress.name} onChange={handleChange} />
                        <FormErrorMessage>{errors.shippingAddress?.name}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.shippingAddress?.country}>
                        <FormLabel>Ország:</FormLabel>
                        <Input name="shippingAddress.country" value={values.shippingAddress.country} onChange={handleChange} />
                        <FormErrorMessage>{errors.shippingAddress?.country}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.shippingAddress?.city}>
                        <FormLabel>Város:</FormLabel>
                        <Input name="shippingAddress.city" value={values.shippingAddress.city} onChange={handleChange} />
                        <FormErrorMessage>{errors.shippingAddress?.city}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.shippingAddress?.street}>
                        <FormLabel>Utca, házszám:</FormLabel>
                        <Input name="shippingAddress.street" value={values.shippingAddress.street} onChange={handleChange} />
                        <FormErrorMessage>{errors.shippingAddress?.street}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.shippingAddress?.zip}>
                        <FormLabel>Irányítószám:</FormLabel>
                        <Input name="shippingAddress.zip" value={values.shippingAddress.zip} onChange={handleChange} />
                        <FormErrorMessage>{errors.shippingAddress?.zip}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.shippingAddress?.phoneNumber}>
                        <FormLabel>Telefonszám:</FormLabel>
                        <Input name="shippingAddress.phoneNumber" value={values.shippingAddress.phoneNumber} onChange={handleChange} />
                        <FormErrorMessage>{errors.shippingAddress?.phoneNumber}</FormErrorMessage>
                    </FormControl>
                </CardBody>
            </Card>
            <Card maxWidth="4xl">
                <CardBody>
                    <Heading as ="h2" marginBottom="4">Számlázási cím</Heading>
                    <FormControl isInvalid={!!errors.billingAddress?.name}>
                        <FormLabel>Név:</FormLabel>
                        <Input name="billingAddress.name" value={values.billingAddress.name} onChange={handleChange} />
                        <FormErrorMessage>{errors.billingAddress?.name}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.billingAddress?.taxNumber}>
                        <FormLabel>Adóazonosító:</FormLabel>
                        <Input name="billingAddress.taxNumber" value={values.billingAddress.taxNumber} onChange={handleChange} />
                        <FormErrorMessage>{errors.billingAddress?.taxNumber}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.billingAddress?.country}>
                        <FormLabel>Ország:</FormLabel>
                        <Input name="billingAddress.country" value={values.billingAddress.country} onChange={handleChange} />
                        <FormErrorMessage>{errors.billingAddress?.country}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.billingAddress?.city}>
                        <FormLabel>Város:</FormLabel>
                        <Input name="billingAddress.city" value={values.billingAddress.city} onChange={handleChange} />
                        <FormErrorMessage>{errors.billingAddress?.city}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.billingAddress?.street}>
                        <FormLabel>Utca, házszám:</FormLabel>
                        <Input name="billingAddress.street" value={values.billingAddress.street} onChange={handleChange} />
                        <FormErrorMessage>{errors.billingAddress?.street}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.billingAddress?.zip}>
                        <FormLabel>Irányítószám:</FormLabel>
                        <Input name="billingAddress.zip" value={values.billingAddress.zip} onChange={handleChange} />
                        <FormErrorMessage>{errors.billingAddress?.zip}</FormErrorMessage>
                    </FormControl>
                    <Button margin="2" type="submit" isDisabled={isSubmitting || isValidating || !isValid}>Regisztrálás</Button>
                    <Button>Mégse</Button>
                    <Text>{registerError}</Text>
                </CardBody>
            </Card>
        </Box>
    </>
);
}