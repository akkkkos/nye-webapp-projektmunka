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

  
  const getProducts = useCallback(async (query: ProductSearchParams): Promise<ReducedProducts> => {

    const searchParams = new URLSearchParams(query as Record<string, string>);

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
        throw new Error(response.status===401?'Hiba felhasználói adatok frissítése közben': 'Más hiba történt a felhasználói adatok frissítése közben'|| response.status===400? 'A bevitt adatok érvénytelenek':'Hibás adatok');
    }
    
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
    getUserProfile,
    getCategories,
    getProducts,
    putUserData,
    patchPassword
  };

};