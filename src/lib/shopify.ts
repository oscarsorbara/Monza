import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export const shopifyClient = createStorefrontApiClient({
    storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN,
    apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION,
    publicAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
});

export async function shopifyFetch<T>(query: string, variables = {}): Promise<T> {

    try {
        const response = await shopifyClient.request(query, { variables });

        if (response.errors) {
            console.error("Shopify Full Error Object:", JSON.stringify(response.errors, null, 2));
            // Defensive coding: response.errors might not be an array in this client version
            let errorMessage = "Unknown Shopify Error";
            if (Array.isArray(response.errors)) {
                errorMessage = response.errors.map((e: any) => e.message).join(', ');
            } else if (typeof response.errors === 'object') {
                // Sometimes it's { graphQLErrors: [...] }
                errorMessage = JSON.stringify(response.errors);
            }
            throw new Error(errorMessage);
        }

        return response.data as T;
    } catch (e) {
        console.error("Shopify Fetch Failed:", e);
        throw e;
    }
}
