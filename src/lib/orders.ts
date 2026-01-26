import { storage } from './storage';
import { type CartItem } from '@/types';

export interface Order {
    id: string;
    date: string; // ISO string
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    paymentStatus: 'paid' | 'unpaid' | 'refunded';
    fulfillmentStatus: 'unfulfilled' | 'fulfilled';
    total: number;
    subtotal: number;
    shippingCost: number;
    items: CartItem[];
    customer: {
        fullName: string;
        email: string;
        phone: string;
        taxId: string;
        invoiceType: string;
        companyName?: string;
    };
    shippingAddress: Address;
    billingAddress: Address;
    paymentMethod: string;
    appointment?: {
        date: string;
        time: string;
        service: string;
        confirmed: boolean;
    };
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

const ORDERS_KEY = 'monza_orders';

export const orderManager = {
    getOrders: (): Order[] => {
        return storage.get<Order[]>(ORDERS_KEY, []);
    },

    getOrder: (id: string): Order | undefined => {
        const orders = orderManager.getOrders();
        return orders.find(o => o.id === id);
    },

    createOrder: (order: Order): void => {
        const orders = orderManager.getOrders();
        // Add to beginning of list
        storage.set(ORDERS_KEY, [order, ...orders]);
    },

    updateStatus: (id: string, status: Order['status']) => {
        const orders = orderManager.getOrders();
        const updated = orders.map(o => o.id === id ? { ...o, status } : o);
        storage.set(ORDERS_KEY, updated);
    }
};
