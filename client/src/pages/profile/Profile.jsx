import "./profile.css";
import { useEffect, useState } from "react";
import UpdateProfile from "./UpdateProfile";
import swal from "sweetalert";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  deleteProfile,
  getUserProfile,
  uploadProfilePhoto,
} from "../../redux/apiCalls/profileApiCall";
import PostItem from "./../../components/posts/PostItem";
import { Oval } from "react-loader-spinner";
import { logoutUser } from "../../redux/apiCalls/authApiCall";
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading, isProfileDeleted } = useSelector(
    (state) => state.profile
  );
  const { user } = useSelector((state) => state.auth);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [file, setFile] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    dispatch(getUserProfile(id));
    window.scrollTo(0, 0);
  }, [id, dispatch]);

  useEffect(() => {
    if (isProfileDeleted) {
      navigate("/")
    }
  }, [isProfileDeleted,navigate]);

  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (!file) return toast.warning("there is no file!");
    const formData = new FormData();
    formData.append("image", file);

    dispatch(uploadProfilePhoto(formData));
  };

  const deleteAccountHandler = () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover your account!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((isOk) => {
      if (isOk) {
        dispatch(deleteProfile(user?.data?._id));
        dispatch(logoutUser());
      }
    });
  };

  if (loading) {
    return (
      <div className="profile-loader">
        <Oval
          height={120}
          width={120}
          color="#000000"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="gray"
          strokeWidth={3}
          strokeWidthSecondary={3}
        />
      </div>
    );
  }

  return (
    <section className="profile">
      <div className="profile-header">
        <div className="profile-image-wrapper">
          <img
            src={
              file
                ? URL.createObjectURL(file)
                : profile?.data?.profilePhoto?.url
            }
            alt=""
            className="profile-image"
          />
          {user?.data?._id === profile?.data?._id && (
            <form onSubmit={formSubmitHandler}>
              <abbr title="choose profile photo">
                <label
                  htmlFor="file"
                  className="bi bi-camera-fill upload-profile-photo-icon"
                ></label>
              </abbr>
              <input
                type="file"
                name="file"
                id="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button type="submit" className="upload-profile-photo-btn">
                upload
              </button>
            </form>
          )}
        </div>
        <h1 className="profile-username">{profile?.data?.userName}</h1>
        <p className="profile-bio">{profile?.data?.bio}</p>
        <div className="user-date-joined">
          <strong>Date Joined: </strong>
          <span>{new Date(profile?.data?.createdAt).toDateString()}</span>
        </div>
        {user?.data?._id === profile?.data?._id && (
          <button
            onClick={() => setUpdateProfile(true)}
            className="profile-update-btn"
          >
            <i className="bi bi-file-person-fill"></i>
            Update Profile
          </button>
        )}
      </div>
      <div className="profile-posts-list">
        <h2 className="profile-posts-list-title">
          {profile?.data?.userName} Posts
        </h2>
        {profile?.data?.posts?.map((post) => (
          <PostItem
            key={post._id}
            post={post}
            userName={profile?.data?.userName}
            userId={profile?.data?._id}
          />
        ))}
      </div>
      {user?.data?._id === profile?.data?._id && (
        <button onClick={deleteAccountHandler} className="delete-account-btn">
          Delete Your Account
        </button>
      )}
      {updateProfile && (
        <UpdateProfile profile={profile} setUpdateProfile={setUpdateProfile} />
      )}
    </section>
  );
};

export default Profile;
