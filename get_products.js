const fetch = require('node-fetch');
const query = `
{
  products(first: 50, query: "title:\\"Parrilla\\"") {
    edges {
      node {
        id
        handle
        title
      }
    }
  }
}
`;

fetch('https://1ndb0n-et.myshopify.com/api/2025-04/graphql.json', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': '444faa8024ac64a7ffbed394cf5771f7'
  },
  body: JSON.stringify({ query })
})
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.error(err));
