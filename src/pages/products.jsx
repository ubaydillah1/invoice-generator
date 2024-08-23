import { useEffect, useState } from "react";
import { getProducts } from "../services/products.service";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts((json) => {
      setProducts(json);
    });
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {products.map((product, i) => (
        <div
          key={i}
          className="bg-black text-white p-4 rounded-lg shadow-lg w-[300px]"
        >
          <img
            src={product.image}
            alt="product"
            className="rounded-full object-cover w-[200px] h-[200px] mx-auto mb-4"
          />
          <h3 className="text-xl font-bold mb-2 truncate">{product.title}</h3>
          <p className="text-sm truncate">{product.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductsPage;
