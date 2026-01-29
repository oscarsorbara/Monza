import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Vehicle } from '@/types';
import { storage } from '@/lib/storage';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface VehicleContextType {
    currentVehicle: Vehicle | null;
    garage: Vehicle[];
    selectVehicle: (vehicle: Vehicle) => void;
    addVehicleToGarage: (vehicle: Vehicle) => Promise<void>;
    removeVehicleFromGarage: (vehicleId: string) => Promise<void>;
    clearCurrentVehicle: () => void;
    clearVehicle: () => void;
    isLoading: boolean;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(() => {
        return storage.get<Vehicle | null>('monza_current_vehicle', null);
    });

    const [garage, setGarage] = useState<Vehicle[]>(() => {
        // Init with local storage for immediate render, but will be overwritten if user logs in
        return storage.get<Vehicle[]>('monza_garage', []);
    });

    // Sync Current Vehicle to LocalStorage (Preferences are usually local session based)
    useEffect(() => {
        storage.set('monza_current_vehicle', currentVehicle);
    }, [currentVehicle]);

    // Load Garage from DB when User logs in
    useEffect(() => {
        async function loadGarage() {
            if (!user) {
                // Return to local storage if user logs out
                const local = storage.get<Vehicle[]>('monza_garage', []);
                setGarage(local);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            const { data, error } = await supabase
                .from('vehicles')
                .select('*')
                .eq('user_id', user.id);

            if (error) {
                console.error('Error loading garage:', error);
            } else if (data) {
                // Map DB structure to Vehicle structure
                const mappedGarage = data.map((v: any) => ({
                    id: v.id,
                    make: v.make,
                    model: v.model,
                    year: v.year,
                    // Map DB 'variant' to Frontend 'engine' (and keep 'variant')
                    engine: v.variant || 'Base',
                    variant: v.variant,
                    trim: v.variant // Map to trim as well just in case
                }));
                setGarage(mappedGarage as Vehicle[]);
            }
            setIsLoading(false);
        }

        loadGarage();
    }, [user]);

    // Sync Garage to LocalStorage ONLY if guest (to keep guest data persistent locally)
    useEffect(() => {
        if (!user) {
            storage.set('monza_garage', garage);
        }
    }, [garage, user]);

    const selectVehicle = (vehicle: Vehicle) => {
        setCurrentVehicle(vehicle);
        // Also add to garage if not exists (auto-save logic)
        // If logged in, we verify against current state before DB call
        if (!garage.some(v => v.id === vehicle.id)) {
            addVehicleToGarage(vehicle);
        }
    };

    const addVehicleToGarage = async (vehicle: Vehicle) => {
        if (garage.some(v => v.id === vehicle.id)) return;

        // Optimistic Update
        const newGarage = [...garage, vehicle];
        setGarage(newGarage);

        if (user) {
            const { error } = await supabase.from('vehicles').insert({
                id: vehicle.id, // Keep the same ID
                user_id: user.id,
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                // Map Frontend 'engine' to DB 'variant'
                variant: vehicle.variant || vehicle.engine || 'Base'
            });

            if (error) {
                console.error('Error saving vehicle:', error);
                // Revert on error? Or just let it sync next time.
            }
        }
    };

    const removeVehicleFromGarage = async (vehicleId: string) => {
        setGarage(prev => prev.filter(v => v.id !== vehicleId));

        if (currentVehicle?.id === vehicleId) {
            setCurrentVehicle(null);
        }

        if (user) {
            const { error } = await supabase
                .from('vehicles')
                .delete()
                .eq('id', vehicleId)
                .eq('user_id', user.id); // Security extra check

            if (error) console.error('Error deleting vehicle:', error);
        }
    };

    const clearCurrentVehicle = () => {
        setCurrentVehicle(null);
    }

    return (
        <VehicleContext.Provider value={{
            currentVehicle,
            garage,
            selectVehicle,
            addVehicleToGarage,
            removeVehicleFromGarage,
            clearCurrentVehicle,
            clearVehicle: clearCurrentVehicle,
            isLoading
        }}>
            {children}
        </VehicleContext.Provider>
    );
}

export function useVehicle() {
    const context = useContext(VehicleContext);
    if (context === undefined) {
        throw new Error('useVehicle must be used within a VehicleProvider');
    }
    return context;
}
