import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem } from '@/types';

export interface Order {
    id: string;
    userId?: string;
    sessionId: string;
    items: CartItem[];
    subtotal: number;
    total: number;
    date: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    customerInfo: {
        name: string;
        email: string;
        phone: string;
    };
    vehicleInfo?: {
        make: string;
        model: string;
        year: number;
    };
}

interface OrderContextType {
    orders: Order[];
    createOrder: (order: Omit<Order, 'id' | 'date'>) => Order;
    getOrderHistory: (userId?: string) => Order[];
    getOrderById: (id: string) => Order | undefined;
    updateOrderStatus: (id: string, status: Order['status']) => void;
    getTotalSales: () => number;
    getOrderCount: () => number;
    getAverageOrderValue: () => number;
    getTopProducts: () => { productId: string; name: string; count: number }[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);


export function getSessionId(): string {
    let sessionId = localStorage.getItem('monza_session_id');
    if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now();
        localStorage.setItem('monza_session_id', sessionId);
    }
    return sessionId;
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('monza_orders');
        if (stored) {
            setOrders(JSON.parse(stored));
        }
    }, []);

    const save = (updated: Order[]) => {
        setOrders(updated);
        localStorage.setItem('monza_orders', JSON.stringify(updated));
    };

    const createOrder = (orderData: Omit<Order, 'id' | 'date'>): Order => {
        const newOrder: Order = {
            ...orderData,
            id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            date: new Date().toISOString(),
        };
        save([...orders, newOrder]);
        return newOrder;
    };

    const getOrderHistory = (userId?: string): Order[] => {
        const sessionId = getSessionId();
        return orders.filter(o =>
            (userId && o.userId === userId) || o.sessionId === sessionId
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const getOrderById = (id: string) => orders.find(o => o.id === id);

    const updateOrderStatus = (id: string, status: Order['status']) => {
        const updated = orders.map(o => o.id === id ? { ...o, status } : o);
        save(updated);
    };

    const getTotalSales = () => orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0);

    const getOrderCount = () => orders.filter(o => o.status !== 'cancelled').length;

    const getAverageOrderValue = () => {
        const validOrders = orders.filter(o => o.status !== 'cancelled');
        if (validOrders.length === 0) return 0;
        return getTotalSales() / validOrders.length;
    };

    const getTopProducts = () => {
        const productCounts: Record<string, { name: string; count: number }> = {};
        orders.filter(o => o.status !== 'cancelled').forEach(order => {
            order.items.forEach(item => {
                if (!productCounts[item.id]) {
                    productCounts[item.id] = { name: item.name, count: 0 };
                }
                productCounts[item.id].count += item.quantity;
            });
        });
        return Object.entries(productCounts)
            .map(([productId, data]) => ({ productId, ...data }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    };

    return (
        <OrderContext.Provider value={{
            orders,
            createOrder,
            getOrderHistory,
            getOrderById,
            updateOrderStatus,
            getTotalSales,
            getOrderCount,
            getAverageOrderValue,
            getTopProducts
        }}>
            {children}
        </OrderContext.Provider>
    );
}

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};


