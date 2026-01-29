import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

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
    createOrder: (order: Omit<Order, 'id' | 'date'>) => Promise<Order>;
    getOrderHistory: (userId?: string) => Order[];
    getOrderById: (id: string) => Order | undefined;
    updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
    claimOrders: (userId: string) => Promise<void>;
    getTotalSales: () => number;
    getOrderCount: () => number;
    getAverageOrderValue: () => number;
    getTopProducts: () => { productId: string; name: string; count: number }[];
    isLoading: boolean;
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
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load Orders
    useEffect(() => {
        async function loadOrders() {
            if (!user) {
                // Guests: Load from localstorage
                const stored = localStorage.getItem('monza_orders');
                if (stored) {
                    setOrders(JSON.parse(stored));
                }
                setIsLoading(false);
                return;
            }

            // Users: Load from Supabase
            setIsLoading(true);
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false });

            if (error) {
                console.error('Error loading orders:', error);
            } else if (data) {
                const mappedOrders = data.map((d: any) => ({
                    id: d.id,
                    userId: d.user_id,
                    sessionId: d.session_id,
                    items: d.items, // JSONB
                    subtotal: d.subtotal,
                    total: d.total,
                    date: d.date,
                    status: d.status,
                    customerInfo: d.customer_info, // JSONB
                    vehicleInfo: d.vehicle_info // JSONB
                }));
                // Merge with local? Or just Replace?
                // For simplicity and "Recover History", we Replace.
                // But we might want to also include current session orders if they haven't been synced?
                // For now, Replace is consistent with "Account Sync" behavior.
                setOrders(mappedOrders);
            }
            setIsLoading(false);
        }

        loadOrders();
    }, [user]);

    // Guest Persistence
    useEffect(() => {
        if (!user) {
            localStorage.setItem('monza_orders', JSON.stringify(orders));
        }
    }, [orders, user]);


    const createOrder = async (orderData: Omit<Order, 'id' | 'date'>): Promise<Order> => {
        const newOrder: Order = {
            ...orderData,
            id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            date: new Date().toISOString(),
            status: 'pending' // Default status
        };

        // Optimistic
        setOrders(prev => [...prev, newOrder]);

        if (user) {
            const { error } = await supabase.from('orders').insert({
                id: newOrder.id,
                user_id: user.id,
                session_id: newOrder.sessionId,
                items: newOrder.items,
                subtotal: newOrder.subtotal,
                total: newOrder.total,
                date: newOrder.date,
                status: newOrder.status,
                customer_info: newOrder.customerInfo,
                vehicle_info: newOrder.vehicleInfo
            });
            if (error) console.error('Error creating order in DB:', error);
        }

        return newOrder;
    };

    const getOrderHistory = (userId?: string): Order[] => {
        const sessionId = getSessionId();
        // If we are logged in, 'orders' already holds the user's DB orders. 
        // We just return them. Filter by userId is redundant if we trust state source.
        // But for safety:
        return orders.filter(o =>
            (userId && o.userId === userId) || o.sessionId === sessionId
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const getOrderById = (id: string) => orders.find(o => o.id === id);

    const updateOrderStatus = async (id: string, status: Order['status']) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

        if (user) {
            await supabase.from('orders').update({ status }).eq('id', id);
        }
    };

    const claimOrders = async (userId: string) => {
        const sessionId = localStorage.getItem('monza_session_id');
        if (!sessionId) return;

        // 1. Identify local guest orders
        const guestOrders = orders.filter(o => o.sessionId === sessionId && !o.userId);
        if (guestOrders.length === 0) return;

        // 2. Update local state
        const updated = orders.map(o =>
            (o.sessionId === sessionId && !o.userId) ? { ...o, userId } : o
        );
        setOrders(updated);

        // 3. Sync to DB
        const upserts = guestOrders.map(o => ({
            id: o.id,
            user_id: userId,
            session_id: o.sessionId,
            items: o.items,
            subtotal: o.subtotal,
            total: o.total,
            date: o.date,
            status: o.status,
            customer_info: o.customerInfo,
            vehicle_info: o.vehicleInfo
        }));

        const { error } = await supabase.from('orders').upsert(upserts);
        if (error) console.error('Error claiming orders:', error);
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
            claimOrders,
            getTotalSales,
            getOrderCount,
            getAverageOrderValue,
            getTopProducts,
            isLoading
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


