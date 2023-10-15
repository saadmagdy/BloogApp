import request from "../../utils/request";
import { postActions } from "../slices/postSlice";
import { toast } from "react-toastify";

export function fetchPosts(pageNumber) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/posts?pageNumber=${pageNumber}`);
      dispatch(postActions.setPosts(data.data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
export function getPostsCount() {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/posts/count`);
      dispatch(postActions.setPostsCount(data.data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

export function fetchPostsByCategory(category) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/posts?category=${category}`);
      dispatch(postActions.setPostsCategory(data.data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

export function createPost(newPost) {
  return async (dispatch, getState) => {
    try {
      dispatch(postActions.setLoading());
      await request.post(`/posts`, newPost, {
        headers: {
          auth: "Bearer " + getState().auth.user.data.token,
          "Content-Type": `multipart/form-data`,
        },
      });
      dispatch(postActions.setIsPostCreated());
      setTimeout(() => {
        dispatch(postActions.clearIsPostCreated());
      }, 2000);
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(postActions.clearLoading());
    }
  };
}

export function fetchSinglePost(postId) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/posts/${postId}`);
      dispatch(postActions.setPost(data.data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
export function toogleLikePost(postId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(
        `/posts/like/${postId}`,
        {},
        {
          headers: {
            auth: "Bearer " + getState().auth.user.data.token,
          },
        }
      );
      dispatch(postActions.setLike(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

export function updatePostImage(newImage, postId) {
  return async (dispatch, getState) => {
    try {
      await request.put(
        `/posts/updatepostimage/${postId}`,
        { newImage },
        {
          headers: {
            auth: "Bearer " + getState().auth.user.data.token,
            "Content-Type": `multipart/form-data`,
          },
        }
      );
      toast.success("new post image updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

export function updatePost(newPost, postId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(
        `/posts/${postId}`,
        { newPost },
        {
          headers: {
            auth: "Bearer " + getState().auth.user.data.token,
          },
        }
      );
      dispatch(postActions.setPost(data));
      toast.success("new post image updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

export function deletePost(postId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.delete(`/posts/${postId}`, {
        headers: {
          auth: "Bearer " + getState().auth.user.data.token,
        },
      });
      dispatch(postActions.deletePost(data.data));
      toast.success("post deleted successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

export function getAllPosts() {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(`/posts`, {
        headers: {
          auth: "Bearer " + getState().auth.user.data.token,
        },
      });
      dispatch(postActions.setPosts(data.data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
