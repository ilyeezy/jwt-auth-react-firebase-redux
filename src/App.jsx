import { useEffect, useState } from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Cookies from "js-cookie";
import { privateRoutes, publickRoutes } from "./Routes";
import { Context } from "./context";
import { db } from "./firebase";
import Header from "./components/Header/Header";

import axios from "axios";
import { apiKey } from "./utils/consts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

function App() {
  const oneHour = new Date(new Date().getTime() + 60 * 60 * 1000);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.auth);
  async function checkUser() {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
        {
          grant_type: "refresh_token",
          refresh_token: Cookies.get("_RT"),
          withCredentials: true,
        },
      );
      Cookies.set("_AT", response.data["id_token"], {
        expires: oneHour,
        secure: true,
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!Cookies.get("_AT") && Cookies.get("_RT")) {
      checkUser();
    }
  }, [auth.userInfo]);

  return (
    <Context.Provider
      value={{
        db,
        isLoading,
      }}
    >
      <Header />

      {Cookies.get("_AT") ? (
        <Routes>
          {privateRoutes.map((route) => (
            <Route
              exact={true}
              key={route.path}
              path={route.path}
              element={<route.component></route.component>}
            ></Route>
          ))}
          <Route path="*" element={<Navigate to="/profile" />}></Route>
        </Routes>
      ) : (
        <Routes>
          {publickRoutes.map((route) => (
            <Route
              exact={true}
              key={route.path}
              path={route.path}
              element={<route.component></route.component>}
            ></Route>
          ))}
          <Route path="*" element={<Navigate to="/login" />}></Route>
        </Routes>
      )}
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="dark"
      />
    </Context.Provider>
  );
}

export default App;
