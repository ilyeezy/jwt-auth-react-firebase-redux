import Home from "../pages/Home";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import Profile from "../pages/profile/Profile";

export const privateRoutes = [
  {
    path: "/profile",
    component: Profile,
  },
  {
    path: "/",
    component: Home,
  },
];
export const publickRoutes = [
  {
    path: "/login",
    component: Login,
  },

  {
    path: "/",
    component: Home,
  },

  {
    path: "/signUp",
    component: SignUp,
  },
];
