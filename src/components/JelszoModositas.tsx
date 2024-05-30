import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Box, Button, ButtonGroup, Card, CardBody, FormControl, FormErrorMessage, FormLabel, Heading, Input,Text } from '@chakra-ui/react';
import { useAuthContext } from '../auth/authContext';
import { useWebshopApi } from '../state/useWebshopApi';

const ChangePassword: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();
    const { authToken, logout } = useAuthContext();
    const { patchPassword } = useWebshopApi();

    const validationSchema = Yup.object({
        oldPassword: Yup.string()
            .min(8, 'A jelszónak legalább 8 karakter hosszúnak kell lennie')
            .matches(
                /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
                'A jelszónak legalább 8 karakter hosszúnak kell lennie legalább 1 számmal és 1 kisbetűvel')
            .required('Kötelező mező'),
        password: Yup.string()
            .min(8, 'A jelszónak legalább 8 karakter hosszúnak kell lennie')
            .matches(
                /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
                'Az új jelszónak legalább 8 karakter hosszúnak kell lennie legalább 1 számmal és 1 kisbetűvel')
            .notOneOf([Yup.ref('oldPassword')], 'Az új jelszó nem egyezhet meg a régi jelszóval')
            .required('Kötelező mező'),
        passwordConfirm: Yup.string()
            .oneOf([Yup.ref('password')], 'A két jelszó nem egyezik meg')
            .required('Kötelező mező'),
    });

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            password: '',
            passwordConfirm: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setError(null);
            setSuccess(null);

            if (!authToken) {
                navigate('/login');
                return;
            }

            try {
                await patchPassword(authToken, values.oldPassword, values.password, values.passwordConfirm);
                setSuccess('Jelszó sikeresen megváltoztatva!');
                navigate('/profile');
            } catch (err) {
                if (err instanceof Error) {
                    if (err.message === 'Hiányzó vagy érvénytelen token.') {
                        logout();
                    } else {
                        setError(err.message);
                    }
                } else {
                    setError('Ismeretlen hiba történt.');
                }
            }
        },
    });

    return (
        <Box padding="25px" justifyContent="center" as="form" onSubmit={formik.handleSubmit}>

            <Card maxWidth="2xl" mx="auto">
                <CardBody>
                    <Heading as="h2" marginBottom="4" textAlign="center">Jelszó Módosítása</Heading>
                    <FormControl isInvalid={!!(formik.touched.oldPassword && formik.errors.oldPassword)} mb="15px">
                        <FormLabel>Régi Jelszó</FormLabel>
                        <Input
                            type="password"
                            name="oldPassword"
                            placeholder="Régi Jelszó"
                            value={formik.values.oldPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            bg="transparent"
                        />
                        <FormErrorMessage>{formik.errors.oldPassword}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!(formik.touched.password && formik.errors.password)} mb="15px">
                        <FormLabel>Új Jelszó</FormLabel>
                        <Input
                            type="password"
                            name="password"
                            placeholder="Új Jelszó"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            bg="transparent"
                        />
                        <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!(formik.touched.passwordConfirm && formik.errors.passwordConfirm)} mb="15px">
                        <FormLabel>Új Jelszó Megerősítése</FormLabel>
                        <Input
                            type="password"
                            name="passwordConfirm"
                            placeholder="Új Jelszó Megerősítése"
                            value={formik.values.passwordConfirm}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            bg="transparent"
                        />
                        <FormErrorMessage>{formik.errors.passwordConfirm}</FormErrorMessage>
                    </FormControl>
                    {error && <Text color="red.500" textAlign="center" mt="10px">{error}</Text>}
                        {success && <Text color="green.500" textAlign="center" mt="10px">{success}</Text>}
                    <ButtonGroup>
                        <Button type="submit" colorScheme="green" width="100%" isDisabled={!formik.isValid || formik.isSubmitting}>
                            Mentés
                        </Button>
                    </ButtonGroup>
                </CardBody>
            </Card>
        </Box>
    );
};

export default ChangePassword;
