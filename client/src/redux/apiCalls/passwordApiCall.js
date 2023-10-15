import request from "../../utils/request";
import { passwordActions } from "../slices/passwordSlice";
import { toast } from "react-toastify";

export function forgotPassword(email) {
  return async () => {
    try {
      const { data } = await request.post("/password/reset-password-link", {
        email,
      });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

export function getResetPassword(userId, token) {
  return async (dispatch) => {
    try {
      await request.get(`/password/reset-password/${userId}/${token}`);
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(passwordActions.setError());
    }
  };
}
export function resetPassword(newPassword, user) {
  return async () => {
    try {
      const { data } = await request.post(
        `/password/reset-password/${user.userId}/${user.token}`,
        {
          password: newPassword,
        }
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
