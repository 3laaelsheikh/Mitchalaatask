import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import abuaufimage from "../../Images/AbuAuf.jpg";
import cartimage from "../../Images/Icon.svg"
import frame from "../../Images/Content Frame.jpg"
import toast from "react-hot-toast";



const Products = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(null); // New state for filtered products
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartQuantity, setCartQuantity] = useState({}); // State to track total items in cart
  const [productsPerPage, setProductsPerPage] = useState(12); // State for products per page

  


  const handleIncrement = () => {
    setQuantity(quantity + 1);
    setCartQuantity({
      ...cartQuantity,
      [selectedProduct.id]: (cartQuantity[selectedProduct.id] || 0) + 1,
    });
    if (selectedProduct) {
      toast.success("Product added successfuly");
    }
  };

  const handleDecrement = () => {
    if (cartQuantity[selectedProduct.id] > 1) {
      setCartQuantity({
        ...cartQuantity,
        [selectedProduct.id]: cartQuantity[selectedProduct.id] - 1,
      });
      if (selectedProduct) {
        toast.success("Product deleted successfuly");
      }
    } else {
      setCartQuantity({
        ...cartQuantity,
        [selectedProduct.id]: 0,
      });
      setSelectedProduct(null);
    }

  };

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setCartQuantity({
      ...cartQuantity,
      [product.id]: (cartQuantity[product.id] || 0) + 1,
    });
  };


  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterProducts(term); // Call function to filter products
  };

  const filterProducts = (term) => {
    if (!term) {
      setFilteredProducts(products); // If search term is empty, show all products
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered); // Update filtered products
    }
  };
  
  const handleClear = () => {
    setSearchTerm('');
    filterProducts(''); // Reset the filtered products
    fetchProducts(selectedCategory); // Refetch products to update the data
  };

  const handleShowMore = () => {
    setProductsPerPage(productsPerPage + 8); // Increment products per page by 8
  };


  const categories = [
    "Coffee",
    "Ramadan Products",
    "Nuts",
    "Healthy Snacks",
    "Beverages",
    "Gifting &amp;Seasonal",
    "Healthy Food",
    "Kitchen &amp; Baking",
    "Flavored Coffee",
    "Maamoul",
  ];

  const handleCategoryClick = (category) => {
    const updatedCategory = selectedCategory === category ? '' : category;
    setSelectedCategory(updatedCategory);
    setProductsPerPage(12); // Reset products per page to 12 when category changes
  };

  const handleCancelClick = (e, category) => {
    e.stopPropagation();
    setSelectedCategory('');
    setProductsPerPage(12); // Reset products per page to 12 when category changes
  };


  const fetchProducts = useCallback(async (category) => {
    const url = 'https://woosonicpwa.com/MitchAPI/filter.php';
    const body = {
      category: category,
      price_range: [0, 100000000],
      products_per_page: productsPerPage,
      page: 1,
      sort: {
        criteria: "date",
        arrangement: "DESC",
      },
      keyword: "",
    };

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(url, body, { headers });
      let filteredProducts = response.data;
    if (searchTerm) {
      filteredProducts = response.data.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
      setProducts(filteredProducts);
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, [productsPerPage, searchTerm]);

  useEffect(() => {
    setLoading(true);
    fetchProducts(selectedCategory);
  }, [selectedCategory,productsPerPage]); // Refetch products to update the data depend on the dependances
  
  

  return (
    <>
      <div className="container m-auto xl:max-w-[1200px]">

      {/* start search and cart section */}

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 justify-center items-center my-10 p-4">
          <div className="relative lg:p-5 md:p-3 sm:p-2 bg-[#edc843] w-16 rounded-full flex items-center justify-center ">
              <img src={cartimage} alt="Cart Icon" className="" />
            <div className="absolute -top-3 -left-3 flex items-center justify-center w-8 h-8 bg-[#163300] text-white text-sm font-semibold rounded-full">
              {Object.values(cartQuantity).reduce((total, qty) => total + qty, 0)}
            </div>
          </div>

            <div className="p-4 rounded-full border-4 border-[#163300] bg-white flex items-center">
              {searchTerm && (
              <i className="fa-solid fa-xmark text-white ml-3 bg-zinc-500 rounded-full p-1 text-center cursor-pointer" onClick={handleClear}></i>
              )}
              <div className="flex-grow ">
                <div className="flex items-center flex-grow">
                  <input
                    className="text-black text-xl font-semibold w-full border-none outline-none"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="Search..."
                  />
                </div>
              </div>
              <i className="fa-solid fa-magnifying-glass text-[#163300ff] ml-3 rounded-full p-1 text-center cursor-pointer"></i>
            </div>
      </div>

      {/* end search and cart section */}

      {/* start navegation section */}


        <div className="flex gap-6 py-5 px-4">
          <div className="flex gap-6 items-center">
            <div className="flex gap-4 items-center">
              <span className="font-semibold text-lg text-[#185039]">
              {selectedCategory? <> Main <i className="fa-solid fa-chevron-right"></i> {selectedCategory}</>: ""}
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4 px-4">
          All products  {selectedCategory?`of ${selectedCategory}` : ""}
        </h1>
        {/* end navegation section */}

        {/* start filtered by category section */}
        
        <div className="container p-4 m-auto py-5 flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <div key={category}
            className={`bg-[#edefebff] py-2 px-4 rounded-full flex items-center mx-1 cursor-pointer lg:w-1/8 md:w-1/6 sm:w-10/12 ${selectedCategory === category ? 'bg-[#ccc] flex justify-between' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            <span className="text-[#163300ff]">{category}</span>
            {selectedCategory === category && (
            <i className="fa-solid fa-xmark  text-[#ccc] ml-3 bg-[#163300ff] rounded-full p-1 text-center" onClick={(e) => handleCancelClick(e, category)}></i>
            )}
          </div>
        ))}  
      </div>

        {/* end filtered by category section */}

        {/* start Product section */}

        {loading ? (
          <div className="py-5 flex justify-center items-center">
            <RotatingLines
              strokeColor="#163300ff"
              strokeWidth="5"
              animationDuration="0.75"
              width="96"
              visible={true}
            />
          </div>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="container p-4 m-auto py-5">
            <div className="container grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product, idx) => (
                <div key={idx} className="border-2 rounded-3xl">
                  <div className="flex justify-center items-center relative">
                    {product.main_image ? (
                      <img
                        src={product.main_image}
                        alt={product.name}
                        className="w-full object-cover mb-2 rounded-t-3xl h-[366px]"
                      />
                    ) : (
                      <img
                        src={abuaufimage} alt={product.name} className="w-full object-cover mb-2 rounded-t-3xl h-[366px]"  
                      />
                    )}

                    <img
                      src={frame}
                      className="border-2 absolute bottom-0 left-0  bg-white border-gray-400 m-2.5 mb-4 p-2 rounded-full"
                      alt=""
                    />
                  </div>
                  <div className="p-4">
                    <div className="pb-5">
                      <h2 className="text-xl font-semibold">
                        {product.name.split("-")[0]}
                      </h2>
                      <p className="text-gray-400">
                        {product.name.split("-")[1]}
                      </p>
                      <div className="flex justify-start py-3">
                        <p className=" mb-2 bg-[#EDC843] rounded-lg px-2 justify-start text-xl font-bold  text-black">
                          <span className="text-xs font-normal">EGP</span>
                          {product.price}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between pt-3 ">
                      <div className="mr-2 p-2.5 flex items-center justify-center bg-[#EDEFEB] rounded-full">
                        <i className="fa-regular fa-heart"></i>
                      </div>
                      <div className="w-full">
                      {(!selectedProduct || selectedProduct.id !== product.id) && (
                        <button className={`bg-[#163300] text-white w-full py-1 px-3 rounded-full ${product.availability === "instock"? "": "bg-gray-400 pointer-events-none"}`}
                        onClick={() => handleAddToCart(product)}
                        >
                        {product.availability === "instock"? "Add to cart": "Out of stock"}
                        </button>
                      )}
                      {(selectedProduct && selectedProduct.id === product.id && (cartQuantity[selectedProduct.id] || 0) > 0) && (<>
                        <div className="flex items-baseline">
                          <button className="bg-[#163300] text-white w-full py-1 px-3 rounded-xl" onClick={handleDecrement}>-</button>
                          <p className="px-5">{cartQuantity[selectedProduct.id]}</p>
                          <button className="bg-[#163300] text-white w-full py-1 px-3 rounded-xl" onClick={handleIncrement}>+</button>
                          </div>
                        </>)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>  
        )}

        {/* end Product section */}
        {/* start button of show more section */}

        <div className="flex justify-center items-center py-5">
          <button className="flex items-center justify-center px-5 py-2.5 bg-white border-2 border-[#868685] rounded-full" onClick={handleShowMore}>
            <span className="font-bold text-lg  text-green-900">Show more</span>
          </button>
        </div>

        {/* end button of show more section */}

      </div>
    </>
  );
};

export default Products;