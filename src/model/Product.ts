export interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    rating: number;
    categories: string[];
    stock: number;
    description: string;
}

export interface ReducedProducts {
    products: Product[];
    total: number;
}