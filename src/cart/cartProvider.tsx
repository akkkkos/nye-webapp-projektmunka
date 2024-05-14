import { FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { Cart, CartContext, CartContextProvider, ProductInCart, ProductInCartWithData } from './cartContext';
import { useNavigate } from 'react-router-dom';
import { useWebshopApi } from '../state/useWebshopApi';
import { Product } from '../model';

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
    const [cart, setCart] = useState<Cart>({ items: [] });
    const { getProductsByIds } = useWebshopApi()

    const addItem: CartContext['addItem'] = useCallback(
        async (product: Product, amount: number): Promise<string | void> => {
            var localCartItems = [...cart.items]

            const productIndex = localCartItems.findIndex(item => item.productId === product.id);

            if (productIndex !== -1) {
                localCartItems[productIndex].amountInCart += amount;
            } else {
                localCartItems.push({
                    productId: product.id,
                    amountInCart: amount
                });
            }

            setCart({
                items: [...localCartItems]
            })
        },
        [cart, setCart]
    );

    const getTotalNofItems: CartContext['getTotalNofItems'] = useCallback(
        async (): Promise<number> => {
            //console.log(getCartWithJoinedData())
            const totalItems = cart.items.reduce((sum, item) => sum + item.amountInCart, 0);
            return totalItems;
        },
        [cart.items]
    );

    const getCartAsRawData: CartContext['getCartAsRawData'] = useCallback(
        async (): Promise<ProductInCart[]> => {
            return cart.items
        },
        [cart.items]
    );

    const getProductIdsInCart = (): string[] => {
        var productids: string[] = []
        cart.items.forEach(item => {
            productids.push(item.productId)
        });
        return productids
    }

    const getCartWithJoinedData: CartContext['getCartWithJoinedData'] = useCallback(
        async (): Promise<ProductInCartWithData[]> => {
            if (cart.items.length == 0) return []

            var tempitems: ProductInCartWithData[] = []

            var productsFullData: Product[] = []
            productsFullData = await getProductsByIds(getProductIdsInCart())

            productsFullData.forEach(product => {
                var amountInCart = 0
                var found = false
                cart.items.forEach(cartitem => {
                    if (product.id == cartitem.productId && !found) {
                        amountInCart = cartitem.amountInCart
                        found = true
                    }
                });

                tempitems.push({
                    product,
                    amountInCart
                })
            });
            console.log(tempitems)
            return tempitems
        },
        [cart.items, getProductsByIds(getProductIdsInCart())]
    );

    const getAmountOfSpecificItemAlreadyInCart: CartContext['getAmountOfSpecificItemAlreadyInCart'] = useCallback(
        async (id: string): Promise<number> => {
            var amount = 0
            cart.items.forEach(item => {
                if (item.productId == id) 
                    {
                        amount = item.amountInCart
                    }
            });
            return amount
        },
        [cart.items]
    );

    const state: CartContext = useMemo(() => ({
        getCartAsRawData,
        addItem,
        getTotalNofItems,
        getCartWithJoinedData,
        getAmountOfSpecificItemAlreadyInCart,
    }), [getCartAsRawData, addItem, getTotalNofItems, getCartWithJoinedData, getAmountOfSpecificItemAlreadyInCart]);




    return (
        <CartContextProvider value={state}>
            {children}
        </CartContextProvider>
    );
};