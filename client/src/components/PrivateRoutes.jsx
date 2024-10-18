import { useContext } from "react";
import { AccountContext } from "./AccountContext";

const { Outlet} = require("react-router");

const useAuth = () => {
  const { user } = useContext(AccountContext);
  //console.log("User in PrivateRoutes:", user);
  return user && user.loggedIn;
};

const PrivateRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : "";
};

export default PrivateRoutes;