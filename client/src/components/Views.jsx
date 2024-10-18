import Login from './login/Login';
import Home from './main/Home';
import Register from './login/SignUp';
import PrivateRoutes from './PrivateRoutes';
import ThreadPage from './ThreadPage';
import NotFoundPage from './NotFoundPage';
import MainNew from './main/MainNew';
import Change from './login/ChangePassword';
import { Routes, Route, Outlet } from "react-router-dom";
const Views = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/threads" element={<ThreadPage />} />
        <Route path="/threads/:id" element={<ThreadPage />} />
        <Route path="/" element={<MainNew />} />
        <Route path="/home" element={<Home />} />
        <Route element={<PrivateRoutes />}>
          
          <Route path="/change" element={<Change />} />
          <Route element={<Outlet />} />
        </Route>
        <Route  element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage replace />} />
      </Routes>
    </>
  );
};

export default Views;
