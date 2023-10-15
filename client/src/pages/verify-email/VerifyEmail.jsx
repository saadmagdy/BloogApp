import "./verify-email.css";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { verifyEmail } from "../../redux/apiCalls/authApiCall";
import { useEffect } from "react";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const { userId, token } = useParams();
  const { isEmailVerified } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(verifyEmail(userId, token));
  }, [dispatch, userId, token]);
  return (
    <section className="verify-email">
      {isEmailVerified ? (
        <>
          <i className="bi bi-patch-check verify-email-icon"></i>
          <h1 className="verify-email-title">
            Your email address has been successfully verified
          </h1>
          <Link to="/login" className="verify-email-link">
            {" "}
            Go to login page
          </Link>
        </>
      ) : (
        <>
          <h1 className="verify-email-not-found">Not found</h1>
        </>
      )}
    </section>
  );
};

export default VerifyEmail;
