import request from "../../utils/request";
import { profileActions } from "../slices/profileSlice";
import { authActions } from "../slices/authSlice";
import { toast } from "react-toastify";

export function getUserProfile(userId) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/users/profile/${userId}`);
      dispatch(profileActions.setProfile(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
export function uploadProfilePhoto(newPhoto) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.post(`/users/uploadphoto`, newPhoto, {
        headers: {
          auth: "Bearer " + getState().auth.user.data.token,
          "Content-Type": `multipart/form-data`,
        },
      });
      dispatch(profileActions.setProfilePhoto(data.data));
      dispatch(authActions.setUserPhoto(data.data));
      toast.success(data.message);

      const user = JSON.parse(localStorage.getItem("userInfo"));
      user.data.profilePhoto = data?.data;
      localStorage.setItem("userInfo", JSON.stringify(user));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
export function updateProfile(userId, updatedUser) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(
        `/users/update/${userId}`,
        updatedUser,
        {
          headers: {
            auth: "Bearer " + getState().auth.user.data.token,
          },
        }
      );
      dispatch(profileActions.updateProfile(data.data));
      dispatch(authActions.setUserName(data.data.userName));

      const user = JSON.parse(localStorage.getItem("userInfo"));
      user.data.userName = data?.data?.userName;
      localStorage.setItem("userInfo", JSON.stringify(user));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

export function deleteProfile(userId) {
  return async (dispatch, getState) => {
    try {
      dispatch(profileActions.setLoading());
      const { data } = await request.delete(`/users/deleteuser/${userId}`, {
        headers: {
          auth: "Bearer " + getState().auth.user.data.token,
        },
      });
      dispatch(profileActions.setIsProfileDeleted());
      toast.success(data.message);
      setTimeout(() => dispatch(profileActions.clearIsProfileDeleted()), 2000);
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(profileActions.clearLoading());
    }
  };
}

export function getUsersCount() {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(`/users/count`, {
        headers: {
          auth: "Bearer " + getState().auth.user.data.token,
        },
      });
      dispatch(profileActions.setUsersCount(data.data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
export function getAllUsersProfile() {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(`/users/getallusers`, {
        headers: {
          auth: "Bearer " + getState().auth.user.data.token,
        },
      });
      dispatch(profileActions.setProfiles(data.data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
