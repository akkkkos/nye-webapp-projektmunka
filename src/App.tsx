import { Route, Routes } from 'react-router-dom';
import { ChakraProvider, Container, Divider, } from '@chakra-ui/react'
import { AuthProvider } from './auth/authProvider';
import { NavBar } from './components/NavBar';
import { KezdoLap } from './components/KezdoLap';
import { Login } from './components/Belepes';
import { EgyKategoria } from './components/EgyKategoria';
import { ProductPage } from './components/products/Product-page';


function App() {
  if (!localStorage.getItem("chakra-ui-color-mode-default")) {
    localStorage.setItem("chakra-ui-color-mode", "dark")
    localStorage.setItem("chakra-ui-color-mode-default", "set")
  }
  
  return (
    <ChakraProvider>
      <AuthProvider>
        <Container maxWidth="7xl">
          <NavBar />
          <Divider marginBottom="2" />
          <Routes>
            <Route path="/" element={<KezdoLap></KezdoLap>} />
            <Route path="/login" element={<Login></Login>} />
            <Route path="/category/:categoryId" element={<EgyKategoria />} />
            <Route path="/product/:productId" element={<ProductPage />} />
          </Routes>
        </Container>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
