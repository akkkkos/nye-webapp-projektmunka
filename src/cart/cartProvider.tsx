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
            localCartItems.push({
                productId: product.id,
                amountInCart: amount
            })
            setCart({
                items: [...localCartItems]
            })
        },
        [cart, setCart]
    );

    const getTotalNofItems: CartContext['getTotalNofItems'] = useCallback(
        async (): Promise<number> => {
            console.log(getCartWithJoinedData())
            return cart.items.length;
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

    const state: CartContext = useMemo(() => ({
        getCartAsRawData,
        addItem,
        getTotalNofItems,
        getCartWithJoinedData
    }), [getCartAsRawData, addItem, getTotalNofItems, getCartWithJoinedData]);




    return (
        <CartContextProvider value={state}>
            {children}
        </CartContextProvider>
    );
};