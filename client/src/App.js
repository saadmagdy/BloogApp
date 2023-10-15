import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import Header from "./components/header/Header";
import Home from "./pages/home/Home";
import Loign from "./pages/forms/Loign";
import Register from "./pages/forms/Register";
import Posts from "./pages/posts/Posts";
import CreatePost from "./pages/create/CreatePost";
import Admin from "./pages/admin/Admin";
import Footer from "./components/footer/Footer";
import PostDetails from "./pages/post-details/PostDetails";
import ForgotPassword from "./pages/forms/ForgetPassword";
import ResetPassword from "./pages/forms/ResetPassword";
import Profile from "./pages/profile/Profile";
import Category from "./pages/category/Category";
import UsersTable from "./pages/admin/UsersTable";
import PostsTable from "./pages/admin/PostsTable";
import CategoriesTable from "./pages/admin/CategoriesTable";
import CommentsTable from "./pages/admin/CommentsTable";
import NotFound from "./pages/not-found/NotFound";
import VerifyEmail from "./pages/verify-email/VerifyEmail";

function App() {
  const { user } = useSelector((state) => state.auth);
  return (
    <BrowserRouter>
      <ToastContainer theme="colored" position="top-center" />
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/login"
          element={!user ? <Loign /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/users/:userId/verify/:token"
          element={!user ? <VerifyEmail /> : <Navigate to="/" />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password/:userId/:token"
          element={<ResetPassword />}
        />
        <Route path="/profile/:id" element={<Profile />} />

        <Route path="posts">
          <Route index element={<Posts />} />
          <Route
            path="create"
            element={user ? <CreatePost /> : <Navigate to="/" />}
          />
          <Route path="details/:id" element={<PostDetails />} />
          <Route path="categories/:category" element={<Category />} />
        </Route>

        <Route path="admin-dashboard">
          <Route
            index
            element={user?.data.isAdmin ? <Admin /> : <Navigate to="/" />}
          />
          <Route
            path="users-table"
            element={user?.data.isAdmin ? <UsersTable /> : <Navigate to="/" />}
          />
          <Route
            path="posts-table"
            element={user?.data.isAdmin ? <PostsTable /> : <Navigate to="/" />}
          />
          <Route
            path="categories-table"
            element={
              user?.data.isAdmin ? <CategoriesTable /> : <Navigate to="/" />
            }
          />
          <Route
            path="comments-table"
            element={
              user?.data.isAdmin ? <CommentsTable /> : <Navigate to="/" />
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
