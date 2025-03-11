// import React from "react";
// import { Link } from "react-router-dom";
// import men_category from "../assets/men_category.avif";
// import women_category from "../assets/woman-category.jpg";
// import tech_category from "../assets/tech_category.avif";
// import jewelery_category from "../assets/jewellery_category.jpg";
// import { selectCategory } from "../redux/products/productSlice";
// import { useDispatch } from "react-redux";

// // Component for displaying category cards and navigating to respective category products
// const ShopByCategory = () => {
//   const dispatch = useDispatch(); // Initialize useDispatch hook

//   // Array containing category details
//   const categories = [
//     {
//       name: "Men's Wear",
//       image: men_category,
//       category: "men's clothing",
//     },
//     {
//       name: "Women's Wear",
//       image: women_category,
//       category: "women's clothing",
//     },
//     {
//       name: "Electronics",
//       image: tech_category,
//       category: "electronics",
//     },
//     {
//       name: "Jewelery",
//       image: jewelery_category,
//       category: "jewelery",
//     },
//   ];

//   // Component for individual category card
//   const CategoryCard = ({ name, image }) => {
//     return (
//       <div className="flex items-center justify-center shadow-md">
//         <div className="relative rounded-lg overflow-hidden group">
//           <img
//             className="object-cover w-36 h-24 md:h-44 md:w-48 transition duration-300 transform group-hover:scale-105"
//             src={image}
//             alt={name}
//           />
//           <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//             <p className="text-white text-sm md:text-lg font-semibold">
//               {name}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Function to navigate to products of selected category
//   const navigateToProducts = (category) => {
//     dispatch(selectCategory(category));
//   };

//   return (
//     <section>
//       <div className="p-8">
//         <h1 className="text-3xl mt-6 p-4 font-bold tracking-wider">
//           SHOP BY CATEGORY
//         </h1>

//         {/* Display category cards */}
//         <div className="flex flex-wrap gap-8 w-full justify-center md:justify-start md:pl-12 pt-6">
//           {categories.map((cat, idx) => (
//             <Link
//               to="/products"
//               key={idx}
//               onClick={() => navigateToProducts(cat.category)}
//             >
//               <CategoryCard key={idx} name={cat.name} image={cat.image} />
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ShopByCategory;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios"; // Import Axios
import { selectCategory } from "../redux/products/productSlice";

const API_URL = "http://localhost:5000/api"; // Update if needed

const ShopByCategory = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { name: "Men's Wear", category: "menClothes" },
    { name: "Women's Wear", category: "womenClothes" },
    { name: "Electronics", category: "electronics" },
    { name: "Footwear", category: "Footwear" },
  ];

  const fetchProductsByCategory = async (category) => {
    setLoading(true);
    try {
      const encodedCategory = encodeURIComponent(category); // ✅ Encode spaces
      const response = await axios.get(`${API_URL}/products/category/${encodedCategory}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="p-8">
        <h1 className="text-3xl mt-6 p-4 font-bold tracking-wider">
          SHOP BY CATEGORY
        </h1>
        <div className="flex flex-wrap gap-8 w-full justify-center md:justify-start md:pl-12 pt-6">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => fetchProductsByCategory(cat.category)}
              className="p-2 bg-gray-200 rounded-md"
            >
              {cat.name}
            </button>
          ))}
        </div>
        
        {loading ? (
          <p className="text-center mt-4">Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            {products.map((product) => (
              <div key={product._id} className="p-4 border rounded-md shadow-md">
                <img className="w-full h-40 object-cover" src={product.image} alt={product.title} />
                <h3 className="mt-2 text-lg font-semibold">{product.title}</h3>
                <p className="text-gray-600">₹{product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopByCategory;

