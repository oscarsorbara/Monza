import{s as u}from"./index-naSI3ki7.js";const h=`
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
`;async function d(s,c=[]){console.log("createCheckout called with:",{items:s,discountCodes:c});const i=s.map(t=>({merchandiseId:t.variantId,quantity:t.quantity,attributes:t.attributes?Object.entries(t.attributes).map(([a,l])=>({key:a,value:l})):[]}));console.log("Prepared GraphQL lines:",i),console.log("Sending query to Shopify...");const o=await u(h,{lines:i,discountCodes:c});if(console.log("Raw Shopify Response:",o),o.cartCreate?.userErrors?.length>0)throw new Error(o.cartCreate.userErrors[0].message);let e=o.cartCreate.cart.checkoutUrl;console.log("Original Checkout URL:",e);const r="1ndb0n-et.myshopify.com";let n=e;try{const t=new URL(e);t.hostname!==r&&(console.log(`Redirecting from ${t.hostname} to ${r}`),t.hostname=r,n=t.toString())}catch{console.log("URL parsing failed (relative path?), constructing absolute URL");const a=e.startsWith("/")?e:`/${e}`;n=`https://${r}${a}`}return console.log("Final Secure Checkout URL:",n),n}export{h as CART_CREATE_MUTATION,d as createCheckout};
