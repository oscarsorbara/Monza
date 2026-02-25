import{s as u}from"./index-P5YYhVrh.js";const h=`
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
`;async function d(s,c=[]){console.log("createCheckout called with:",{items:s,discountCodes:c});const i=s.map(t=>({merchandiseId:t.variantId,quantity:t.quantity,attributes:t.attributes?Object.entries(t.attributes).map(([n,l])=>({key:n,value:l})):[]}));console.log("Prepared GraphQL lines:",i),console.log("Sending query to Shopify...");const o=await u(h,{lines:i,discountCodes:c});if(console.log("Raw Shopify Response:",o),o.cartCreate?.userErrors?.length>0)throw new Error(o.cartCreate.userErrors[0].message);let e=o.cartCreate.cart.checkoutUrl;console.log("Original Checkout URL:",e);const r="checkout.monzars.com";let a=e;try{const t=new URL(e);t.hostname!==r&&(console.log(`Redirecting from ${t.hostname} to ${r}`),t.hostname=r,a=t.toString())}catch{console.log("URL parsing failed (relative path?), constructing absolute URL");const n=e.startsWith("/")?e:`/${e}`;a=`https://${r}${n}`}return console.log("Final Secure Checkout URL:",a),a}export{h as CART_CREATE_MUTATION,d as createCheckout};
