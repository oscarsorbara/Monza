import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { shopifyFetch } from '@/lib/shopify';
import { PRODUCTS_QUERY } from '@/queries/products';
import { COLLECTIONS_QUERY } from '@/queries/collections';
import type { Product, CompatibilityRule, Collection } from '@/types';


interface ProductContextType {
    products: Product[];
    collections: Collection[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (id: string, product: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    getProduct: (id: string) => Product | undefined;
    isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                // 1. Clear mocks to only use Shopify data
                const mocks: Product[] = [];

                // 2. Fetch from Shopify
                let shopifyProducts: Product[] = [];
                try {
                    const data: any = await shopifyFetch(PRODUCTS_QUERY);

                    if (data?.products?.edges) {
                        shopifyProducts = data.products.edges.map(({ node }: any) => {
                            const compatibility: CompatibilityRule[] = [];
                            let isUniversal = false;

                            if (node.tags && Array.isArray(node.tags)) {
                                node.tags.forEach((tag: string) => {
                                    const cleanTag = tag.trim();
                                    if (cleanTag.toLowerCase() === 'universal') isUniversal = true;

                                    // Parse compat tag format: compat:Make:Model:YearStart:YearEnd:Engine
                                    // Example: compat:BMW:Serie 2:2014:2022:F22
                                    if (cleanTag.toLowerCase().startsWith('compat:')) {
                                        const parts = cleanTag.split(':');
                                        if (parts.length >= 3) {
                                            const make = parts[1].trim();
                                            const model = parts[2].trim();
                                            const yearStart = parts[3] ? parseInt(parts[3]) || null : null;
                                            const yearEnd = parts[4] ? parseInt(parts[4]) || null : null;
                                            const engine = parts[5] ? [parts[5].trim()] : 'All';

                                            compatibility.push({
                                                make,
                                                model,
                                                yearStart,
                                                yearEnd,
                                                engines: engine
                                            });
                                        }
                                    } else if (cleanTag.includes(':')) {
                                        // Legacy make:BMW format for simple make-only compatibility
                                        const parts = cleanTag.split(':');
                                        if (parts.length >= 2) {
                                            const key = parts[0].trim().toLowerCase();
                                            const value = parts[1].trim();

                                            if (key === 'make') {
                                                compatibility.push({
                                                    make: value,
                                                    model: 'All',
                                                    yearStart: null,
                                                    yearEnd: null,
                                                    engines: 'All'
                                                });
                                            }
                                        }
                                    }
                                });
                            }

                            // MANUAL OVERRIDE FOR REQUESTED PRODUCT 1: Ópticas BMW Serie 2 F22 (Look G)
                            if (node.id === 'gid://shopify/Product/8902433407204' || node.handle === 'opticas-bmw-f22-g-look-nuevo-serie-2') {
                                compatibility.push(
                                    {
                                        make: 'BMW',
                                        model: 'Serie 2',
                                        yearStart: 2014,
                                        yearEnd: 2022,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'M2',
                                        yearStart: 2014,
                                        yearEnd: 2026,
                                        engines: 'All'
                                    }
                                );
                            }

                            // MANUAL OVERRIDE FOR REQUESTED PRODUCT 2: Ópticas OLED BMW Serie 2 F22 (Estilo GTS)
                            if (node.id === 'gid://shopify/Product/8902437535972' || node.handle === 'opticas-bmw-serie-2-f22-estilo-gts') {
                                compatibility.push(
                                    {
                                        make: 'BMW',
                                        model: 'Serie 2',
                                        yearStart: 2014,
                                        yearEnd: 2022,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'M2',
                                        yearStart: 2014,
                                        yearEnd: 2019,
                                        engines: 'All'
                                    }
                                );
                            }

                            // MANUAL OVERRIDE FOR REQUESTED PRODUCT 3: Parrilla Fibra de Carbono Real Doble Rejilla BMW Serie 2
                            if (node.id === 'gid://shopify/Product/8920752816356' || node.handle === 'parrilla-fibra-de-carbono-real-doble-rejilla-bmw-serie-2-f22-look-sport-oem') {
                                compatibility.push(
                                    {
                                        make: 'BMW',
                                        model: 'Serie 2',
                                        yearStart: 2014,
                                        yearEnd: 2022,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'M2',
                                        yearStart: 2014,
                                        yearEnd: 2019,
                                        engines: 'All'
                                    }
                                );
                            }

                            // MANUAL OVERRIDE FOR REQUESTED PRODUCT 4: Tablero Digital BMW | Upgrade Cluster sin CarPlay
                            if (node.id === 'gid://shopify/Product/8903910686948' || node.handle === 'tablero-digital-bmw-serie-3-4-upgrade-cluster') {
                                compatibility.push(
                                    {
                                        make: 'BMW',
                                        model: 'Serie 1',
                                        yearStart: 2013,
                                        yearEnd: 2024,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'Serie 2',
                                        yearStart: 2013,
                                        yearEnd: 2022,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'Serie 3',
                                        yearStart: 2013,
                                        yearEnd: 2020,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'Serie 4',
                                        yearStart: 2013,
                                        yearEnd: 2020,
                                        engines: 'All'
                                    }
                                );
                            }

                            // MANUAL OVERRIDE FOR REQUESTED PRODUCT 5: Tablero Digital BMW | Upgrade Cluster con CarPlay Integrado
                            if (node.id === 'gid://shopify/Product/8902990168292' || node.handle === 'tablero-digital-bmw-serie-3-4-con-carplay') {
                                compatibility.push(
                                    {
                                        make: 'BMW',
                                        model: 'Serie 1',
                                        yearStart: 2013,
                                        yearEnd: 2024,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'Serie 2',
                                        yearStart: 2013,
                                        yearEnd: 2022,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'Serie 3',
                                        yearStart: 2013,
                                        yearEnd: 2020,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'Serie 4',
                                        yearStart: 2013,
                                        yearEnd: 2020,
                                        engines: 'All'
                                    }
                                );
                            }

                            // MANUAL OVERRIDE FOR REQUESTED PRODUCT 6: Difusor Trasero BMW Serie 2 F22
                            if (node.id === 'gid://shopify/Product/8902925189348' || node.handle === 'difusor-trasero-bmw-serie-2-f22-fibra-de-carbono-real-performance') {
                                compatibility.push(
                                    {
                                        make: 'BMW',
                                        model: 'Serie 2',
                                        yearStart: 2014,
                                        yearEnd: 2022,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'M2',
                                        yearStart: 2014,
                                        yearEnd: 2019,
                                        engines: 'All'
                                    }
                                );
                            }

                            // MANUAL OVERRIDE FOR REQUESTED PRODUCT 7: Alerón Estilo M4 BMW Serie 2 | Fibra de Carbono Real (Performance)
                            if (node.id === 'gid://shopify/Product/8902523846884' || node.handle === 'aleron-estilo-m4-bmw-serie-2-f22-fibra-de-carbono-real-performance') {
                                compatibility.push(
                                    {
                                        make: 'BMW',
                                        model: 'Serie 2',
                                        yearStart: 2014,
                                        yearEnd: 2022,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'M2',
                                        yearStart: 2014,
                                        yearEnd: 2019,
                                        engines: 'All'
                                    }
                                );
                            }

                            // MANUAL OVERRIDE FOR REQUESTED PRODUCT 9: Alerón Cola de Pato BMW Serie 2 | Fibra de Carbono Real (Ducktail)
                            if (node.id === 'gid://shopify/Product/8902507200740' || node.handle === 'aleron-cola-de-pato-bmw-serie-2-f22-fibra-de-carbono-real-ducktail') {
                                compatibility.push(
                                    {
                                        make: 'BMW',
                                        model: 'Serie 2',
                                        yearStart: 2014,
                                        yearEnd: 2022,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'M2',
                                        yearStart: 2014,
                                        yearEnd: 2019,
                                        engines: 'All'
                                    }
                                );
                            }

                            // MANUAL OVERRIDE FOR REQUESTED PRODUCT 10: Alerón Cola de Pato BMW Serie 3 | Fibra de Carbono Real (Ducktail)
                            if (node.id === 'gid://shopify/Product/8920818417892' || node.handle === 'aleron-cola-de-pato-bmw-serie-3-fibra-de-carbono-real-ducktail') {
                                compatibility.push(
                                    {
                                        make: 'BMW',
                                        model: 'Serie 3',
                                        yearStart: 2013,
                                        yearEnd: 2018,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'M3',
                                        yearStart: 2014,
                                        yearEnd: 2019,
                                        engines: 'All'
                                    }
                                );
                            }

                            // MANUAL OVERRIDE FOR REQUESTED PRODUCT 11: Alerón Estilo M4 BMW Serie 3 | Fibra de Carbono Real (Performance)
                            if (node.id === 'gid://shopify/Product/8920774738148' || node.handle === 'aleron-estilo-m4-bmw-serie-3-fibra-de-carbono-real-performance') {
                                compatibility.push(
                                    {
                                        make: 'BMW',
                                        model: 'Serie 3',
                                        yearStart: 2013,
                                        yearEnd: 2018,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'M3',
                                        yearStart: 2014,
                                        yearEnd: 2019,
                                        engines: 'All'
                                    }
                                );
                            }

                            // MANUAL OVERRIDE FOR REQUESTED PRODUCT 12: Parrilla Fibra de Carbono Real Doble Rejilla BMW Serie 3 | Look Sport / OEM+
                            if (node.id === 'gid://shopify/Product/8902515261668' || node.handle === 'parrilla-carbono-doble-rejilla-bmw-look-sport-oem') {
                                compatibility.push(
                                    {
                                        make: 'BMW',
                                        model: 'Serie 3',
                                        yearStart: 2013,
                                        yearEnd: 2018,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'M3',
                                        yearStart: 2014,
                                        yearEnd: 2019,
                                        engines: 'All'
                                    }
                                );
                            }

                            // MANUAL OVERRIDE FOR REQUESTED PRODUCT 8: Cachas de Espejo BMW | Fibra de Carbono Real
                            if (node.id === 'gid://shopify/Product/8902512640228' || node.handle === 'cachas-de-espejo-bmw') {
                                compatibility.push(
                                    {
                                        make: 'BMW',
                                        model: 'Serie 1',
                                        yearStart: 2013,
                                        yearEnd: 2019,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'Serie 2',
                                        yearStart: 2013,
                                        yearEnd: 2022,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'Serie 3',
                                        yearStart: 2013,
                                        yearEnd: 2018,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'M3',
                                        yearStart: 2014,
                                        yearEnd: 2019,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'Serie 4',
                                        yearStart: 2013,
                                        yearEnd: 2020,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'X1',
                                        yearStart: 2015,
                                        yearEnd: 2019,
                                        engines: 'All'
                                    },
                                    {
                                        make: 'BMW',
                                        model: 'M2',
                                        yearStart: 2016,
                                        yearEnd: 2021,
                                        engines: 'All'
                                    }
                                );
                            }

                            // MANUAL OVERRIDE FOR REQUESTED PRODUCT: Tablero Digital VW AMAROK | Upgrade Cluster con CarPlay Integrado
                            if (node.id === 'gid://shopify/Product/8909216055524' || node.handle === 'tablero-digital-vw-amarok-upgrade-cluster-con-carplay-integrado') {
                                compatibility.push(
                                    {
                                        make: 'Volkswagen',
                                        model: 'Amarok',
                                        yearStart: 2017,
                                        yearEnd: 2025,
                                        engines: 'All'
                                    }
                                );
                            }

                            const placeholderImage = 'https://placehold.co/600x400/1a1a1a/FFF?text=No+Image';
                            const mainImage = node.images.edges[0]?.node?.url || placeholderImage;
                            const galleryImages = node.images.edges.length > 0
                                ? node.images.edges.map((e: any) => e.node.url)
                                : [placeholderImage];

                            // Determine Category Priority:
                            // 1. Product Type (if not 'Varios', not 'Home page', not empty)
                            // 2. Collection Title (if valid)
                            // 3. Fallback: Empty String (Hidden)

                            let category = node.productType;
                            // Check if initial category is invalid 'Varios' or system types
                            const isInvalidType = !category || category === 'Varios' || category === 'Home page';

                            if (isInvalidType) {
                                // Try to find a valid collection
                                const validCollection = node.collections?.edges.find((e: any) => {
                                    const title = e.node.title;
                                    return title && title !== 'All' && title !== 'Home page' && title !== 'Destacados' && title !== 'Ofertas';
                                });

                                if (validCollection) {
                                    category = validCollection.node.title;
                                } else {
                                    category = ''; // Hide if no category found
                                }
                            }

                            const firstVariant = node.variants.edges[0]?.node;
                            const compareAtPrice = firstVariant?.compareAtPrice?.amount ? parseFloat(firstVariant.compareAtPrice.amount) : undefined;
                            const unitPrice = firstVariant?.unitPrice?.amount ? parseFloat(firstVariant.unitPrice.amount) : undefined;

                            const variants = node.variants.edges.map(({ node: v }: any) => ({
                                id: v.id,
                                title: v.title,
                                price: v.price?.amount ? parseFloat(v.price.amount) : parseFloat(node.priceRange.minVariantPrice.amount),
                                compareAtPrice: v.compareAtPrice?.amount ? parseFloat(v.compareAtPrice.amount) : undefined,
                                availableForSale: v.availableForSale,
                                image: v.image
                            }));

                            return {
                                id: node.id,
                                name: node.title,
                                handle: node.handle,
                                sku: node.id,
                                price: parseFloat(node.priceRange.minVariantPrice.amount),
                                compareAtPrice: compareAtPrice,
                                unitPrice: unitPrice,
                                unitPriceMeasurement: firstVariant?.unitPriceMeasurement,
                                category: category,
                                image: mainImage,
                                images: galleryImages,
                                description: node.descriptionHtml || node.description || '',
                                stock: firstVariant?.availableForSale ? 10 : 0,
                                rating: 5.0,
                                reviewsCount: 0,
                                brand: node.vendor || 'Monza',
                                compatibility: compatibility,
                                isUniversal: isUniversal || compatibility.length === 0,
                                variantId: firstVariant?.id,
                                collections: node.collections?.edges.map((e: any) => e.node.handle) || [],
                                specs: {},
                                variants: variants
                            } as Product;
                        });
                    }
                } catch (err) {
                    console.error("Failed to fetch products from Shopify:", err);
                }

                // 3. Fetch Collections from Shopify
                let shopifyCollections: Collection[] = [];
                try {
                    const collData: any = await shopifyFetch(COLLECTIONS_QUERY);
                    if (collData?.collections?.edges) {
                        shopifyCollections = collData.collections.edges.map(({ node }: any) => ({
                            id: node.id,
                            name: node.title,
                            handle: node.handle,
                            description: node.description || '',
                            image: node.image?.url || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80'
                        }));
                    }
                } catch (err) {
                    console.error("Failed to fetch collections from Shopify:", err);
                }

                setProducts([...mocks, ...shopifyProducts]);
                setCollections(shopifyCollections);

            } catch (error) {
                console.error('Error initializing data:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, []);

    // Helper functions (kept for compatibility)
    const addProduct = (p: Omit<Product, 'id'>) => {
        const newProduct = { ...p, id: Math.random().toString(36).substr(2, 9) } as Product;
        setProducts(prev => [...prev, newProduct]);
    };

    const updateProduct = (id: string, updates: Partial<Product>) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deleteProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const getProduct = (id: string) => products.find(p => p.id === id);

    return (
        <ProductContext.Provider value={{
            products,
            collections,
            addProduct,
            updateProduct,
            deleteProduct,
            getProduct,
            isLoading
        }}>
            {children}
        </ProductContext.Provider>
    );
}

export const useProduct = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProduct must be used within a ProductProvider');
    }
    return context;
};
