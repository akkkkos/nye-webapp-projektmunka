import { useCallback } from 'react';
import { User } from '../auth/authContext';
import { Category } from '../model/Category';
import { ReducedProducts, Product } from '../model';
import { ProductSearchParams } from './productsState';


const BASE_URL = 'http://localhost:5000';

export const useWebshopApi = () => {

  const login = useCallback(async (username: string, password: string) => {
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error(response.status === 400 ? 'Hibás adatok' : 'Hibás felhasználónév vagy jelszó!');
    }
    const result = await response.json();
    return result.accessToken;
  }, []);

  const registerUser = useCallback(async (username: string, password: string, passwordConfirm: string, lastName: string, firstName: string, shippingAddress: object, billingAddress: object) => {
    const response = await fetch(`${BASE_URL}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, passwordConfirm, lastName, firstName, shippingAddress, billingAddress }),
    });
    if (!response.ok) {
      throw new Error(response.status === 400 ? 'Hibás adatok' : 'Felhasználó már létezik!');
    }
    const result = await response.json();
    return result;
  }, []);

  const getUserProfile = useCallback(
    async (authToken: string): Promise<User> => {
      const response = await fetch(`${BASE_URL}/user`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (!response.ok) {
        throw new Error('Érvénytelen token');
      }
      return response.json();
    },
    []
  );

  const getCategories = useCallback(async () => {
    const response = await fetch(`${BASE_URL}/products/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Hiba kategóriák lekérdezésénél');
    }
    var result: Category[] = await response.json();
    return result;
  }, []);


  const getProductsByParams = useCallback(async (query: ProductSearchParams): Promise<ReducedProducts> => {
    const searchParams = new URLSearchParams(query as Record<string, string>);

    console.log(query)
    if (query.minPrice) searchParams.append('minPrice', query.minPrice.toString());
    if (query.maxPrice ) searchParams.append('maxPrice', query.maxPrice.toString());
    if (query.inStock ) searchParams.append('inStock', query.inStock.toString());
    if (query.minRate ) searchParams.append('minRate', query.minRate.toString());
    if (query.maxRate ) searchParams.append('maxRate', query.maxRate.toString());
    if (query.categories) searchParams.append('categories', query.categories.join(','));

    const response = await fetch(`${BASE_URL}/products?${searchParams}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Hiba termékek lekérdezésénél');
    }
    const { data, total } = await response.json();
    return {
      products: data,
      total: total
    };
  }, []);

  const putUserData = useCallback(async (authToken: string | undefined, firstName: string, lastName: string): Promise<void> => {

    if (!authToken) {
      throw new Error('Auth token is undefined');
    }
    const requestBody = JSON.stringify({ firstName, lastName });

    const response = await fetch(`${BASE_URL}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error(response.status === 401 ? 'Hiba felhasználói adatok frissítése közben' : 'Más hiba történt a felhasználói adatok frissítése közben' || response.status === 400 ? 'A bevitt adatok érvénytelenek' : 'Hibás adatok');
    }

  }, []);

  const getProductsByIds = useCallback(async (ids: string[]): Promise<Product[]> => {
    if (ids.length == 0) return []

    const searchParams = new URLSearchParams();
    ids.forEach(id => searchParams.append('id', id));


    if (ids.length == 1) {

      const response = await fetch(`${BASE_URL}/products/${ids[0]}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Hiba termék lekérdezésénél');
      }
      const resultOne: Product = await response.json();
      return [resultOne];

    } else {


      const response = await fetch(`${BASE_URL}/products/list?${searchParams}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Hiba termékek lekérdezésénél');
      }
      const result: Product[] = await response.json();
      return result;
    }
  }, []);

  const getProductById = useCallback(async (productId: string): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Hiba termék lekérdezésénél');
    }
    const result: Product = await response.json();
    return result;
  }, []);

  const patchPassword = useCallback(async (authToken: string, oldPassword: string, password: string, passwordConfirm: string): Promise<void> => {
    if (!authToken) {
      throw new Error('Hiányzó vagy érvénytelen token.');
    }

    const requestBody = JSON.stringify({ oldPassword, password, passwordConfirm });

    const response = await fetch(`${BASE_URL}/user/login`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error(response.status === 401 ? 'Hibás adatok' : 'Ismeretlen hiba történt.');
    }
  }, []);

  return {
    login,
    registerUser,
    getUserProfile,
    getCategories,
    getProducts: getProductsByParams,
    getProductsByIds,
    getProductById,
    putUserData,
    patchPassword,
  }
};