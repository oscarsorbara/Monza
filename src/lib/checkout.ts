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

export async function createCheckout(items: { variantId: string; quantity: number }[], discountCodes: string[] = []) {
  const lines = items.map(item => ({
    merchandiseId: item.variantId,
    quantity: item.quantity
  }));

  console.log("Creating cart with lines:", lines, "Discounts:", discountCodes);
  const data: any = await shopifyFetch(CART_CREATE_MUTATION, { lines, discountCodes });
  console.log("Cart Response:", data);

  if (data.cartCreate?.userErrors?.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  return data.cartCreate.cart.checkoutUrl;
}
