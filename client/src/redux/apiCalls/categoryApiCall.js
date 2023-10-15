import request from "../../utils/request";
import { categoryActions } from "../slices/categorySlice";
import { toast } from "react-toastify";

export function fetchCategories() {
  return async (dispatch) => {
    try {
      const { data } = await request.get("/category");
      dispatch(categoryActions.setCategories(data.data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
export function createCategory(newCategory) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.post("/category", newCategory, {
        headers: {
          auth: "Bearer " + getState().auth.user.data.token,
        },
      });
      dispatch(categoryActions.addCategory(data.data));
      toast.success("Category Created Successfully ");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
export function deleteCategory(categoryId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.delete(`/category/${categoryId}`, {
        headers: {
          auth: "Bearer " + getState().auth.user.data.token,
        },
      });
      dispatch(categoryActions.deleteCategory(data.data));
      toast.success("Category Deleted Successfully ");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
