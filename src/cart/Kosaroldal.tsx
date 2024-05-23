import React, { useEffect, useState, useCallback } from 'react';
import { useCartContext } from './cartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ProductInCartWithData } from './cartContext';
import { FaHandMiddleFinger } from 'react-icons/fa';
import { Button } from '@chakra-ui/react';


export const  CartPage: React.FC = () => {
  const { getCartWithJoinedData, addItem, getCartAsRawData } = useCartContext();
  const [cartItems, setCartItems] = useState<ProductInCartWithData[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const items = await getCartWithJoinedData();
      const filteredItems = items.filter(item => item.amountInCart !== 0); // Szűrés a mennyiség alapján
      setCartItems(filteredItems);
  
      const total = filteredItems.reduce((sum, item) => sum + item.product.price * item.amountInCart, 0);
      setTotalPrice(total);
    };
  
    fetchCartItems();
  }, [getCartWithJoinedData]);

  const handleRemoveItem = useCallback(async (productId: string) => {
    const item = cartItems.find(item => item.product.id === productId);
    if (item && item.amountInCart !== 0) { // Ellenőrizze, hogy az elem mennyisége nem nulla
      await addItem({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        rating: 0,
        categories: [],
        stock: 0,
        description: ''
      }, -item.amountInCart);
      const updatedCartItems = await getCartWithJoinedData();
      const filteredItems = updatedCartItems.filter(item => item.amountInCart !== 0); // Szűrés a mennyiség alapján
      setCartItems(filteredItems);
      const total = filteredItems.reduce((sum, item) => sum + item.product.price * item.amountInCart, 0);
      setTotalPrice(total);
    }
  }, [addItem, getCartWithJoinedData, cartItems]);
  
  
  const handleClearCart = useCallback(async () => {
    const rawCart = await getCartAsRawData();
    for (const item of rawCart) {
      await addItem({
        id: item.productId,
        name: '',
        price: 0,
        image: '',
        rating: 0,
        categories: [],
        stock: 0,
        description: ''
      }, -item.amountInCart);
    }
    setCartItems([]);
    setTotalPrice(0);
  }, [addItem, getCartAsRawData]);
  

  if (cartItems.length === 0) {
    return <p>A kosarad üres.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h1>Bevásárló kosár</h1>
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {cartItems.map(item => (
        <li key={item.product.id}>
          <img src={item.product.image} alt={item.product.name} width={300} />
          <Link to={`/product/${item.product.id}`} style={{ textDecoration: 'underline' }}>{item.product.name}</Link>
          <p>Egységár: ${item.product.price}</p>
          <p>Mennyiség: {item.amountInCart} darab</p>
          <p>Tétel összár: ${item.product.price * item.amountInCart}</p>
          <Button onClick={() => handleRemoveItem(item.product.id)}>Eltávolítás</Button>
        </li>
      ))}
    </ul>
    <p>Végösszeg: ${totalPrice}</p>
    <Button onClick={handleClearCart}>Kosár ürítése</Button>
    <h1></h1>
    <Button style={{ marginLeft: '8px' }} onClick={() => navigate('/penztar')}>Tovább a pénztárhoz</Button>
  </div>
  

  );
};
export default CartPage;