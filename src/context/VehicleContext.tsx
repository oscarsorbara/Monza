import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Vehicle } from '@/types';
import { storage } from '@/lib/storage';

interface VehicleContextType {
    currentVehicle: Vehicle | null;
    garage: Vehicle[];
    selectVehicle: (vehicle: Vehicle) => void;
    addVehicleToGarage: (vehicle: Vehicle) => void;
    removeVehicleFromGarage: (vehicleId: string) => void;
    clearCurrentVehicle: () => void;
    clearVehicle: () => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: React.ReactNode }) {
    const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(() => {
        return storage.get<Vehicle | null>('monza_current_vehicle', null);
    });

    const [garage, setGarage] = useState<Vehicle[]>(() => {
        return storage.get<Vehicle[]>('monza_garage', []);
    });

    useEffect(() => {
        storage.set('monza_current_vehicle', currentVehicle);
    }, [currentVehicle]);

    useEffect(() => {
        storage.set('monza_garage', garage);
    }, [garage]);

    const selectVehicle = (vehicle: Vehicle) => {
        setCurrentVehicle(vehicle);
        // Also add to garage if not exists
        if (!garage.some(v => v.id === vehicle.id)) {
            setGarage(prev => [...prev, vehicle]);
        }
    };

    const addVehicleToGarage = (vehicle: Vehicle) => {
        if (!garage.some(v => v.id === vehicle.id)) {
            setGarage(prev => [...prev, vehicle]);
        }
    };

    const removeVehicleFromGarage = (vehicleId: string) => {
        setGarage(prev => prev.filter(v => v.id !== vehicleId));
        if (currentVehicle?.id === vehicleId) {
            setCurrentVehicle(null);
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
            clearVehicle: clearCurrentVehicle
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
