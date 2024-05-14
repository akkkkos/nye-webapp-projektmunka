import { createContext, useContext } from 'react';
import { Product } from '../model';

export interface ProductInCart {
  productId: string,
  amountInCart: number,
}

export interface Cart {
  items: ProductInCart[],
}

export interface ProductInCartWithData {
  product: Product,
  amountInCart: number,
}

export interface CartWithData
{
  items: ProductInCartWithData[]
}

export interface CartContext {
  getCartAsRawData: () => Promise<ProductInCart[]>;
  addItem: (product: Product, amount: number) => Promise<string | void>;
  getTotalNofItems: () => Promise<number>;
  getCartWithJoinedData: () => Promise<ProductInCartWithData[]>;
  getAmountOfSpecificItemAlreadyInCart: (id:string) => Promise<number>;
};

export const createCartContext = () => {
  const context = createContext<CartContext | null>(null);

  const useCartContext = () => {
    const ctx = useContext<CartContext | null>(
      //@ts-ignore
      context as CartContext
    );
    if (!ctx) {
      throw new Error('cartContext must be within a CartContextProvider component');
    }
    return ctx;
  };
  return [useCartContext, context.Provider] as const;
};

export const [useCartContext, CartContextProvider] = createCartContext();
