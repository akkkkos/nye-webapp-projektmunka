import React, { FC, useEffect, useReducer, useState, MouseEvent } from 'react';
import { Text, Flex, Button, Grid, GridItem,Box, Input, Checkbox, Stack, Heading } from '@chakra-ui/react';
import { useParams, useSearchParams } from "react-router-dom";
import { Product } from '../model';
import { ProductsState, ProductSortType } from '../state';
import { ProductsStateReducer, productsReducer } from '../state/productsReducer';
import { useWebshopApi } from '../state/useWebshopApi';
import { ProductSearchParams } from '../state/productsState';
import { ProductListElement } from './products/ProductListElement';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

export const INITIAL_STATE: ProductsState = {
    products: [],
    total: 0,
    categories: ["cameras-photos"],
    orderBy: ProductSortType.NAME_ASC,
    offset: 0,
    limit: 6
};
// Keresési oldalon
export const INITIAL_SEARCH_STATE: ProductsState = {
    products: [],
    total: 0,
    categories: ["cameras-photos"],
    orderBy: ProductSortType.RATING_DESC, // Alapértelmezett rendezés értékelés szerinti csökkenő sorrend
    offset: 0,
    limit: 6,
   
};

export const TermekLista: FC<{ isSearch: boolean }> = ({ isSearch = false }) => {
    const { categoryId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [productsState, productsDispatch] = useReducer<ProductsStateReducer>(
        productsReducer,
        isSearch ? INITIAL_SEARCH_STATE : INITIAL_STATE // Keresési oldalon használja a keresési alapértelmezett állapotot, egyébként a nem keresési alapértelmezett állapotot
    );    
    const [showDetailedSearch, setShowDetailedSearch] = useState(false);
    const [pageCount, setPageCount] = useState(1);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [minPrice, setMinPrice] = useState<number | undefined>();
 const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [inStock, setInStock] = useState<boolean | undefined>();
  const [minRate, setMinRate] = useState<number | undefined>();
  const [maxRate, setMaxRate] = useState<number | undefined>();

    const { getProducts } = useWebshopApi();

    useEffect(() => {
        loadProducts();
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

        var defaultQuery: ProductSearchParams = categoryId ?
            {
                limit: INITIAL_SEARCH_STATE .limit,
                offset: pageCountParam ? (Number.parseInt(pageCountParam) - 1) * 6 : INITIAL_SEARCH_STATE .offset,
                orderBy: orderByParam ? orderByParam as ProductSortType : INITIAL_SEARCH_STATE .orderBy,
                categories: [categoryId],
                query: searchQuery || undefined,
                minPrice: minPrice,
                maxPrice: maxPrice,
                inStock: inStock,
                minRate: minRate,
                maxRate: maxRate
            } :
            {
                limit: INITIAL_SEARCH_STATE .limit,
                offset: pageCountParam ? (Number.parseInt(pageCountParam) - 1) * 6 : INITIAL_SEARCH_STATE .offset,
                orderBy: orderByParam ? orderByParam as ProductSortType : INITIAL_SEARCH_STATE .orderBy,
                query: searchQuery || undefined,
                minPrice: minPrice,
                maxPrice: maxPrice,
                inStock: inStock,
                minRate: minRate,
                maxRate: maxRate
            }
        const _productsData = await getProducts(defaultQuery);
        productsDispatch({ type: 'setResults', payload: _productsData });
    }

    const handleKeresesClick = () => {
            setShowDetailedSearch(!showDetailedSearch);
            if (showDetailedSearch) {
                loadProducts();
            }
        };

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
        const query: ProductSearchParams = categoryId ?
            {
                limit: INITIAL_STATE.limit,
                offset: offset,
                orderBy: orderBy ? orderBy : productsState.orderBy,
                categories: [categoryId]
            } :
            {
                limit: INITIAL_STATE.limit,
                offset: offset,
                orderBy: orderBy ? orderBy : productsState.orderBy
            }
        const _productsData = await getProducts(query);
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
    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        if (type === 'checkbox') {
            setInStock(checked);
        } else if (type === 'number') {
            const numericValue = value ? Number(value) : undefined;
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
        // Amikor a felhasználó a szűrés gombra kattint, frissítse a keresési paramétereket, és töltse be újra a termékeket
        setSearchParams({
            query: searchQuery || "",
            minPrice: minPrice?.toString() || "",
            maxPrice: maxPrice?.toString() || "",
            inStock: inStock ? "true" : "false",
            minRate: minRate?.toString() || "",
            maxRate: maxRate?.toString() || "",
        });
        loadProducts();
    };
    
    

    return (
        <>
            {isSearch && (
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
            )}

            {/* Közös rész a keresési és nem keresési oldalon */}
            <Heading as="h2" size="lg" mb={4}>Összes termék{categoryId ? " ebben a kategóriában" : ""}: {productsState.total}db</Heading>
            {productsState.total > 6 && (
                <Flex align="center" mb={4}>
                 <Text mr={4}>Oldal: {pageCount}</Text>
                    <Button onClick={handleElozoOldal} mr={2} disabled={pageCount === 1}>Előző</Button>
                    <Button onClick={handleKovetkezoOldal} disabled={(pageCount - 1) * 6 >= productsState.total}>Következő</Button>
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
                {productsState.products.map((productData, index) => (
                    <GridItem key={productData.id}>
                        <ProductListElement {...productData} />
                    </GridItem>
                ))}
            </Grid>
        </>
    );
    
    

}