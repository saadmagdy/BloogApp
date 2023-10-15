import "./category.css";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PostList from "../../components/posts/PostList";
import { fetchPostsByCategory } from "../../redux/apiCalls/postApiCall";

const Category = () => {
  const dispatch = useDispatch();
  const { postsCategory } = useSelector((state) => state.post);
  const { category } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchPostsByCategory(category));
  }, [dispatch, category]);

  return (
    <section className="category">
      {postsCategory.length === 0 ? (
        <>
          <h1 className="category-not-found">
            posts with <span>{category} </span> category not found
          </h1>
          <Link className="category-not-found-link" to="/posts">
            Go to posts page
          </Link>
        </>
      ) : (
        <>
          <h1 className="category-title">Posts based on {category}</h1>
          <PostList posts={postsCategory} />
        </>
      )}
    </section>
  );
};

export default Category;
