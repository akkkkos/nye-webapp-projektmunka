import React, { ChangeEvent, FC, useState, FormEvent, useCallback, useEffect } from 'react';
import { Box, Flex, Text, Card, CardBody, Input, Heading, Button, FormControl, FormErrorMessage, FormLabel, Checkbox, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { useAuthContext } from '../auth/authContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import { shippingAddress } from '../model/RegisterData';
import { billingAddress } from '../model/RegisterData';
import { object, string, ref } from 'yup';
import { error } from 'console';

export const Register: FC = () => {
    const { register, authToken } = useAuthContext();
    const [registerError, setRegisterError] = useState("");
    const navigate = useNavigate();
    const [sameData, setSameData] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()
    

    const registerFormValidate = object().shape({
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
            .required('Kötelező kitölteni')
            .matches(/^\+{1}\d{1,}$/,
            'csak nemzetközi formátum (+-al kezdődő érték), tagoló elemek nélkül (csak számok)'
        ),
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

    const { errors, touched, values, isSubmitting, isValid, isValidating, handleChange, handleBlur, handleSubmit, resetForm, setFieldValue } = useFormik({
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
            console.log(billingAddress);
            if (registered) {
                onOpen();
                resetForm();
                /*
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
                */
            }
            setSubmitting(false);
        },
        validationSchema: registerFormValidate,
    });

    useEffect(() => {
        if(sameData) {
                setFieldValue("billingAddress.name", values.shippingAddress.name);
                setFieldValue("billingAddress.country", values.shippingAddress.country);
                setFieldValue("billingAddress.city", values.shippingAddress.city);
                setFieldValue("billingAddress.street", values.shippingAddress.street);
                setFieldValue("billingAddress.zip", values.shippingAddress.zip);
            }
    },[values.shippingAddress])

    const onRegister = useCallback(async (email: string, password: string, passwordConfirm: string, lastname: string, firstname: string, shippingAddress: object, billingAddress: object ): Promise<boolean> => {
        const error = await register(email, password, passwordConfirm, lastname, firstname, shippingAddress, billingAddress);
        if (error) {
            console.log(error);
            setRegisterError(error);
            return false;
        } else {
            return true;
        }
    }, [navigate, register]);

    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setSameData(isChecked);
        if (isChecked) {
            setFieldValue("billingAddress.name", values.shippingAddress.name);
            setFieldValue("billingAddress.country", values.shippingAddress.country);
            setFieldValue("billingAddress.city", values.shippingAddress.city);
            setFieldValue("billingAddress.street", values.shippingAddress.street);
            setFieldValue("billingAddress.zip", values.shippingAddress.zip);
        }
      };

    const handleChangeShipping = (e: React.ChangeEvent<HTMLInputElement>) => {
        const shippingValue = e.target.value;
        if(e.target.name === "shippingAddress.name"){
            setFieldValue("shippingAddress.name", shippingValue);
        }
        if(e.target.name === "shippingAddress.country"){
            setFieldValue("shippingAddress.country", shippingValue);
        }
        if(e.target.name === "shippingAddress.city"){
            setFieldValue("shippingAddress.city", shippingValue);
        }
        if(e.target.name === "shippingAddress.street"){
            setFieldValue("shippingAddress.street", shippingValue);
        }
        if(e.target.name === "shippingAddress.zip"){
            setFieldValue("shippingAddress.zip", shippingValue);
        }
      };
    const onLogin = () => {
        navigate("/login");
    }

    return (
    <>
        <Box justifyContent="center" as="form" onSubmit={handleSubmit}>
            <Card maxWidth="4xl" marginBottom="4">
                <CardBody>
                    <Heading as="h2" marginBottom="4">Regisztráció</Heading>
                    <FormControl isInvalid={!!errors.username&&touched.username}>
                        <FormLabel>E-mail cím:</FormLabel>
                        <Input name="username" value={values.username} onChange={handleChange} onBlur={handleBlur}/>
                        <FormErrorMessage>{(errors.username&&touched.username)?errors.username:""}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.password&&touched.password}>
                        <FormLabel>Jelszó:</FormLabel>
                        <Input name="password" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur}/>
                        <FormErrorMessage>{(errors.password&&touched.password)?errors.password:""}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.passwordConfirm&&touched.passwordConfirm}>
                        <FormLabel>Jelszó megerősítése:</FormLabel>
                        <Input name="passwordConfirm" type="password" value={values.passwordConfirm} onChange={handleChange} onBlur={handleBlur}/>
                        <FormErrorMessage>{(errors.passwordConfirm&&touched.passwordConfirm)?errors.passwordConfirm:""}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.lastname&&touched.lastname}>
                        <FormLabel>Vezetéknév:</FormLabel>
                        <Input name="lastname" value={values.lastname} onChange={handleChange} onBlur={handleBlur}/>
                        <FormErrorMessage>{(errors.lastname&&touched.lastname)?errors.lastname:""}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.firstname&&touched.firstname}>
                        <FormLabel>Keresztnév:</FormLabel>
                        <Input name="firstname" value={values.firstname} onChange={handleChange} onBlur={handleBlur}/>
                        <FormErrorMessage>{(errors.firstname&&touched.firstname)?errors.firstname:""}</FormErrorMessage>
                    </FormControl>
                </CardBody>
            </Card>
            <Card maxWidth="4xl"  marginBottom="4">
                <CardBody>
                    <Heading as ="h2" marginBottom="4">Szállítási cím (kötelező megadni)</Heading>
                    <FormControl isInvalid={!!errors.shippingAddress?.name&&touched.shippingAddress?.name}>
                        <FormLabel>Név:</FormLabel>
                        <Input name="shippingAddress.name" value={values.shippingAddress.name} onChange={handleChangeShipping} onBlur={handleBlur}/>
                        <FormErrorMessage>{(errors.shippingAddress?.name&&touched.shippingAddress?.name)?errors.shippingAddress.name:""}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.shippingAddress?.country&&touched.shippingAddress?.country}>
                        <FormLabel>Ország:</FormLabel>
                        <Input name="shippingAddress.country" value={values.shippingAddress.country} onChange={handleChangeShipping} onBlur={handleBlur}/>
                        <FormErrorMessage>{(errors.shippingAddress?.country&&touched.shippingAddress?.country)?errors.shippingAddress.country:""}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.shippingAddress?.city&&touched.shippingAddress?.city}>
                        <FormLabel>Város:</FormLabel>
                        <Input name="shippingAddress.city" value={values.shippingAddress.city} onChange={handleChangeShipping} onBlur={handleBlur}/>
                        <FormErrorMessage>{(errors.shippingAddress?.city&&touched.shippingAddress?.city)?errors.shippingAddress.city:""}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.shippingAddress?.street&&touched.shippingAddress?.street}>
                        <FormLabel>Utca, házszám:</FormLabel>
                        <Input name="shippingAddress.street" value={values.shippingAddress.street} onChange={handleChangeShipping} onBlur={handleBlur}/>
                        <FormErrorMessage>{(errors.shippingAddress?.street&&touched.shippingAddress?.street)?errors.shippingAddress.street:""}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.shippingAddress?.zip&&touched.shippingAddress?.zip}>
                        <FormLabel>Irányítószám:</FormLabel>
                        <Input name="shippingAddress.zip" value={values.shippingAddress.zip} onChange={handleChangeShipping} onBlur={handleBlur}/>
                        <FormErrorMessage>{(errors.shippingAddress?.zip&&touched.shippingAddress?.zip)?errors.shippingAddress.zip:""}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.shippingAddress?.phoneNumber&&touched.shippingAddress?.phoneNumber}>
                        <FormLabel>Telefonszám:</FormLabel>
                        <Input name="shippingAddress.phoneNumber" value={values.shippingAddress.phoneNumber} onChange={handleChange} onBlur={handleBlur}/>
                        <FormErrorMessage>{(errors.shippingAddress?.phoneNumber&&touched.shippingAddress?.phoneNumber)?errors.shippingAddress.phoneNumber:""}</FormErrorMessage>
                    </FormControl>
                </CardBody>
            </Card>
            <Card maxWidth="4xl">
                <CardBody>
                    <Checkbox id="sameData" onChange={handleCheck}>A számlázási cím legyen ugyanaz mint a szállítási cím</Checkbox>
                    <Heading as ="h2" marginBottom="4">Számlázási cím</Heading>
                    <FormControl isInvalid={!!errors.billingAddress?.name&&touched.billingAddress?.name}>
                        <FormLabel>Név:</FormLabel>
                        <Input name="billingAddress.name" value={values.billingAddress.name} onChange={handleChange} onBlur={handleBlur} isDisabled={sameData}/>
                        <FormErrorMessage>{(errors.billingAddress?.name&&touched.billingAddress?.name)?errors.billingAddress.name:""}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.billingAddress?.taxNumber&&touched.billingAddress?.taxNumber}>
                        <FormLabel>Adóazonosító:</FormLabel>
                        <Input name="billingAddress.taxNumber" value={values.billingAddress.taxNumber} onChange={handleChange} onBlur={handleBlur}/>
                        <FormErrorMessage>{(errors.billingAddress?.taxNumber&&touched.billingAddress?.taxNumber)?errors.billingAddress.taxNumber:""}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.billingAddress?.country&&touched.billingAddress?.country}>
                        <FormLabel>Ország:</FormLabel>
                        <Input name="billingAddress.country" value={values.billingAddress.country} onChange={handleChange} onBlur={handleBlur} isDisabled={sameData}/>
                        <FormErrorMessage>{(errors.billingAddress?.country&&touched.billingAddress?.country)?errors.billingAddress.country:""}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.billingAddress?.city&&touched.billingAddress?.city}>
                        <FormLabel>Város:</FormLabel>
                        <Input name="billingAddress.city" value={values.billingAddress.city} onChange={handleChange} onBlur={handleBlur} isDisabled={sameData}/>
                        <FormErrorMessage>{(errors.billingAddress?.city&&touched.billingAddress?.city)?errors.billingAddress.city:""}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.billingAddress?.street&&touched.billingAddress?.street}>
                        <FormLabel>Utca, házszám:</FormLabel>
                        <Input name="billingAddress.street" value={values.billingAddress.street} onChange={handleChange} onBlur={handleBlur} isDisabled={sameData}/>
                        <FormErrorMessage>{(errors.billingAddress?.street&&touched.billingAddress?.street)?errors.billingAddress.street:""}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.billingAddress?.zip&&touched.billingAddress?.zip}>
                        <FormLabel>Irányítószám:</FormLabel>
                        <Input name="billingAddress.zip" value={values.billingAddress.zip} onChange={handleChange} onBlur={handleBlur} isDisabled={sameData}/>
                        <FormErrorMessage>{(errors.billingAddress?.zip&&touched.billingAddress?.zip)?errors.billingAddress.zip:""}</FormErrorMessage>
                    </FormControl>
                    <Button margin="2" type="submit" isDisabled={isSubmitting || isValidating || !isValid}>Regisztrálás</Button>
                    <Button margin="2" type="button" onClick={() => resetForm()}>Mégse</Button>
                    <Text>{registerError}</Text>
                </CardBody>
            </Card>
        </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Elfogadva!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Sikeres regisztráció!
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='blue' mr={3} onClick={onLogin}>Belépés</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
);
}