import request from "../../utils/request";
import { commentActions } from "../slices/commentSlice";
import { postActions } from "../slices/postSlice";
import { toast } from "react-toastify";

export function createComment(text, postId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.post(`/comments/${postId}`, text, {
        headers: {
          auth: "Bearer " + getState().auth.user.data.token,
        },
      });
      dispatch(postActions.addComment(data.data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
export function updateComment(text, commentId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(`/comments/${commentId}`, text, {
        headers: {
          auth: "Bearer " + getState().auth.user.data.token,
        },
      });
      dispatch(postActions.updateComment(data.data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
export function deleteComment(commentId) {
  return async (dispatch, getState) => {
    try {
      await request.delete(`/comments/${commentId}`, {
        headers: {
          auth: "Bearer " + getState().auth.user.data.token,
        },
      });
      dispatch(commentActions.deleteCommentAdmin(commentId));
      dispatch(postActions.deleteComment(commentId));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
export function getAllComments() {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(`/comments`, {
        headers: {
          auth: "Bearer " + getState().auth.user.data.token,
        },
      });
      dispatch(commentActions.setCommentsAdmin(data.data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
