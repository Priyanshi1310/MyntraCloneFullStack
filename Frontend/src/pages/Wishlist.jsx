// import React, { useState, useEffect } from "react";
// import WishlistedItem from "../components/WishlistedItem";
// import { auth, db } from "../firebase";
// import { collection, getDocs } from "firebase/firestore";

// const Wishlist = () => {
//   // State variables for wishlist items and loading state
//   const [bagItems, setBagItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Function to fetch wishlist items
//   const fetchBagItems = async () => {
//     const user = auth.currentUser;
//     if (user) {
//       try {
//         const querySnapshot = await getDocs(
//           collection(db, "users", user.uid, "wishlist")
//         );
//         const items = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setBagItems(items);
//       } catch (error) {
//         console.error("Error fetching bag items:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       setLoading(false);
//     }
//   };

//   // Effect hook to fetch bag items on component mount
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         fetchBagItems();
//       } else {
//         setLoading(false);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   // Function to handle removal of an item from wishlist
//   const handleRemove = (id) => {
//     const updatedItems = bagItems.filter((item) => item.id !== id);
//     setBagItems(updatedItems);
//   };

//   // If loading, display loading message
//   if (loading) {
//     return <div className="text-center py-10">Loading...</div>;
//   }

//   // Render wishlist items
//   return (
//     <div className="container mx-auto p-6 min-h-screen">
//       <h1 className="text-2xl font-bold text-center mb-6">My Wishlist</h1>
//       {bagItems.length === 0 ? (
//         <p className="text-center text-gray-500">
//           No items have been wishlisted
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {bagItems.map((item) => (
//             <WishlistedItem key={item.id} item={item} onRemove={handleRemove} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Wishlist;

import React, { useEffect } from "react";
import WishlistedItem from "../components/WishlistedItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "../redux/wishlist/wishlistSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { wishlist, loading } = useSelector((state) => state.wishlist);
  console.log(wishlist)
  useEffect(() => {
    if (user && user._id) {
      console.log("wishlist userid",user._id)
      dispatch(fetchWishlist(user._id));
    }
  }, [dispatch, user]);

  if (!user) {
    return <div className="text-center py-10 text-red-500">User not logged in</div>;
  }

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const uniqueWishlist = wishlist ? [...new Map(wishlist.map(item => [item.productId, item])).values()] : [];


  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">My Wishlist</h1>
      {loading ? (
      <p className="text-center">Loading...</p>
    ) : !wishlist || wishlist.length === 0 ? (
      <p className="text-center text-gray-500">No items have been wishlisted</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueWishlist.map((item) => (
          <WishlistedItem key={item.productId} item={item} />
        ))}
      </div>
    )}
    </div>
  );
};

export default Wishlist;

