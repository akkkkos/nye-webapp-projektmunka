import { Product, ReducedProducts } from "../model";

export interface ProductsState {
    products: Product[];
    total: number;
    orderBy: ProductSortType;
    categories: string[];
    offset: number;
    limit: number;
}

export enum ProductSortType {
    NAME_ASC = 'name.ASC',
    NAME_DESC = 'name.DESC',
    PRICE_ASC = 'price.ASC',
    PRICE_DESC = 'price.DESC',
    RATING_ASC = 'rating.ASC',
    RATING_DESC = 'rating.DESC',
}

export interface ProductOffset {
    offset: number;
}

export interface ProductsStateActions {
    changeOrder: (order: ProductSortType) => void,
    changeOffset: (offset: number) => void,
    setResults: (results: ReducedProducts) => void;
}

export interface ProductSearchParams {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    minRate?: number;
    maxRate?: number;
    categories?: string[] | null;
    orderBy?: ProductSortType;
    offset?: number;
    limit?: number;
}