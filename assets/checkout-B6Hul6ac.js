import{s as l}from"./index-D179iB-K.js";const u=`
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
`;async function d(r,s=[]){console.log("createCheckout called with:",{items:r,discountCodes:s});const a=r.map(o=>({merchandiseId:o.variantId,quantity:o.quantity,attributes:o.attributes?Object.entries(o.attributes).map(([n,i])=>({key:n,value:i})):[]}));console.log("Prepared GraphQL lines:",a),console.log("Sending query to Shopify...");const t=await l(u,{lines:a,discountCodes:s});if(console.log("Raw Shopify Response:",t),t.cartCreate?.userErrors?.length>0)throw new Error(t.cartCreate.userErrors[0].message);let e=t.cartCreate.cart.checkoutUrl;console.log("Original Checkout URL:",e);const c="1ndb0n-et.myshopify.com";return e.includes("monzars.com")&&c&&(e=e.replace("monzars.com",c),e.startsWith("https://")||(e=`https://${e}`)),console.log("Patched Checkout URL:",e),e}export{u as CART_CREATE_MUTATION,d as createCheckout};
