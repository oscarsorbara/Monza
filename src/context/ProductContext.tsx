import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { shopifyFetch } from '@/lib/shopify';
import { PRODUCTS_QUERY } from '@/queries/products';
import { COLLECTIONS_QUERY } from '@/queries/collections';
import type { Product, CompatibilityRule, Collection } from '@/types';
import { PRODUCTS as initialProducts } from '@/data/productsMock';

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
                // 1. Keep the requested Mock Alerón
                const mockAleron = initialProducts.find(p => p.id === 'p7');
                const mocks = mockAleron ? [mockAleron] : [];

                // 2. Fetch from Shopify
                // 2. Fetch Products
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

                                    if (cleanTag.includes(':')) {
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

                            const placeholderImage = 'https://placehold.co/600x400/1a1a1a/FFF?text=No+Image';
                            const mainImage = node.images.edges[0]?.node?.url || placeholderImage;
                            const galleryImages = node.images.edges.length > 0
                                ? node.images.edges.map((e: any) => e.node.url)
                                : [placeholderImage];

                            return {
                                id: node.id,
                                name: node.title,
                                handle: node.handle,
                                sku: node.id,
                                price: parseFloat(node.priceRange.minVariantPrice.amount),
                                category: node.productType || 'Varios',
                                image: mainImage,
                                images: galleryImages,
                                description: node.descriptionHtml || node.description || '',
                                stock: node.variants.edges[0]?.node?.availableForSale ? 10 : 0,
                                rating: 5.0,
                                reviewsCount: 0,
                                brand: node.vendor || 'Monza',
                                compatibility: compatibility,
                                isUniversal: isUniversal || compatibility.length === 0,
                                variantId: node.variants.edges[0]?.node?.id,
                                collections: node.collections?.edges.map((e: any) => e.node.handle) || [],
                                specs: {}
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

    // Helper functions (kept for compatibility, though 'save' logic is removed for fetched items)
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
