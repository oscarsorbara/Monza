# Guía de Integración con Shopify (Headless)

Esta guía detalla los pasos para conectar tu aplicación React existente con Shopify utilizando la **Storefront API**. Esto permitirá que tu catálogo, carrito y checkout funcionen con datos reales de tu tienda Shopify.

---

## Paso 1: Configuración en Shopify

## Paso 1: Obtener Token (Método Más Fácil)

Ya que el panel de Apps está confuso, usaremos la **App Oficial "Headless"** de Shopify, que te da el token en 1 clic.

1.  **Buscar App**:
    *   Ve a la URL: `https://admin.shopify.com/store/1ndb0n-et/settings/apps`
    *   Clic en el botón **Shopify App Store** (arriba a la derecha).
    *   En la tienda de apps, busca: `Headless`.
    *   Selecciona la app llamada **Headless** (es gratis, creada por Shopify).
2.  **Instalar**:
    *   Haz clic en **Instalar** o **Agregar canal de ventas**.
3.  **Crear Storefront**:
    *   Una vez instalado, verás una pantalla de bienvenida.
    *   Haz clic en el botón verde **Crear tienda online** (Create storefront) o **Agregar tienda**.
4.  **Obtener Token (Estás aquí)**:
    *   En la pantalla que ves, busca el recuadro que dice **API Storefront**.
    *   Haz clic en el botón blanco **Gestionar** a la derecha de ese recuadro.
    *   Se abrirá una barra lateral o nueva vista.
    *   Busca el **Token de acceso público** (Public access token). Copialo (icono de portapapeles).
    *   Ese es el código que necesitas.
    *   **IMPORTANTE**: No confundir con el "Token de acceso privado". Necesitamos el **Público**.

---

## Paso 2: Configuración del Proyecto (Variables de Entorno)

Crea un archivo `.env` en la raíz de tu proyecto (si no existe) y agrega tus credenciales.

`bash`
touch .env
`

Contenido del archivo `.env`:

`env
VITE_SHOPIFY_STORE_DOMAIN="tu-tienda.myshopify.com"
VITE_SHOPIFY_STOREFRONT_TOKEN="tu_token_de_acceso_storefront"
VITE_SHOPIFY_API_VERSION="2024-01"
`

> **Importante**: Asegúrate de agregar `.env` a tu `.gitignore` para no subir tus claves al repositorio.

---

## Paso 3: Instalar Cliente de Shopify

Utilizaremos la librería oficial ligera para interactuar con la API.

`bash
npm install @shopify/storefront-api-client
`

---

## Paso 4: Crear el Cliente de Shopify

Crea un nuevo archivo para configurar la conexión: `src/lib/shopify.ts`.

`typescript
// src/lib/shopify.ts
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export const shopifyClient = createStorefrontApiClient({
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN,
  apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION,
  publicAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
});

export async function shopifyFetch<T>(query: string, variables = {}): Promise<T> {
  const { data, errors } = await shopifyClient.request(query, { variables });
  
  if (errors) {
    throw new Error(errors[0].message);
  }
  
  return data as T;
}
`

---

## Paso 5: Reemplazar Datos Mock con Datos Reales

Ahora debes modificar tu `ProductContext` para obtener los productos desde Shopify en lugar del archivo JSON local.

### Ejemplo de Consulta GraphQL

`typescript
// src/queries/products.ts (Crea este archivo)
export const PRODUCTS_QUERY = `
  query Products {
    products(first: 20) {
      edges {
        node {
          id
          title
          description
          handle
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;
`

### Actualizar el Contexto (`src/context/ProductContext.tsx`)

`typescript
import { useEffect, useState } from 'react';
import { shopifyFetch } from '@/lib/shopify';
import { PRODUCTS_QUERY } from '@/queries/products';

// ... dentro de tu Provider
useEffect(() => {
    async function loadProducts() {
        try {
            const data: any = await shopifyFetch(PRODUCTS_QUERY);
            // Mapear respuesta de Shopify a tu estructura de datos interna (Product interface)
            const mappedProducts = data.products.edges.map(({ node }: any) => ({
                id: node.id,
                name: node.title,
                price: parseFloat(node.priceRange.minVariantPrice.amount),
                image: node.images.edges[0]?.node.url,
                // ... mapear resto de campos
            }));
            setProducts(mappedProducts);
        } catch (error) {
            console.error("Error cargando productos:", error);
        }
    }
    loadProducts();
}, []);
`

---

## Paso 6: Manejo del Carrito y Checkout

En Shopify Headless, no gestionas el carrito completamente en local. Creas un "Checkout" en Shopify y rediriges al usuario allí para pagar.

1.  **Crear Checkout**: Cuando el usuario agrega el primer item.
2.  **Actualizar Checkout**: Agregar líneas (Variant ID + Cantidad).
3.  **Redireccionar**: Usar la `webUrl` que devuelve la API para enviar al usuario a la pasarela de pago segura de Shopify.

### Ejemplo Mutation para Crear Checkout

`graphql
mutation checkoutCreate($variantId: ID!) {
  checkoutCreate(input: {
    lineItems: [{ variantId: $variantId, quantity: 1 }]
  }) {
    checkout {
      id
      webUrl
    }
  }
}
`

---

## Resumen de Tareas Pendientes

1.  [ ] Crear cuenta de Shopify Partner y Tienda de Desarrollo.
2.  [ ] Obtener **Storefront Access Token**.
3.  [ ] Configurar variables en `.env`.
4.  [ ] Implementar `shopifyClient`.
5.  [ ] Mapear tus productos existentes en Shopify (usando Tags para compatibilidad, ej: `make:BMW`, `model:M3`).
6.  [ ] Refactorizar `ProductContext` para usar la API real.

¡Con esto tendrás una tienda React ultra-rápida conectada a la robustez de Shopify!
