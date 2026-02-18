import{s as i}from"./index-7CVpegUU.js";const l=`
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
`;async function u(n,a=[]){console.log("createCheckout called with:",{items:n,discountCodes:a});const s=n.map(e=>({merchandiseId:e.variantId,quantity:e.quantity,attributes:e.attributes?Object.entries(e.attributes).map(([r,c])=>({key:r,value:c})):[]}));console.log("Prepared GraphQL lines:",s),console.log("Sending query to Shopify...");const t=await i(l,{lines:s,discountCodes:a});if(console.log("Raw Shopify Response:",t),t.cartCreate?.userErrors?.length>0)throw new Error(t.cartCreate.userErrors[0].message);let o=t.cartCreate.cart.checkoutUrl;console.log("Original Checkout URL:",o);try{const e=new URL(o),r="1ndb0n-et.myshopify.com";(e.hostname.includes("monzars.com")||e.hostname===window.location.hostname)&&(console.log(`Replacing hostname ${e.hostname} with ${r}`),e.hostname=r,o=e.toString())}catch(e){console.error("Error patching URL:",e)}return console.log("Final Checkout URL:",o),o}export{l as CART_CREATE_MUTATION,u as createCheckout};
