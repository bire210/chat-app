import  { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../../reusableComponents/Input";
import Button from "../../reusableComponents/Button";
import { AxiosInstance } from "../../api/apiInstance";
import Cookies from "js-cookie";
import { useChatContext } from "../../context/ChatProviderContext";

const Login = () => {
  const [apiError, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();
  const { setLoginUser } = useChatContext();
  const navigate = useNavigate();
  const create = async (data) => {
    try {
      setLoading(true);
      const response = await AxiosInstance.post("/user/login", data);
      setLoading(false);
      toast.success("Login success", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      Cookies.set("token", response.data.data.token);
      Cookies.set("user", JSON.stringify(response.data.data.user));
      setLoginUser(response.data.data.user);
      navigate("/");
    } catch (error) {
      setError(error.response.data.error);
      toast.warning(`${apiError}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setLoading(false);
     
    }
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full h-16  flex items-center justify-center rounded-xl bg-slate-600  font-bold text-2xl text-slate-200 ">
        Talk Here
      </div>
      <ToastContainer />
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 mt-8 border border-black/10`}
      >
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign In
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Yet do not have an account?&nbsp;
          <Link
            to="/sign-up"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Do Sign Up
          </Link>
        </p>
        {apiError && (
          <p className="text-red-600 mt-8 text-center">{apiError}</p>
        )}

        <form onSubmit={handleSubmit(create)}>
          <div className="space-y-5">
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
