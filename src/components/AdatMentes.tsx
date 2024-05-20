import React, { FC, FormEvent, useState, useEffect } from 'react';
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, VStack, Text } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuthContext } from '../auth/authContext';
import { User } from '../auth/authContext';
import { useWebshopApi } from '../state/useWebshopApi';

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
    const { authToken } = useAuthContext();
    const { putUserData } = useWebshopApi();

    const [updatedFirstName, setUpdatedFirstName] = useState(firstName);
    const [updatedLastName, setUpdatedLastName] = useState(lastName);

    
    const formik = useFormik({
        initialValues: {
            firstName: firstName,
            lastName: lastName,
        },
        validationSchema,
        onSubmit: async (formValues, { setSubmitting, setStatus }) => {
            console.log('Form submission started', formValues);
            try {
                await putUserData(authToken, formValues.firstName, formValues.lastName);
                setUpdatedFirstName(formValues.firstName);
                setUpdatedLastName(formValues.lastName);
                onSubmit(formValues.firstName, formValues.lastName); // Call onSubmit with updated data

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

    // useEffect to automatically refresh the page when updatedFirstName or updatedLastName changes
    useEffect(() => {
        if (updatedFirstName !== firstName || updatedLastName !== lastName) {
            window.location.reload(); // Reload the page
        }
    }, [updatedFirstName, updatedLastName, firstName, lastName]);

    return (
        <VStack as="form" spacing="4" onSubmit={(event: FormEvent<HTMLDivElement>) => formik.handleSubmit(event as unknown as FormEvent<HTMLFormElement>)}>
            <FormControl isInvalid={!!formik.errors.firstName} isRequired>
                <FormLabel htmlFor="firstName">Keresztnév</FormLabel>
                <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
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
                    onChange={formik.handleChange}
                />
                <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
            </FormControl>

            <Button type="submit" isDisabled={!formik.isValid || formik.isSubmitting}>
                Mentés
            </Button>
        </VStack>
    );
};
