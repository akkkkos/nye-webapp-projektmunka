import { ReducedProducts } from "../model";
import { ProductSortType, ProductsState, ProductsStateActions, ProductOffset } from "./productsState";
import { Reducer } from 'react';


export interface PayloadAction<P> {
    type: keyof ProductsStateActions;
    payload: P;
};

export const productsStateReducer = {
    changeOrder: (
        state: ProductsState,
        action: PayloadAction<ProductSortType>
    ): ProductsState => ({
        ...state,
        orderBy: action.payload,
    }),
    changeOffset: (
        state: ProductsState,
        action: PayloadAction<ProductOffset>
    ): ProductsState => ({
        ...state,
        offset: action.payload.offset,
    }),
    setResults: (
        state: ProductsState,
        action: PayloadAction<ReducedProducts>
    ): ProductsState => ({
        ...state,
        ...action.payload,
    }),
    
};


type ActionName = keyof typeof productsStateReducer;
type ReducerParams = Parameters<(typeof productsStateReducer)[ActionName]>;
export type ProductsStateReducer = Reducer<ReducerParams[0], ReducerParams[1]>;


export const productsReducer: ProductsStateReducer = (state: ProductsState, action: ReducerParams[1]) => {
    if (action && !(action.type in productsStateReducer)) {
        throw new Error(`Cannot use action '${action.type}' in ProductsReducer`);
    }
    return productsStateReducer[action.type as ActionName](state, action as PayloadAction<any>);
};