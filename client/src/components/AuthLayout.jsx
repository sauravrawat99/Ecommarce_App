import { Link } from "react-router-dom";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <Link
          to="/"
          className="text-3xl font-bold relative z-10 w-fit"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Shop<span className="text-amber-400">Kart</span>
        </Link>

        <div className="relative z-10">
          <h2
            className="text-4xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {title}
          </h2>
          <p className="text-indigo-100 text-lg max-w-md leading-relaxed">
            {subtitle}
          </p>
        </div>

        <p className="relative z-10 text-indigo-300 text-sm">
          © {new Date().getFullYear()} ShopKart. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:px-6 bg-white">
        <Link
          to="/"
          className="lg:hidden text-2xl font-bold text-gray-900 mb-8"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Shop<span className="text-indigo-600">Kart</span>
        </Link>

        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
