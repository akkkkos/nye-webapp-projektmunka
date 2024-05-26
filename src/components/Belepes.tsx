import React, { ChangeEvent, FC, useState, FormEvent, useCallback, useEffect } from 'react';
import { Box, Flex, Text, Card, CardBody, Input, Heading, Button, FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { useAuthContext } from '../auth/authContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import { object, string } from 'yup';

export const Login: FC = () => {
    const { login, authToken } = useAuthContext();
    const [loginError, setLoginError] = useState("")
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        if (authToken) {
            console.log(location);
            console.log("Already logged in, redirecting...");
            navigate("/profile");
            return;
        }
    }, [location])

    const loginFormValidate = object({
        username: string()
            .required('Kérjük adja meg az E-mail címét')
            .email('Hibás E-mail cím'),
        password: string()
            .required('Kérjük adja meg jelszavát')
            .matches(
                /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
                'A jelszónak legalább 8 karakter hosszúnak kell lennie legalább 1 számmal és 1 kisbetűvel'
            ),
    });

    const { errors, values, isSubmitting, isValid, isValidating, handleChange, handleSubmit } = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        onSubmit: async ({ username, password }, { setFieldValue, setSubmitting }) => {
            const loggedIn = await onLogin(username, password);
            if (!loggedIn) {
                setFieldValue('password', '');
            }
            setSubmitting(false);
        },
        validationSchema: loginFormValidate,
    });



    const onLogin = useCallback(async (email: string, password: string): Promise<boolean> => {
        const error = await login(email, password);
        if (error) {
            console.log(error)
            setLoginError(error)
            return false;
        } else {
            navigate('/');
            return true
        }
    }, [navigate, login]);

    return (
        <>
            <Box justifyContent="center" as="form" onSubmit={handleSubmit}>
                <Card maxWidth="4xl">
                    <CardBody>
                        <Heading as="h2" marginBottom="4">Belépés</Heading>

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
                        <Button margin="2" type="submit" isDisabled={isSubmitting || isValidating || !isValid}>Belépés</Button>
                        <Text>{loginError}</Text>
                    </CardBody>
                </Card>
            </Box>
        </>
    );
}