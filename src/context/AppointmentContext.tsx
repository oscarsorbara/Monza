import React, { createContext, useContext, useState, useEffect } from 'react';

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
    createAppointment: (appt: Omit<Appointment, 'id' | 'status'>) => Appointment;
    getAppointmentHistory: (userId?: string) => Appointment[];
    updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
    claimAppointments: (userId: string) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('monza_appointments');
        if (stored) {
            setAppointments(JSON.parse(stored));
        }
    }, []);

    const save = (updated: Appointment[]) => {
        setAppointments(updated);
        localStorage.setItem('monza_appointments', JSON.stringify(updated));
    };

    const createAppointment = (apptData: Omit<Appointment, 'id' | 'status'>): Appointment => {
        const newAppt: Appointment = {
            ...apptData,
            id: 'APT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            status: 'confirmed', // From Cal.com it's usually confirmed immediately
        };
        save([...appointments, newAppt]);
        return newAppt;
    };

    const getAppointmentHistory = (userId?: string): Appointment[] => {
        const sessionId = localStorage.getItem('monza_session_id');
        return appointments.filter(a =>
            (userId && a.userId === userId) || (a.sessionId === sessionId && !a.userId)
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
        const updated = appointments.map(a => a.id === id ? { ...a, status } : a);
        save(updated);
    };

    const claimAppointments = (userId: string) => {
        const sessionId = localStorage.getItem('monza_session_id');
        if (!sessionId) return;

        const updated = appointments.map(a =>
            (a.sessionId === sessionId && !a.userId) ? { ...a, userId } : a
        );
        save(updated);
    }

    return (
        <AppointmentContext.Provider value={{
            appointments,
            createAppointment,
            getAppointmentHistory,
            updateAppointmentStatus,
            claimAppointments
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
