export const getProducts = (callback) => {
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((json) => callback(json))
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
};
