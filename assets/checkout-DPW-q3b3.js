import{s as c}from"./index-CJcQbOX6.js";const i=`
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
`;async function l(a,r=[]){const s=a.map(e=>({merchandiseId:e.variantId,quantity:e.quantity,attributes:e.attributes?Object.entries(e.attributes).map(([n,o])=>({key:n,value:o})):[]}));console.log("Creating cart with lines:",s,"Discounts:",r);const t=await c(i,{lines:s,discountCodes:r});if(console.log("Cart Response:",t),t.cartCreate?.userErrors?.length>0)throw new Error(t.cartCreate.userErrors[0].message);return t.cartCreate.cart.checkoutUrl}export{i as CART_CREATE_MUTATION,l as createCheckout};
