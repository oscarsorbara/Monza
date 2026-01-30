export const PRODUCTS_QUERY = `
  query Products {
    products(first: 250) {
      edges {
        node {
          id
          title
          description
          descriptionHtml
          handle
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
                compareAtPrice {
                  amount
                  currencyCode
                }
                unitPrice {
                  amount
                  currencyCode
                }
                unitPriceMeasurement {
                  measuredType
                  quantityUnit
                  quantityValue
                  referenceUnit
                  referenceValue
                }
              }
            }
          }
          productType
          vendor
          tags
          collections(first: 5) {
            edges {
              node {
                handle
              }
            }
          }
        }
      }
    }
  }
`;
