import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProductDetail({ cartItems, setCartItems }) {
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { id } = useParams();

  useEffect(() => {
    console.log("Product ID:", id); 
    const fetchProduct = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/product/` + id; 
        console.log("API URL:", apiUrl); 
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        console.log("Fetched product:", data);

        if (data.product) {
          setProduct(data.product); 
          console.error("Product not found in response");
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null); 
      }
    };

    if (id) {
      fetchProduct();
    } else {
      console.error("Product ID is not valid");
    }
  }, [id]);

  const handleQuantityChange = (operation) => {
    setQty((prev) => {
      if (operation === "increase" && prev < product.stock) return prev + 1;
      if (operation === "decrease" && prev > 1) return prev - 1;
      return prev;
    });
  };

  const handleAddToCart = () => {
    const itemExist = cartItems.find((item) => item.product._id === product._id);
    if (!itemExist) {
      const newItem = { product, qty };
      setCartItems((state) => [...state, newItem]);
      toast.success("Item added to cart!");
    } else {
      toast.info("Item already in cart!");
    }
  };

  const increaseQty = () => {
    if (qty < product.stock) {
      setQty((prev) => prev + 1);
    }
  };

  const decreaseQty = () => {
    if (qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  if (!product) {
    return <div>Product not found or loading...</div>; 
  }

  return (
    <div className="container container-fluid">
      <div className="row d-flex justify-content-around">
        <div className="col-12 col-lg-5">
          <img
            src={product.images[0]?.image || "/placeholder-image.jpg"} // Fallback if no image exists
            alt={product.name}
            className="img-fluid"
            height="500"
            width="500"
          />
        </div>

        <div className="col-12 col-lg-5 mt-5">
          <h3>{product.name}</h3>
          <p id="product_id">Product # {product._id}</p>
          <hr />

          <div className="rating-outer">
            <div
              className="rating-inner"
              style={{ width: `${(product.ratings / 5) * 100}%` }}
            ></div>
          </div>
          <hr />

          <p id="product_price">${product.price}</p>

          <div className="stockCounter d-inline">
            <span
              className="btn btn-danger minus"
              onClick={decreaseQty}
              disabled={qty <= 1}
            >
              -
            </span>

            <input
              type="number"
              className="form-control count d-inline"
              value={qty}
              readOnly
            />

            <span
              className="btn btn-primary plus"
              onClick={increaseQty}
              disabled={qty >= product.stock}
            >
              +
            </span>
          </div>

          <button
            type="button"
            id="cart_btn"
            className="btn btn-primary d-inline ml-4"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>

          <hr />

          <p>
            Status:{" "}
            <span
              id="stock_status"
              className={product.stock > 0 ? "text-success" : "text-danger"}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>

          <hr />

          <h4 className="mt-2">Description:</h4>
          <p>{product.description}</p>

          <hr />

          <p id="product_seller mb-3">
            Sold by: <strong>{product.seller}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
