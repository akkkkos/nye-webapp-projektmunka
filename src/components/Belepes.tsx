import React, { ChangeEvent, FC, useState, FormEvent, useCallback } from 'react';
import { Flex, Text, Card, CardBody, Input, Heading, Button } from '@chakra-ui/react';
import { useAuthContext } from '../auth/authContext';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuthContext();
    const navigate = useNavigate();

    const onSubmit = (event: FormEvent<HTMLDivElement>) => {
        event.preventDefault();
        onLogin(username,password);
    };


    const onLogin = useCallback(async (username: string, password: string) => {
        const error = await login(username, password);
        if (error) {
            console.log(error);
        } else {
            navigate('/');
        }
      }, [navigate, login]);

    return (
        <>
            <Flex justifyContent="center" as="form" onSubmit={onSubmit}>
                <Card maxWidth="4xl">
                    <CardBody>
                        <Heading as="h2" marginBottom="4">Belépés</Heading>
                        <Text>Felhasználónév</Text>
                        <Input placeholder='Felhasználónév' onChange={
                            (event: ChangeEvent<HTMLInputElement>) => {
                                setUsername(event.target.value);
                            }
                        } />
                        <Text>Jelszó</Text>
                        <Input type="password" placeholder='Jelszó' onChange={
                            (event: ChangeEvent<HTMLInputElement>) => {
                                setPassword(event.target.value);
                            }
                        } />

                        <Button type='submit' marginTop="2">Belépés</Button>
                    </CardBody>
                </Card>
            </Flex>
        </>
    );
}