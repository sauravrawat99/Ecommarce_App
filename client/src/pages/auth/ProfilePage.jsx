import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, logoutUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { Mail, ShieldCheck } from "lucide-react";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
        <p className="text-sm text-red-500 text-center">{error}</p>
      </div>
    );

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm w-full max-w-md overflow-hidden">
        {/* Gradient banner */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 h-24 sm:h-28 relative">
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-1">
              <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-indigo-600">
                  {initials || "?"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-14 sm:pt-16 pb-6 sm:pb-8 px-6 sm:px-10 text-center">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {user?.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1.5 break-all">
            <Mail size={14} className="shrink-0" />
            {user?.email}
          </p>

          {user?.role && (
            <span className="inline-flex items-center gap-1.5 mt-3 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">
              <ShieldCheck size={13} />
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          )}

          <div className="mt-6 sm:mt-8">
            <Button onClick={handleLogout} variant="danger" className="w-full">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
