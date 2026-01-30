import type { Product } from '@/types';

export const PRODUCTS: Product[] = [
    {
        id: 'p1',
        name: 'Pastillas de Freno Cerámicas - Delanteras',
        handle: 'pastillas-freno-ceramicas-delanteras',
        sku: 'BRK-001',
        price: 185.99,
        category: 'Frenos',
        image: '/images/cat-brakes.png',
        images: [],
        description: 'Pastillas de freno de alto rendimiento con bajo nivel de polvo y ruido. Diseñadas para conducción deportiva y uso diario intenso.',
        stock: 50,
        rating: 4.8,
        reviewsCount: 120,
        brand: 'Brembo',
        compatibility: [
            { make: 'BMW', model: 'M3', yearStart: 2018, yearEnd: 2024, engines: 'All' },
            { make: 'Audi', model: 'RS3', yearStart: 2020, yearEnd: 2024, engines: 'All' }
        ],
        specs: { 'Material': 'Cerámica Carbono', 'Posición': 'Delantera' }
    },
    {
        id: 'p2',
        name: 'Kit de Admisión de Aire Frío',
        handle: 'kit-admision-aire-frio',
        sku: 'INT-002',
        price: 450.00,
        category: 'Motor',
        image: '/images/cat-engine.png',
        images: [],
        description: 'Sistema de admisión de fibra de carbono. Aumenta el flujo de aire y mejora la respuesta del acelerador con un sonido agresivo.',
        stock: 15,
        rating: 4.9,
        reviewsCount: 85,
        brand: 'Eventuri',
        compatibility: [
            { make: 'BMW', model: 'M3', yearStart: 2021, yearEnd: 2024, engines: 'All' },
            { make: 'BMW', model: 'M4', yearStart: 2021, yearEnd: 2024, engines: 'All' }
        ],
        specs: { 'Material': 'Fibra de Carbono', 'Ganancia': '+15-20 HP' }
    },
    {
        id: 'p3',
        name: 'Suspensión Coilover V3',
        handle: 'suspension-coilover-v3',
        sku: 'SUS-003',
        price: 2850.00,
        category: 'Suspensión',
        image: '/images/cat-suspension.png',
        images: [],
        description: 'Kit de suspensión ajustable en altura y dureza. Tecnología de competición para la calle.',
        stock: 8,
        rating: 5.0,
        reviewsCount: 42,
        brand: 'KW Suspensions',
        compatibility: [],
        isUniversal: true, // Simplified for demo
        specs: { 'Ajuste': 'Compresión y Rebote', 'Bajada': '10-40mm' }
    },
    {
        id: 'p4',
        name: 'Sistema de Escape Titanio',
        handle: 'sistema-escape-titanio',
        sku: 'EXH-004',
        price: 4200.00,
        category: 'Escape',
        image: 'https://images.unsplash.com/photo-1565691083984-b0400b99857d?auto=format&fit=crop&q=80',
        images: [],
        description: 'Sistema de escape completo fabricado en titanio ligero. Reduce peso y mejora el sonido del motor.',
        stock: 3,
        rating: 5.0,
        reviewsCount: 12,
        brand: 'Akrapovič',
        compatibility: [
            { make: 'Porsche', model: '911', yearStart: 2020, yearEnd: 2024, engines: 'All' }
        ],
        specs: { 'Material': 'Titanio', 'Peso': '-8.5kg vs Stock' }
    },
    {
        id: 'p5',
        name: 'Alerón Trasero GT Carbon',
        handle: 'aleron-trasero-gt-carbon',
        sku: 'AERO-005',
        price: 1200.00,
        category: 'Exterior',
        image: 'https://images.unsplash.com/photo-1494905998402-395d579af978?auto=format&fit=crop&q=80',
        images: [],
        description: 'Alerón de fibra de carbono ajustable. Genera carga aerodinámica real para uso en pista.',
        stock: 10,
        rating: 4.7,
        reviewsCount: 28,
        brand: 'Vorsteiner',
        isUniversal: true,
        compatibility: [],
        specs: { 'Material': 'Carbono Pre-Preg', 'Acabado': 'Gloss' }
    },
    {
        id: 'p6',
        name: 'Aceite Sintético de Carreras 5W-40',
        handle: 'aceite-sintetico-carreras-5w40',
        sku: 'OIL-006',
        price: 85.00,
        category: 'Fluidos',
        image: 'https://images.unsplash.com/photo-1574620077465-4f3583ae19ec?auto=format&fit=crop&q=80',
        images: [],
        description: 'Aceite de motor sintético formulado para motores de alto rendimiento y temperaturas extremas.',
        stock: 200,
        rating: 4.9,
        reviewsCount: 500,
        brand: 'Motul',
        isUniversal: true,
        compatibility: [],
        specs: { 'Viscosidad': '5W-40', 'Volumen': '5 Litros' }
    },
    {
        id: 'p7',
        name: 'Alerón Trasero de Fibra de Carbono Prepreg Estilo PSM para BMW Serie 3 F30 M3 F80 2012–2019',
        handle: 'aleron-trasero-carbono-psm-bmw-f30',
        sku: 'AERO-F30-PSM',
        price: 1000.00,
        category: 'Alerones',
        image: '/products/spoiler-f30-main.jpg',
        images: [
            '/products/spoiler-f30-rear.jpg',
            '/products/spoiler-f30-iso.png',
            '/products/spoiler-f30-detail.jpg'
        ],
        description: 'Transforma la estética de tu BMW con este alerón trasero estilo PSM fabricado en fibra de carbono prepreg de alta calidad. Diseñado específicamente para los modelos Serie 3 F30 y M3 F80 (2012–2019), este componente no solo añade un toque agresivo y deportivo, sino que también optimiza la aerodinámica del vehículo. Su acabado brillante y construcción ligera garantizan una integración perfecta y duradera.',
        stock: 5,
        rating: 5.0,
        reviewsCount: 3,
        brand: 'BMW',
        compatibility: [
            { make: 'BMW', model: 'M3', yearStart: 2012, yearEnd: 2019, engines: 'All' },
            { make: 'BMW', model: '3 Series', yearStart: 2012, yearEnd: 2019, engines: 'All' }
        ],
        specs: { 'Material': 'Fibra de Carbono Prepreg', 'Estilo': 'PSM', 'Instalación': 'Adhesivo 3M / Betalink' },
        compareAtPrice: 1350.00 // Demo Discount
    }
];
