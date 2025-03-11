// import React, { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { IoBagOutline } from "react-icons/io5";
// import { IoMdHeartEmpty } from "react-icons/io";
// import { auth, db } from "../firebase";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   where,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";

// const SeparateProduct = () => {
//   // Get product ID from URL params
//   const { id } = useParams();
//   // Get products and current user from Redux store
//   const { products } = useSelector((state) => state.products);
//   const { currentUser } = useSelector((state) => state.user);
//   // State variables for managing actions and loading states

//   const [actionValidation, setActionValidation] = useState(null);
//   console.log(currentUser);

//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [isAddedToBag, setIsAddedToBag] = useState(false);
//   const [loadingBag, setLoadingBag] = useState(false);
//   const [loadingWishlist, setLoadingWishlist] = useState(false);
//   // Parse product ID from URL params

//   const productId = parseInt(id);
//   // Find the product with the matching ID

//   const item = products.find((product) => product.id === productId);
//   console.log(item);

//   // Effect to check if the product is wishlisted or added to bag

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         const q = query(
//           collection(db, "users", user.uid, "wishlist"),
//           where("productId", "==", item.id)
//         );
//         const querySnapshot = await getDocs(q);
//         if (!querySnapshot.empty) {
//           setIsWishlisted(true);
//         }
//       }
//     };

//     const fetchBag = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         const q = query(
//           collection(db, "users", user.uid, "bag"),
//           where("productId", "==", item.id)
//         );
//         const querySnapshot = await getDocs(q);
//         if (!querySnapshot.empty) {
//           setIsAddedToBag(true);
//         }
//       }
//     };

//     fetchWishlist();
//     fetchBag();
//   }, [item.id]);

//   // Function to handle adding the product to bag

//   const handleAddToBag = async () => {
//     if (!currentUser) {
//       setActionValidation("You must be logged in to perform this action");
//       return;
//     }
//     const user = auth.currentUser;
//     console.log("Current user:", user);
//     if (user) {
//       setLoadingBag(true);
//       try {
//         // Add the product to bag collection in Firestore

//         await addDoc(collection(db, "users", user.uid, "bag"), {
//           productId: item.id,
//           title: item.title,
//           description: item.description,
//           price: item.price,
//           image: item.image,
//           quantity: 1,
//           addedAt: new Date(),
//         });
//         console.log("Item added to bag");
//         setIsAddedToBag(true);
//       } catch (error) {
//         console.error("Error adding item to bag:", error.message);
//       } finally {
//         setLoadingBag(false);
//         setActionValidation(null);
//       }
//     } else {
//       console.log("User is not signed in");
//     }
//   };
//   // Function to handle adding/removing the product to/from wishlist

//   const handleAddToWishlist = async () => {
//     if (!currentUser) {
//       setActionValidation("You must be logged in to perform this action");
//       return;
//     }
//     const user = auth.currentUser;
//     console.log("Current user:", user);
//     if (user) {
//       setLoadingWishlist(true);
//       try {
//         // Check if the product is wishlisted and add/remove accordingly

//         if (isWishlisted) {
//           // Get the document ID for the item in the wishlist collection
//           const q = query(
//             collection(db, "users", user.uid, "wishlist"),
//             where("productId", "==", item.id)
//           );
//           const querySnapshot = await getDocs(q);
//           if (!querySnapshot.empty) {
//             const wishlistDocId = querySnapshot.docs[0].id;
//             await deleteDoc(
//               doc(db, "users", user.uid, "wishlist", wishlistDocId)
//             );
//             setIsWishlisted(false);
//             console.log("Item removed from wishlist");
//           }
//         } else {
//           await addDoc(collection(db, "users", user.uid, "wishlist"), {
//             productId: item.id,
//             title: item.title,
//             description: item.description,
//             price: item.price,
//             image: item.image,
//             addedAt: new Date(),
//           });
//           console.log("Item added to wishlist");
//           setIsWishlisted(true);
//         }
//       } catch (error) {
//         console.error("Error updating wishlist:", error.message);
//       } finally {
//         setLoadingWishlist(false);
//         setActionValidation(null);
//       }
//     } else {
//       console.log("User is not signed in");
//     }
//   };

//   // Render product details and action buttons

//   return (
//     <div>
//       <div className="flex md:flex-row flex-col min-h-screen justify-around items-center p-2">
//         <div className="md:w-1/2 p-4 md:p-0 flex justify-center">
//           <img className="w-96" src={item.image} alt={item.title} />
//         </div>

//         <div className="md:w-1/2 p-4 md:p-0 md:pr-8">
//           <h1 className="text-2xl font-bold tracking-wider">{item.title}</h1>
//           <p className="text-xl mt-4 text-gray-500">{item.description}</p>
//           <p className="mt-4 text-xl font-bold">${item.price}</p>
//           <p className="text-green-700 mt-1 font-bold">
//             inclusive of all taxes
//           </p>

//           <div className="flex gap-4 w-full mt-7">
//             <button
//               onClick={handleAddToBag}
//               disabled={isAddedToBag || loadingBag}
//               className={`flex w-3/5 justify-center p-3 gap-2 items-center ${
//                 isAddedToBag
//                   ? "bg-gray-500 cursor-not-allowed"
//                   : "bg-pink-600 hover:opacity-90 cursor-pointer"
//               }`}
//             >
//               <IoBagOutline className="text-xl text-white font-bold" />
//               <span className="text-white font-bold">
//                 {loadingBag
//                   ? "Loading..."
//                   : isAddedToBag
//                   ? "Added to Bag"
//                   : "Add to Bag"}
//               </span>
//             </button>
//             <button
//               onClick={handleAddToWishlist}
//               disabled={loadingWishlist}
//               className="flex w-2/5 border-2 border-gray-500 hover:border-black hover:opacity-90 cursor-pointer justify-center p-3 gap-2 items-center"
//             >
//               <IoMdHeartEmpty
//                 className={`${
//                   isWishlisted ? "text-pink-700" : ""
//                 } text-xl font-bold`}
//               />
//               <span className="font-bold">
//                 {loadingWishlist
//                   ? "Loading..."
//                   : isWishlisted
//                   ? "Wishlisted"
//                   : "Wishlist"}
//               </span>
//             </button>
//           </div>

//           {actionValidation && (
//             <p className="text-red-600 p-2 text-sm">
//               {actionValidation}
//               <Link className="text-blue-600 ml-2 underline" to="/signin">
//                 Sign in
//               </Link>
//             </p>
//           )}

//           <div className="mt-4 text-gray-500">
//             <p>100% Original Products</p>
//             <p>Pay on delivery might be available</p>
//             <p>Easy 14 days returns and exchanges</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SeparateProduct;

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { IoBagOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchWishlist } from "../redux/wishlist/wishlistSlice";

const API_URL = "http://localhost:5000/api"; // Change this to match your backend URL

const SeparateProduct = () => {
  // Get product ID from URL params
  const { id } = useParams();

  // State variables
  const [product, setProduct] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToBag, setIsAddedToBag] = useState(false);
  const [loadingBag, setLoadingBag] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
   const dispatch = useDispatch();

  // Fetch product details from MongoDB
  useEffect(() => {
    if (!id) {
      console.error("Product ID is undefined");
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
      }
    };

    fetchProduct();
  }, [id]);

  // Function to handle adding the product to the cart
  const handleAddToBag = async () => {
    setLoadingBag(true);
    console.log(currentUser);
    if (!currentUser.user._id) {
      console.error("User is not authenticated.");
      setLoadingBag(false);
      return;
    }

    const productData = {
      userId: currentUser.user._id, // Ensure userId is passed
      products: [
        {
          productId: product._id,
          title: product.title,
          price: product.price,
          image: product.image,
          description: product.description,
          quantity: 1,
        },
      ],
    };

    console.log("Adding to cart:", productData); // Debugging

    try {
      const response = await axios.post(`${API_URL}/cart`, productData);
      console.log("Cart Response:", response.data);
      setIsAddedToBag(true);
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setLoadingBag(false);
    }
  };

  // const getToken = () => {
  //   try {
  //     // Step 1: Retrieve the persisted Redux state from localStorage
  //     const persistedState = localStorage.getItem("persist:root");
  //     if (!persistedState) {
  //       console.error("No persisted state found.");
  //       return null;
  //     }

  //     // Step 2: Parse it as a JSON object
  //     const parsedState = JSON.parse(persistedState);

  //     // Step 3: Extract 'user' and parse it as JSON again
  //     const user = parsedState.user ? JSON.parse(parsedState.user) : null;

  //     // Step 4: Extract token from currentUser
  //     return user?.currentUser?.token || null;
  //   } catch (error) {
  //     console.error("Error extracting token:", error);
  //     return null;
  //   }
  // };

  // // Function to handle adding/removing the product from wishlist
  // const handleAddToWishlist = async () => {
  //   setLoadingWishlist(true);
  //   try {
  //     const token = getToken();
  //     console.log(token);
  //     if (!token) {
  //       console.error("No authentication token found.");
  //       setLoadingWishlist(false);
  //       return;
  //     }

  //     const headers = { Authorization: `Bearer ${token}` }; // Attach token
  //     if (isWishlisted) {
  //       await axios.delete(
  //         `${API_URL}/wishlist/${currentUser.user._id}/${product._id}`
  //       );
  //       setIsWishlisted(false);
  //     } else {
  //       await axios.post(
  //         `${API_URL}/wishlist`,
  //         {
  //           userId: currentUser?.user?._id,
  //           products: [{
  //             productId: product?._id,
  //             title: product?.title,
  //             price: product?.price,
  //             image: product?.image
  //           }]
  //         },
  //         { headers }
  //       );
  //       setIsWishlisted(true);
  //     }
  //   } catch (err) {
  //     console.error("Error updating wishlist:", err);
  //   } finally {
  //     setLoadingWishlist(false);
  //   }
  // };

  const handleAddToWishlist = async () => {
    setLoadingWishlist(true);
  
    if (!currentUser?.user?._id) {
      console.error("User is not authenticated.");
      setLoadingWishlist(false);
      return;
    }
  
    console.log("User ID:", currentUser.user._id); // Debugging userId
  
    try {
      const token = localStorage.getItem("persist:root")
        ? JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
        : null;
  
      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }
  
      const response = await axios.post(
        `${API_URL}/wishlist`,
        {
          userId: currentUser.user._id,
          products: [{ productId: product?._id, title: product?.title, price: product?.price, image: product?.image }],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Wishlist updated:", response.data);
      dispatch(fetchWishlist(currentUser.user._id)); // Fetch latest wishlist
      setIsWishlisted(true);
    } catch (err) {
      console.error("Error updating wishlist:", err.response?.data || err);
    } finally {
      setLoadingWishlist(false);
    }
  };
  
  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p>Loading product details...</p>;

  return (
    <div>
      <div className="flex md:flex-row flex-col min-h-screen justify-around items-center p-2">
        <div className="md:w-1/2 p-4 md:p-0 flex justify-center">
          <img className="w-96" src={product.image} alt={product.title} />
        </div>

        <div className="md:w-1/2 p-4 md:p-0 md:pr-8">
          <h1 className="text-2xl font-bold tracking-wider">{product.title}</h1>
          <p className="text-xl mt-4 text-gray-500">{product.description}</p>
          <p className="mt-4 text-xl font-bold">Rs.{product.price}</p>
          <p className="text-green-700 mt-1 font-bold">
            inclusive of all taxes
          </p>

          <div className="flex gap-4 w-full mt-7">
            <button
              onClick={handleAddToBag}
              disabled={isAddedToBag || loadingBag}
              className={`flex w-3/5 justify-center p-3 gap-2 items-center ${
                isAddedToBag
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-pink-600 hover:opacity-90 cursor-pointer"
              }`}
            >
              <IoBagOutline className="text-xl text-white font-bold" />
              <span className="text-white font-bold">
                {loadingBag
                  ? "Loading..."
                  : isAddedToBag
                  ? "Added to Bag"
                  : "Add to Bag"}
              </span>
            </button>

            <button
              onClick={handleAddToWishlist}
              disabled={loadingWishlist}
              className="flex w-2/5 border-2 border-gray-500 hover:border-black hover:opacity-90 cursor-pointer justify-center p-3 gap-2 items-center"
            >
              <IoMdHeartEmpty
                className={`${
                  isWishlisted ? "text-pink-700" : ""
                } text-xl font-bold`}
              />
              <span className="font-bold">
                {loadingWishlist
                  ? "Loading..."
                  : isWishlisted
                  ? "Wishlisted"
                  : "Wishlist"}
              </span>
            </button>
          </div>

          <div className="mt-4 text-gray-500">
            <p>100% Original Products</p>
            <p>Pay on delivery might be available</p>
            <p>Easy 14 days returns and exchanges</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeparateProduct;
