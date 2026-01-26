export const COLLECTIONS_QUERY = `
  query Collections {
    collections(first: 20) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`;
