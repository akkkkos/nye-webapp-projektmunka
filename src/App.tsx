import { Route, Routes } from 'react-router-dom';
import { ChakraProvider, Container, Divider, } from '@chakra-ui/react'
import { AuthProvider } from './auth/authProvider';
import { CartProvider } from './cart/cartProvider';
import { NavBar } from './components/NavBar';
import { KezdoLap } from './components/KezdoLap';
import { Login } from './components/Belepes';
import { UserProfile } from './components/Profil';
import { Register } from './components/Regisztracio';
import { TermekLista } from './components/TermekLista';
import { ProductPage } from './components/products/Product-page';
import { SearchPage } from './components/SearchPage';
import {CartPage} from './cart/Kosaroldal';

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
            <Route path="/profile" element={<UserProfile ></UserProfile>} />
            <Route path="/register" element={<Register></Register>} />
            <Route path="/category/:categoryId" element={<TermekLista/>} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage/>} />
            <Route path="/search" element={<SearchPage></SearchPage>} />
          </Routes>
        </Container>
        </CartProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
