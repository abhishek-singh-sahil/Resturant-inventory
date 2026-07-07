import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { login } from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await login(formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
      window.location.reload();
    } catch (error) {
      alert(
        error.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FBF8] px-4">
      <div className="w-full max-w-md rounded-3xl bg-[#FDFCFA] p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#012A36]">
            Restaurant Inventory
          </h1>

          <p className="mt-2 text-[#747293]">
            Login to continue
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F313B]">
              Email
            </label>

            <div className="relative">
              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#747293]"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-2xl border border-[#c7c7d4] bg-white pl-12 pr-4 outline-none focus:border-[#012A36]"
                placeholder="Enter Email"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5F313B]">
              Password
            </label>

            <div className="relative">
              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#747293]"
              />

              <input
                type={
                  showPassword ? "text" : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-2xl border border-[#c7c7d4] bg-white pl-12 pr-12 outline-none focus:border-[#012A36]"
                placeholder="Enter Password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747293]"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-[#012A36] font-semibold text-white transition hover:bg-[#5F313B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;