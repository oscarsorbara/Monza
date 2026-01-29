import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

export interface Appointment {
    id: string;
    userId?: string;
    sessionId: string;
    date: string;
    time: string;
    serviceType: string;
    status: 'requested' | 'confirmed' | 'completed' | 'cancelled';
    orderId?: string;
    vehicleInfo: {
        make: string;
        model: string;
        year: number;
    };
}

interface AppointmentContextType {
    appointments: Appointment[];
    createAppointment: (appt: Omit<Appointment, 'id' | 'status'>) => Promise<Appointment>;
    getAppointmentHistory: (userId?: string) => Appointment[]; // Kept for API compatibility, but filtered locally
    updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
    claimAppointments: (userId: string) => Promise<void>;
    isLoading: boolean;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load Appointments
    useEffect(() => {
        async function loadAppointments() {
            if (!user) {
                // Load from localStorage for guests
                const stored = localStorage.getItem('monza_appointments');
                if (stored) {
                    setAppointments(JSON.parse(stored));
                }
                setIsLoading(false);
                return;
            }

            // Load from DB for users
            setIsLoading(true);
            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .eq('user_id', user.id);

            let dbAppointments: Appointment[] = [];

            if (error) {
                console.error('Error fetching appointments:', error);
            } else if (data) {
                dbAppointments = data.map((d: any) => ({
                    id: d.id,
                    userId: d.user_id,
                    sessionId: d.session_id,
                    date: d.date,
                    time: d.time,
                    serviceType: d.service_type,
                    status: d.status,
                    vehicleInfo: d.vehicle_info,
                    orderId: d.order_id
                }));
            }

            // --- RESCUE BRIDGE: Recover "Lost" LocalStorage Appointments ---
            // Issue: User might have created appointments while Auth was transient or before DB sync was active.
            // Fix: Check LocalStorage, if we find appointments that are NOT in DB, upload them now.
            const localStored = localStorage.getItem('monza_appointments');
            let recoveredAppointments: Appointment[] = [];

            if (localStored) {
                const localAppts: Appointment[] = JSON.parse(localStored);
                // Filter appts that match current user session (or generic ones) AND are not in DB
                // We identify duplicates by ID.
                const dbIds = new Set(dbAppointments.map(a => a.id));
                const missingInDb = localAppts.filter(a => !dbIds.has(a.id));

                if (missingInDb.length > 0) {
                    console.log(`Rescuing ${missingInDb.length} appointments from LocalStorage...`);

                    // 1. Prepare for Upload
                    const upserts = missingInDb.map(a => ({
                        id: a.id,
                        user_id: user.id, // Claim ownership
                        session_id: a.sessionId,
                        date: a.date,
                        time: a.time,
                        service_type: a.serviceType,
                        status: a.status,
                        vehicle_info: a.vehicleInfo,
                        order_id: a.orderId
                    }));

                    // 2. Upload to Supabase
                    const { error: upsertError } = await supabase.from('appointments').upsert(upserts);

                    if (!upsertError) {
                        // 3. Add to our current list so user sees them immediately
                        // Update the usage of mapped object to match interface
                        recoveredAppointments = missingInDb.map(a => ({ ...a, userId: user.id }));
                    } else {
                        console.error("Failed to rescue appointments:", upsertError);
                    }
                }
            }

            // Merge DB and Recovered
            setAppointments([...dbAppointments, ...recoveredAppointments]);
            setIsLoading(false);
        }

        loadAppointments();
    }, [user]);

    // Save to LocalStorage for guests only
    useEffect(() => {
        if (!user) {
            localStorage.setItem('monza_appointments', JSON.stringify(appointments));
        }
    }, [appointments, user]);

    const createAppointment = async (apptData: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> => {
        const newAppt: Appointment = {
            ...apptData,
            id: 'APT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            status: 'confirmed',
        };

        // Optimistic update
        setAppointments(prev => [...prev, newAppt]);

        if (user) {
            // Save to DB
            const { error } = await supabase.from('appointments').insert({
                id: newAppt.id,
                user_id: user.id,
                session_id: newAppt.sessionId,
                date: newAppt.date, // Timestamp
                time: newAppt.time,
                service_type: newAppt.serviceType,
                status: newAppt.status,
                vehicle_info: newAppt.vehicleInfo
            });
            if (error) console.error('Error creating appt in DB:', error);
        }

        return newAppt;
    };

    const getAppointmentHistory = (userId?: string): Appointment[] => {
        const sessionId = localStorage.getItem('monza_session_id');
        // Filter locally whatever we have in state
        return appointments.filter(a =>
            (userId && a.userId === userId) || (a.sessionId === sessionId)
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));

        if (user) {
            const { error } = await supabase
                .from('appointments')
                .update({ status })
                .eq('id', id);
            if (error) console.error('Error updating status:', error);
        }
    };

    const claimAppointments = async (userId: string) => {
        const sessionId = localStorage.getItem('monza_session_id');
        if (!sessionId) return;

        // 1. Identify local guest appointments
        const guestAppts = appointments.filter(a => a.sessionId === sessionId && !a.userId);
        if (guestAppts.length === 0) return;

        // 2. Update local state
        const updated = appointments.map(a =>
            (a.sessionId === sessionId && !a.userId) ? { ...a, userId } : a
        );
        setAppointments(updated);

        // 3. Sync to DB: For each guest appointment, we need to INSERT it (since it wasn't in DB if they were guest... actually wait.
        // If they were guest, my createAppointment ONLY persists if(user). So guest appts are ONLY in localstorage.
        // So we need to INSERT them now.

        const upserts = guestAppts.map(a => ({
            id: a.id,
            user_id: userId,
            session_id: a.sessionId,
            date: a.date,
            time: a.time,
            service_type: a.serviceType,
            status: a.status,
            vehicle_info: a.vehicleInfo
        }));

        const { error } = await supabase.from('appointments').upsert(upserts);
        if (error) console.error('Error claiming appointments:', error);
    }

    return (
        <AppointmentContext.Provider value={{
            appointments,
            createAppointment,
            getAppointmentHistory,
            updateAppointmentStatus,
            claimAppointments,
            isLoading
        }}>
            {children}
        </AppointmentContext.Provider>
    );
}

export const useAppointment = () => {
    const context = useContext(AppointmentContext);
    if (context === undefined) {
        throw new Error('useAppointment must be used within an AppointmentProvider');
    }
    return context;
};
