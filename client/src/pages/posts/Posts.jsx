import "./post-page.css";
import PostList from "../../components/posts/PostList";
import Sidebar from "../../components/sidebar/Sidebar";
import Pagenation from "../../components/pagenation/Pagenation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostsCount, fetchPosts } from "../../redux/apiCalls/postApiCall";
const POST_PER_PAGE = 3;
const Posts = () => {
  const dispatch = useDispatch();
  const { postsCount, posts } = useSelector((state) => state.post);
  const [curentPage, setCurentPage] = useState(1);
  const pages = Math.ceil(postsCount / POST_PER_PAGE);
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchPosts(curentPage));
  }, [dispatch, curentPage]);
  useEffect(() => {
    dispatch(getPostsCount());
  }, [dispatch]);
  return (
    <>
      <section className="posts-page">
        <PostList posts={posts} />
        <Sidebar  />
      </section>
      <Pagenation
        pages={pages}
        curentPage={curentPage}
        setCurentPage={setCurentPage}
      />
    </>
  );
};

export default Posts;
