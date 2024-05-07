import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ChakraProvider, Container, Flex, Divider } from '@chakra-ui/react'
import { AuthProvider } from './auth/authProvider';
import { NavBar } from './components/NavBar';
import { KezdoLap } from './components/KezdoLap';
import { Login } from './components/Belepes';

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Container maxWidth="7xl">
          <NavBar />
          <Divider marginBottom="2"/>

          <Routes>
            <Route path="/" element={<KezdoLap></KezdoLap>} />
            <Route path="/login" element={<Login></Login>}/>
          </Routes>
        </Container>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
