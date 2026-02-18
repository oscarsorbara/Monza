import{s as i}from"./index-D8j9bNHy.js";const l=`
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
`;async function u(n,a=[]){console.log("createCheckout called with:",{items:n,discountCodes:a});const s=n.map(e=>({merchandiseId:e.variantId,quantity:e.quantity,attributes:e.attributes?Object.entries(e.attributes).map(([o,c])=>({key:o,value:c})):[]}));console.log("Prepared GraphQL lines:",s),console.log("Sending query to Shopify...");const r=await i(l,{lines:s,discountCodes:a});if(console.log("Raw Shopify Response:",r),r.cartCreate?.userErrors?.length>0)throw new Error(r.cartCreate.userErrors[0].message);let t=r.cartCreate.cart.checkoutUrl;console.log("Original Checkout URL:",t);try{const e=new URL(t),o="1ndb0n-et.myshopify.com";e.hostname!==o&&(console.log(`Redirecting from ${e.hostname} to ${o}`),t=`https://${o}${e.pathname}${e.search}`)}catch(e){console.error("Error patching URL:",e)}return console.log("Final Checkout URL:",t),t}export{l as CART_CREATE_MUTATION,u as createCheckout};
