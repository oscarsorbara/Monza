import { useState } from 'react';
import { useVehicle } from '@/context/VehicleContext';
// Maintenance.tsx is deprecated. See Contact.tsx
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProductCard } from '@/components/product/ProductCard';
import { PRODUCTS } from '@/data/productsMock';
import { Gauge, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Maintenance() {
    const { currentVehicle } = useVehicle();
    const [mileage, setMileage] = useState<number | string>('');
    const [report, setReport] = useState<any[]>([]);

    const calculateMaintenance = () => {
        if (!mileage || Number(mileage) < 0) return;
        const m = Number(mileage);
        const items = [];

        // Simple logic for demo
        if (m >= 5000) items.push({ part: 'Oil Filter', priority: 'High', exact: false, category: 'Oil & Fluids' });
        if (m >= 30000) items.push({ part: 'Air Filter', priority: 'Medium', exact: false, category: 'Engine' });
        if (m >= 50000) items.push({ part: 'Brake Pads', priority: 'High', exact: false, category: 'Brakes' });
        if (m >= 100000) items.push({ part: 'Spark Plugs', priority: 'Medium', exact: false, category: 'Engine' });

        setReport(items);
    };

    const recommendedProducts = report.flatMap(item =>
        PRODUCTS.filter(p => p.category === item.category).slice(0, 1) // Pick 1 from category for demo
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold italic tracking-tight mb-8">MAINTENANCE CALCULATOR</h1>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-carbon-800 p-8 rounded-xl border border-carbon-700 h-fit">
                    <h2 className="text-xl font-bold mb-4">Vehicle Status</h2>

                    {currentVehicle ? (
                        <div className="mb-8">
                            <div className="flex items-center gap-3 p-4 bg-carbon-700/50 rounded-lg mb-6">
                                <div className="w-12 h-12 bg-monza-red/20 rounded-full flex items-center justify-center text-monza-red">
                                    <Gauge className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{currentVehicle.year} {currentVehicle.make} {currentVehicle.model}</h3>
                                    <p className="text-gray-400">{currentVehicle.engine}</p>
                                </div>
                            </div>

                            <label className="block text-sm font-medium text-gray-300 mb-2">Current Mileage</label>
                            <div className="flex gap-4">
                                <Input
                                    type="number"
                                    placeholder="e.g. 45000"
                                    value={mileage}
                                    onChange={(e) => setMileage(e.target.value)}
                                />
                                <Button onClick={calculateMaintenance}>Analyze</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                            <p className="mb-4 text-gray-300">Please select a vehicle to get maintenance insights.</p>
                            <Link to="/">
                                <Button variant="outline">Select Vehicle</Button>
                            </Link>
                        </div>
                    )}

                    {report.length > 0 && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="font-bold text-gray-300 uppercase text-xs tracking-wider">Recommended Service</h3>
                            {report.map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-carbon-900 rounded border border-carbon-700">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${item.priority === 'High' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                        <span>Replace {item.part}</span>
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">{item.priority} Priority</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    {recommendedProducts.length > 0 ? (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold mb-6">Recommended Parts for Maintenance</h2>
                            <div className="grid gap-6">
                                {recommendedProducts.map(p => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 border border-dashed border-carbon-700 rounded-xl">
                            Results will appear here...
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
