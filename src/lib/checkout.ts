import { shopifyFetch } from '@/lib/shopify';

export const CART_CREATE_MUTATION = `
  mutation cartCreate($lines: [CartLineInput!]!, $discountCodes: [String!]) {
    cartCreate(input: { lines: $lines, discountCodes: $discountCodes }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export async function createCheckout(items: { variantId: string; quantity: number; attributes?: Record<string, string> }[], discountCodes: string[] = []) {
  console.log("createCheckout called with:", { items, discountCodes });

  const lines = items.map(item => ({
    merchandiseId: item.variantId,
    quantity: item.quantity,
    attributes: item.attributes ? Object.entries(item.attributes).map(([key, value]) => ({ key, value })) : []
  }));

  console.log("Prepared GraphQL lines:", lines);
  console.log("Sending query to Shopify...");

  const data: any = await shopifyFetch(CART_CREATE_MUTATION, { lines, discountCodes });
  console.log("Raw Shopify Response:", data);

  if (data.cartCreate?.userErrors?.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  let checkoutUrl = data.cartCreate.cart.checkoutUrl;
  console.log("Original Checkout URL:", checkoutUrl);

  // We explicitly want to send the user to the dedicated checkout subdomain
  // configured in Shopify (checkout.monzars.com).
  const targetDomain = 'checkout.monzars.com';
  let finalUrl = checkoutUrl;

  try {
    // 1. Try to parse as absolute URL
    const urlObj = new URL(checkoutUrl);

    // If it's not pointing to the new checkout domain, force it.
    if (urlObj.hostname !== targetDomain) {
      console.log(`Redirecting from ${urlObj.hostname} to ${targetDomain}`);
      urlObj.hostname = targetDomain;
      finalUrl = urlObj.toString();
    }
  } catch (e) {
    // 2. If parsing fails (likely a relative path like /checkouts/...), construct absolute URL
    console.log("URL parsing failed (relative path?), constructing absolute URL");
    const path = checkoutUrl.startsWith('/') ? checkoutUrl : `/${checkoutUrl}`;
    finalUrl = `https://${targetDomain}${path}`;
  }

  console.log("Final Secure Checkout URL:", finalUrl);
  return finalUrl;
}
