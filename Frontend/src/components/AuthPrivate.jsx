// src/components/AuthPrivateRoute.js
// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Outlet, Navigate } from "react-router-dom";
// import axios from "axios";
// import { loginSuccess } from "../redux/user/userSlice";
// import { checkAuthStatus } from "../redux/user/userSlice";

// const AuthPrivateRoute = () => {
//   const { currentUser } = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/auth/current", { withCredentials: true });
//         if (response.data) {
//          // dispatch(loginSuccess(response.data));
//          dispatch(checkAuthStatus());
//         }
//       } catch (error) {
//         console.error("Error fetching authenticated user:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!currentUser) {
//       fetchUser();
//     } else {
//       setLoading(false);
//     }
//   }, [dispatch, currentUser]);

//   if (loading) return <p>Loading...</p>;

//   return !currentUser ? <Outlet /> : <Navigate to="/" />;
// };

// export default AuthPrivateRoute;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import { loginUser } from "../redux/user/userSlice";

const AuthPrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if(!token){
          setLoading(false);
          return;
        }
        
        const response = await axios.get("http://localhost:5000/api/auth/current", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data) {
          dispatch(loginUser(response.data));  // Update Redux store
        }
      } catch (error) {
        console.error("Error fetching authenticated user:", error);
        localStorage.removeItem("token")
      } finally {
        setLoading(false);
      }
    };

    if (!currentUser) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [dispatch, currentUser]);

  if (loading) return <p>Loading...</p>;

  return !currentUser ? <Outlet /> : <Navigate to="/signin" />;
};

export default AuthPrivateRoute;
