import React, { FC, useEffect, useReducer, useState, MouseEvent } from 'react';
import { Text, Flex, Button, Grid, GridItem, Box, Input, Checkbox, Stack, Heading } from '@chakra-ui/react';
import { useParams, useSearchParams } from "react-router-dom";
import { Product } from '../model';
import { ProductsState, ProductSortType } from '../state';
import { ProductsStateReducer, productsReducer } from '../state/productsReducer';
import { useWebshopApi } from '../state/useWebshopApi';
import { ProductSearchParams } from '../state/productsState';
import { ProductListElement } from './products/ProductListElement';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

// Keresési oldalon
export const INITIAL_SEARCH_STATE: ProductsState = {
    products: [],
    total: 0,
    categories: ["cameras-photos"],
    orderBy: ProductSortType.RATING_DESC, // Alapértelmezett rendezés értékelés szerinti csökkenő sorrend
    offset: 0,
    limit: 6,
};

export const SearchPage: FC = () => {
    const { categoryId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [productsState, productsDispatch] = useReducer<ProductsStateReducer>(productsReducer, INITIAL_SEARCH_STATE);

    const [showDetailedSearch, setShowDetailedSearch] = useState(false);
    const [pageCount, setPageCount] = useState(1);

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [inStock, setInStock] = useState<boolean | null>(null);
    const [minRate, setMinRate] = useState<number | null>(null);
    const [maxRate, setMaxRate] = useState<number | null>(null);

    const { getProducts } = useWebshopApi();

    useEffect(() => {
        loadProducts();
    }, [searchParams]);

    const loadProducts = async () => {
        const pageCountParam = searchParams.get('page');
        if (pageCountParam) {
            setPageCount(Number.parseInt(pageCountParam));
            const newOffset = (Number.parseInt(pageCountParam) - 1) * INITIAL_SEARCH_STATE.limit;
            productsDispatch({ type: 'changeOffset', payload: { offset: newOffset } });
        }

        const orderByParam = searchParams.get('orderBy');
        if (orderByParam) {
            productsDispatch({ type: 'changeOrder', payload: orderByParam as ProductSortType });
        }

        const queryParam = searchParams.get('query');
        if (queryParam) setSearchQuery(queryParam);

        const defaultQuery: ProductSearchParams = {
            limit: INITIAL_SEARCH_STATE.limit,
            offset: pageCountParam ? (Number.parseInt(pageCountParam) - 1) * INITIAL_SEARCH_STATE.limit : INITIAL_SEARCH_STATE.offset,
            orderBy: orderByParam ? orderByParam as ProductSortType : INITIAL_SEARCH_STATE.orderBy,
            ...(categoryId != null && { categories: [categoryId] }),
            ...(queryParam != null && { query: queryParam }),
            ...(minPrice != null && { minPrice: minPrice }),
            ...(maxPrice != null && { maxPrice: maxPrice }),
            ...(inStock != null && { inStock: inStock }),
            ...(minRate != null && { minRate: minRate }),
            ...(maxRate != null && { maxRate: maxRate })
        };

        const _productsData = await getProducts(defaultQuery);
        productsDispatch({ type: 'setResults', payload: _productsData });
    };

    const handleKeresesClick = () => {
        setShowDetailedSearch(!showDetailedSearch);
        if (showDetailedSearch) {
            loadProducts();
        }
    };

    const handleKovetkezoOldal = (e: MouseEvent<HTMLButtonElement>) => {
        const newOldal = pageCount + 1;
        if ((newOldal - 1) * INITIAL_SEARCH_STATE.limit >= productsState.total) return;
        setPageCount(newOldal);
        setSearchParams({ ...Object.fromEntries(searchParams), page: newOldal.toString() });
    };

    const handleElozoOldal = (e: MouseEvent<HTMLButtonElement>) => {
        const newOldal = pageCount - 1;
        if (newOldal < 1) return;
        setPageCount(newOldal);
        setSearchParams({ ...Object.fromEntries(searchParams), page: newOldal.toString() });
    };

    const reloadProducts = async (offset: number, orderBy?: ProductSortType) => {
        const query: ProductSearchParams = {
            limit: INITIAL_SEARCH_STATE.limit,
            offset: offset,
            orderBy: orderBy ? orderBy : productsState.orderBy,
            ...(categoryId != null && { categories: [categoryId] }),
        };
        const _productsData = await getProducts(query);
        productsDispatch({ type: 'setResults', payload: _productsData });
    };

    const handleSortChange = (e: MouseEvent<HTMLButtonElement>) => {
        const nameOfButton = e.currentTarget.name;
        if (!nameOfButton) return;

        let newOrderBy: ProductSortType = productsState.orderBy;
        switch (nameOfButton) {
            case "nameSortSwitch":
                newOrderBy = productsState.orderBy === ProductSortType.NAME_ASC ? ProductSortType.NAME_DESC : ProductSortType.NAME_ASC;
                break;
            case "priceSortSwitch":
                newOrderBy = productsState.orderBy === ProductSortType.PRICE_ASC ? ProductSortType.PRICE_DESC : ProductSortType.PRICE_ASC;
                break;
            case "ratingSortSwitch":
                newOrderBy = productsState.orderBy === ProductSortType.RATING_ASC ? ProductSortType.RATING_DESC : ProductSortType.RATING_ASC;
                break;
            default:
                break;
        }
        productsDispatch({ type: 'changeOrder', payload: newOrderBy });
        setSearchParams({ ...Object.fromEntries(searchParams), orderBy: newOrderBy });
    };

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        if (type === 'checkbox') {
            setInStock(checked);
        } else if (type === 'number') {
            const numericValue = value ? Number(value) : null;
            switch (name) {
                case 'minPrice':
                    setMinPrice(numericValue);
                    break;
                case 'maxPrice':
                    setMaxPrice(numericValue);
                    break;
                case 'minRate':
                    setMinRate(numericValue);
                    break;
                case 'maxRate':
                    setMaxRate(numericValue);
                    break;
                default:
                    break;
            }
        } else {
            setSearchQuery(value);
        }
    };

    const handleFilterSubmit = () => {
        setSearchParams({
            query: searchQuery || "",
            minPrice: minPrice?.toString() || "",
            maxPrice: maxPrice?.toString() || "",
            inStock: inStock ? "true" : "false",
            minRate: minRate?.toString() || "",
            maxRate: maxRate?.toString() || "",
        });
    };

    return (
        <>
            <Box mb={6}>
                <Button onClick={handleKeresesClick} colorScheme="teal" size="lg" mb={4}>
                    Termékek Részletes Szűrése!
                </Button>
                {showDetailedSearch && (
                    <Box border="1px" borderColor="gray.200" p={4} borderRadius="md" boxShadow="sm">
                        <Stack spacing={4}>
                            <Input name="query" placeholder="Keresés" onChange={handleSearchInputChange} />
                            <Flex>
                                <Input name="minPrice" placeholder="Minimum ár" type="number" onChange={handleSearchInputChange} mr={2} />
                                <Input name="maxPrice" placeholder="Maximum ár" type="number" onChange={handleSearchInputChange} />
                            </Flex>
                            <Checkbox name="inStock" onChange={handleSearchInputChange}>Készleten</Checkbox>
                            <Flex>
                                <Input name="minRate" placeholder="Minimum értékelés" type="number" onChange={handleSearchInputChange} mr={2} />
                                <Input name="maxRate" placeholder="Maximum értékelés" type="number" onChange={handleSearchInputChange} />
                            </Flex>
                            <Button onClick={handleFilterSubmit} colorScheme="blue">Szűrés</Button>
                        </Stack>
                    </Box>
                )}
            </Box>

            <Heading as="h2" size="lg" mb={4}>Összes termék{categoryId ? " ebben a kategóriában" : ""}: {productsState.total}db</Heading>
            {productsState.total > 6 && (
                <Flex align="center" mb={4}>
                    <Text mr={4}>Oldal: {pageCount}</Text>
                    <Button onClick={handleElozoOldal} mr={2} disabled={pageCount === 1}>Előző</Button>
                    <Button onClick={handleKovetkezoOldal} disabled={(pageCount - 1) * INITIAL_SEARCH_STATE.limit >= productsState.total}>Következő</Button>
                </Flex>
            )}

            <Heading as="h3" size="md" mb={4}>Sorba rendezés:</Heading>
            <Flex mb={6}>
                <Button onClick={handleSortChange} name='nameSortSwitch' mr={2}>
                    Név {productsState.orderBy === ProductSortType.NAME_ASC ? (<FaArrowUp />) : (productsState.orderBy === ProductSortType.NAME_DESC ? <FaArrowDown /> : <></>)}
                </Button>
                <Button onClick={handleSortChange} name='priceSortSwitch' mr={2}>
                    Ár {productsState.orderBy === ProductSortType.PRICE_ASC ? (<FaArrowUp />) : (productsState.orderBy === ProductSortType.PRICE_DESC ? <FaArrowDown /> : <></>)}
                </Button>
                <Button onClick={handleSortChange} name='ratingSortSwitch'>
                    Értékelés {productsState.orderBy === ProductSortType.RATING_ASC ? (<FaArrowUp />) : (productsState.orderBy === ProductSortType.RATING_DESC ? <FaArrowDown /> : <></>)}
                </Button>
            </Flex>

            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {productsState.products.map((productData) => (
                    <GridItem key={productData.id}>
                        <ProductListElement {...productData} />
                    </GridItem>
                ))}
            </Grid>
        </>
    );
};
