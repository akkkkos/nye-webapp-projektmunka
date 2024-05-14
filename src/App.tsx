import { Route, Routes } from 'react-router-dom';
import { ChakraProvider, Container, Divider, } from '@chakra-ui/react'
import { AuthProvider } from './auth/authProvider';
import { CartProvider } from './cart/cartProvider';
import { NavBar } from './components/NavBar';
import { KezdoLap } from './components/KezdoLap';
import { Login } from './components/Belepes';
import { EgyKategoria } from './components/EgyKategoria';

function App() {
  if (!localStorage.getItem("chakra-ui-color-mode-default")) {
    localStorage.setItem("chakra-ui-color-mode", "dark")
    localStorage.setItem("chakra-ui-color-mode-default", "set")
  }

  return (
    <ChakraProvider>
      <AuthProvider>
        <CartProvider>
          <Container maxWidth="7xl">
            <NavBar />
            <Divider marginBottom="2" />
            <Routes>
              <Route path="/" element={<KezdoLap></KezdoLap>} />
              <Route path="/login" element={<Login></Login>} />
              <Route path="/category/:categoryId" element={<EgyKategoria />} />
            </Routes>
          </Container>
        </CartProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
