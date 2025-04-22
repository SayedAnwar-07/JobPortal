import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== role) {
      navigate("/login");
    }
  }, [user, navigate, role]);

  if (!user || user.role !== role) {
    return null; // Prevents children from rendering until navigation occurs
  }

  return <>{children}</>;
};

export default ProtectedRoute;
