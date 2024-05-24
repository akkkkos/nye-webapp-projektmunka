export interface shippingAddress {
    name: string;
    country: string;
    city: string;
    street: string;
    zip: number;
    phoneNumber: number;
}

export interface billingAddress {
    name: string;
    taxNumber: number;
    country: string;
    city: string;
    street: string;
    zip: number;
}