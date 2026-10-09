export type Platform = 'android' | 'ios';
export interface Product { name: string; unitPriceCents: number }
export interface CartSnapshot { name: string; quantity: number; unitPriceCents: number; subtotalCents: number }
export interface ShippingDetails {
  fullName: string; address1: string; city: string; state: string; zip: string; country: string;
}
export interface PaymentDetails { fullName: string; cardNumber: string; expiry: string; securityCode: string }
export interface Credentials { username: string; password: string }
