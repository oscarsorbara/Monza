import{s as c}from"./index-CrwjjN_q.js";const i=`
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
`;async function l(r,o=[]){console.log("createCheckout called with:",{items:r,discountCodes:o});const a=r.map(t=>({merchandiseId:t.variantId,quantity:t.quantity,attributes:t.attributes?Object.entries(t.attributes).map(([s,n])=>({key:s,value:n})):[]}));console.log("Prepared GraphQL lines:",a),console.log("Sending query to Shopify...");const e=await c(i,{lines:a,discountCodes:o});if(console.log("Raw Shopify Response:",e),e.cartCreate?.userErrors?.length>0)throw new Error(e.cartCreate.userErrors[0].message);return e.cartCreate.cart.checkoutUrl}export{i as CART_CREATE_MUTATION,l as createCheckout};
