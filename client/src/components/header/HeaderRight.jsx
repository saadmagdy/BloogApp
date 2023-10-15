import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { logoutUser } from "../../redux/apiCalls/authApiCall";

const HeaderRight = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [dropdown, setDropdown] = useState(false);

  const logoutHandelr = () => {
    setDropdown(false);
    dispatch(logoutUser());
  };
  return (
    <>
      <div className="header-right">
        {user ? (
          <>
            <div className="header-right-user-info">
              <span
                onClick={() => {
                  setDropdown((prev) => !prev);
                }}
                className="header-right-username"
              >
                {user?.data.userName}
              </span>
              <img
                src={user?.data?.profilePhoto.url}
                alt="userPhoto"
                className="header-right-user-photo"
              />
              {dropdown && (
                <div className="header-right-dropdown">
                  <Link
                    to={`/profile/${user?.data._id}`}
                    className="header-dropdown-item"
                    onClick={() => {
                      setDropdown(false);
                    }}
                  >
                    <i className="bi bi-file-person"></i>
                    <span> Profile</span>
                  </Link>
                  <div onClick={logoutHandelr} className="header-dropdown-item">
                    <i className="bi bi-box-arrow-in-left"></i>
                    <span>LogOut</span>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="header-right-link">
              <i className="bi bi-box-arrow-in-right"></i>
              <span>Login</span>
            </Link>
            <Link to="/Register" className="header-right-link">
              <i className="bi bi-person-plus"></i>
              <span>Register</span>
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default HeaderRight;
