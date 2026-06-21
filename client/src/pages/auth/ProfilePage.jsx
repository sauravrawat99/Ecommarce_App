import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, logoutUser } from "../../redux/slices/authSlice";
import { Navigate } from "react-router-dom";
import Button from "../../components/ui/Button";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const handleLogout = () => {
    dispatch(logoutUser());
    Navigate("/login");
  };
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-sm p-10 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-8">My Profile</h1>

        {user && (
          <div className="space-y-3">
            <p>
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            {user.role && (
              <p>
                <span className="font-semibold">Role:</span> {user.role}
              </p>
            )}
            <Button
              onClick={handleLogout}
              children={"Logout"}
              className="w-full"
            ></Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
