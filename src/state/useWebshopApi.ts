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

  const getProductById = useCallback(async (productId:string):Promise<Product> => {
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



  return {
    login,
    getUserProfile,
    getCategories,
    getProducts: getProductsByParams,
    getProductsByIds,
    getProductById
  };

};