import React, { FC, useEffect, useReducer, useState, MouseEvent } from 'react';
import { Text, Flex, Button, Grid , GridItem} from '@chakra-ui/react';
import { useParams, useSearchParams } from "react-router-dom";
import { Product } from '../model';
import { ProductsState, ProductSortType } from '../state';
import { ProductsStateReducer, productsReducer } from '../state/productsReducer';
import { useWebshopApi } from '../state/useWebshopApi';
import { ProductSearchParams } from '../state/productsState';
import { ProductListElement } from './products/ProductListElement';

export const INITIAL_STATE: ProductsState = {
    products: [],
    total: 0,
    categories: ["cameras-photos"],
    orderBy: ProductSortType.NAME_ASC,
    offset: 0,
    limit: 6
};

export const EgyKategoria: FC = () => {
    const { categoryId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [productsState, productsDispatch] = useReducer<ProductsStateReducer>(productsReducer, INITIAL_STATE)

    const [pageCount, setPageCount] = useState(1);

    const { getProducts } = useWebshopApi();

    useEffect(() => {
        loadProducts()
    }, []);

    useEffect(() => {
        setSearchParams({ "orderBy": productsState.orderBy, "page": pageCount.toString() });
    }, [productsState.orderBy, pageCount]);

    const loadProducts = async () => {
        const pageCountParam = searchParams.get('page')
        if (pageCountParam) {
            setPageCount(Number.parseInt(pageCountParam))
            const newOffset = (Number.parseInt(pageCountParam) - 1) * 6
            productsDispatch({ type: 'changeOffset', payload: { offset: newOffset } })
        }

        const orderByParam = searchParams.get('orderBy')
        if (orderByParam) {
            productsDispatch({ type: 'changeOrder', payload: orderByParam as ProductSortType })
        }

        const defaultQuery: ProductSearchParams = {
            limit: INITIAL_STATE.limit,
            offset: pageCountParam ? (Number.parseInt(pageCountParam) - 1) * 6 : INITIAL_STATE.offset,
            orderBy: orderByParam ? orderByParam as ProductSortType : INITIAL_STATE.orderBy,
            categories: categoryId ? [categoryId] : []
        }
        const _productsData = await getProducts(defaultQuery);
        console.log(_productsData);
        productsDispatch({ type: 'setResults', payload: _productsData });
    }

    const handleKovetkezoOldal = (e: MouseEvent<HTMLButtonElement>) => {
        const newOldal = pageCount + 1
        if ((newOldal - 1) * 6 >= productsState.total) return;
        setPageCount(newOldal)

        const newOffset = (newOldal - 1) * 6
        productsDispatch({ type: 'changeOffset', payload: { offset: newOffset } })
        reloadProducts(newOffset)
    }

    const handleElozoOldal = (e: MouseEvent<HTMLButtonElement>) => {
        const newOldal = pageCount - 1
        if (newOldal < 1) return;
        setPageCount(newOldal)

        const newOffset = (newOldal - 1) * 6
        productsDispatch({ type: 'changeOffset', payload: { offset: newOffset } })
        reloadProducts(newOffset)
    }

    const reloadProducts = async (offset: number, orderBy?: ProductSortType) => {
        const query: ProductSearchParams = {
            limit: INITIAL_STATE.limit,
            offset: offset,
            orderBy: orderBy ? orderBy : productsState.orderBy,
            categories: categoryId ? [categoryId] : []
        }
        const _productsData = await getProducts(query);
        console.log(_productsData);
        productsDispatch({ type: 'setResults', payload: _productsData });
    }

    const handleSortChange = (e: MouseEvent<HTMLButtonElement>) => {
        const nameOfButton = e.currentTarget.name;
        if (!nameOfButton) return;

        var newOrderBy: ProductSortType = productsState.orderBy;
        switch (nameOfButton) {
            case "nameSortSwitch":
                if (productsState.orderBy == ProductSortType.NAME_ASC) {
                    productsDispatch({ type: 'changeOrder', payload: ProductSortType.NAME_DESC })
                    newOrderBy = ProductSortType.NAME_DESC;
                }
                else {
                    productsDispatch({ type: 'changeOrder', payload: ProductSortType.NAME_ASC })
                    newOrderBy = ProductSortType.NAME_ASC;
                }
                break;
            case "priceSortSwitch":
                if (productsState.orderBy == ProductSortType.PRICE_ASC) {
                    productsDispatch({ type: 'changeOrder', payload: ProductSortType.PRICE_DESC })
                    newOrderBy = ProductSortType.PRICE_DESC;
                }
                else {
                    productsDispatch({ type: 'changeOrder', payload: ProductSortType.PRICE_ASC })
                    newOrderBy = ProductSortType.PRICE_ASC;
                }
                break;
            case "ratingSortSwitch":
                if (productsState.orderBy == ProductSortType.RATING_ASC) {
                    productsDispatch({ type: 'changeOrder', payload: ProductSortType.RATING_DESC })
                    newOrderBy = ProductSortType.RATING_DESC;
                }
                else {
                    productsDispatch({ type: 'changeOrder', payload: ProductSortType.RATING_ASC })
                    newOrderBy = ProductSortType.RATING_ASC;
                }
                break;

            default:
                break;
        }

        reloadProducts(productsState.offset, newOrderBy);
    }


    return (
        <>
            <Text>Összes termék ebben a kategóriában: {productsState.total}db</Text>

            {
                productsState.total > 6 &&
                (
                    <>
                        <Text>Oldal: {pageCount}</Text>
                        <Button onClick={handleElozoOldal}>Előző</Button>
                        <Button onClick={handleKovetkezoOldal}>Következő</Button>
                    </>
                )
            }

            <Text>Sorba rendezés:</Text>
            <Button onClick={handleSortChange} name='nameSortSwitch'>Név {productsState.orderBy == ProductSortType.NAME_ASC ? (<Text>▲</Text>) : (productsState.orderBy == ProductSortType.NAME_DESC ? <Text>▼</Text> : <></>)}</Button>
            <Button onClick={handleSortChange} name='priceSortSwitch'>Ár {productsState.orderBy == ProductSortType.PRICE_ASC ? (<Text>▲</Text>) : (productsState.orderBy == ProductSortType.PRICE_DESC ? <Text>▼</Text> : <></>)}</Button>
            <Button onClick={handleSortChange} name='ratingSortSwitch'>Értékelés {productsState.orderBy == ProductSortType.RATING_ASC ? (<Text>▲</Text>) : (productsState.orderBy == ProductSortType.RATING_DESC ? <Text>▼</Text> : <></>)}</Button>

            <Grid
                sx={{
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 12,
                }}
            >
                {
                    productsState.products.map((productData, index) =>
                        <GridItem key={productData.id}>
                            <ProductListElement {...productData} />
                        </GridItem>
                    )
                }
            </Grid>
        </>
    );
}