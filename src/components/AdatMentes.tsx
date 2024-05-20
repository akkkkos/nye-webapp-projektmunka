import React, { FC, FormEvent, useState, useEffect } from 'react';
import {Button,Flex,FormControl,FormErrorMessage,FormLabel,Input,VStack,Text,} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup'; // Yup segítségével validáljuk az űrlap adatokat
import { useAuthContext } from '../auth/authContext'; // Adjust the path as necessary
import { User } from '../auth/authContext';

interface UserEditorFormProps {
    firstName: string;
    lastName: string;
    onSubmit: (firstName: string, lastName: string) => void;
    onSaveSubmit?: (firstName: string, lastName: string) => void;
    
}

const validationSchema = yup.object().shape({
    firstName: yup.string().required('Keresztnév kötelező'),
    lastName: yup.string().required('Vezetéknév kötelező'),
});

export const UserEditorForm: FC<UserEditorFormProps> = ({ firstName, lastName, onSubmit, onSaveSubmit }) => {
    const {user, setUser} = useAuthContext();
   
    const [updatedUser, setUpdatedUser] = useState<User | null>(null
);

    useEffect(() => {
        console.log('UserEditorForm mounted');
        return () => {
            console.log('UserEditorForm unmounted');
        };
    }, []);

    const formik = useFormik({
        initialValues: {
            firstName: firstName,
            lastName: lastName,
        },
        validationSchema,
        onSubmit: async (formValues, { setSubmitting, setStatus }) => {
            console.log('Form submission started', formValues);
            try {
                await onSubmit(formValues.firstName, formValues.lastName);
                if (onSaveSubmit) {
                    await onSaveSubmit(formValues.firstName, formValues.lastName);
                }

                // Update the user context
                if (user) {
                    const newUser = { ...user, firstName: formValues.firstName, lastName: formValues.lastName };
             setUser(newUser);
                    setUpdatedUser(newUser);
                    console.log('User updated', newUser);
                    
                }
               
                setStatus('UPDATED');
                console.log('Form submission successful');
            } catch (error) {
                setStatus('ERROR');
                console.error('Form submission error', error);
            } finally {
                setSubmitting(false);
                console.log('Form submission ended');
            }
        },
    });

    useEffect(() => {
        if (formik.isSubmitting) {
            console.log('Form is submitting...');
        }
    }, [formik.isSubmitting]);

    return (
        <VStack as="form" spacing="4" onSubmit={(event: FormEvent<HTMLDivElement>) => formik.handleSubmit(event as unknown as FormEvent<HTMLFormElement>)}>
            <FormControl isInvalid={!!formik.errors.firstName} isRequired>
                <FormLabel htmlFor="firstName">Keresztnév</FormLabel>
                <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={(e) => {
                        console.log('First name changed', e.target.value);
                        formik.handleChange(e);
                    }}
                />
                <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formik.errors.lastName} isRequired>
                <FormLabel htmlFor="lastName">Vezetéknév</FormLabel>
                <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={(e) => {
                        console.log('Last name changed', e.target.value);
                        formik.handleChange(e);
                    }}
                />
                <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
            </FormControl>

            <Button type="submit" isDisabled={!formik.isValid || formik.isSubmitting}>
                Mentés
            </Button>

            {updatedUser && (
                <Flex direction="column" mt="4">
                    <Text>Updated User Data:</Text>
                    <Text>First Name: {updatedUser.firstName}</Text>
                    <Text>Last Name: {updatedUser.lastName}</Text>
                </Flex>
            )}
        </VStack>
    );
};