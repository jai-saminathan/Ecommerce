import React, { useEffect, useState } from 'react';
import ProductCard from '../componenets/ProductCard';  // Import ProductCard component
import { useSearchParams } from 'react-router-dom';

function Home() {
  const [products, setProducts] = useState([]);
  const [searchParams,setsearchparams]=useSearchParams()
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/products?`+searchParams);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);  
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [searchParams]);  

  return (
    <div className="row">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />  
        ))
      ) : (
        <div>Loading...</div>  
      )}
    </div>
  );
}

export default Home;
