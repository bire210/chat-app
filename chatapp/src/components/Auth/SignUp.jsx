import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Input from "../../reusableComponents/Input";
import Button from "../../reusableComponents/Button";
import { uploadImageToCloudinary } from "../../utils/imageHandle";
import { AxiosInstance } from "../../api/apiInstance";

function SignUp() {
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setUploading(true);
        const imageUrl = await uploadImageToCloudinary(file);
        console.log(imageUrl);
        setValue("image", imageUrl);
        toast.success("file Uploaded");
        setUploading(false);
      } catch (error) {
        toast.error(error.message);
        setUploading(false);
      }
    }
  };

  const create = async (data) => {
    // console.log("data  8888888888", data);
    try {
      await AxiosInstance.post("/user/sign-up", data);
      toast.success("Registration is done");
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.error);
      // console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixed at the top */}
      <div className="w-full h-16 flex items-center justify-center rounded-xl bg-slate-600 font-bold text-xl sm:text-2xl text-slate-200">
        Talk Here
      </div>

      {/* Main content container */}
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 min-h-screen pt-1">
        <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-2 sm:p-10 border border-black/10 shadow-lg mt-2">
          <h2 className="text-center text-xl sm:text-2xl font-bold leading-tight">
            Sign up to create account
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-black/60">
            Already have an account?&nbsp;
            <Link
              to="/login"
              className="font-medium text-primary transition-all duration-200 hover:underline"
            >
              Sign In
            </Link>
          </p>

          <form onSubmit={handleSubmit(create)} className="mt-">
            <div className="space-y-3">
              <Input
                label="Full Name: "
                placeholder="Enter your full name"
                {...register("name", {
                  required: true,
                })}
              />
              <Input
                label="Email: "
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                  required: true,
                  validate: {
                    matchPattern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                        value
                      ) || "Email address must be a valid address",
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
              <Input
                label="Select your profile Picture :"
                type="file"
                className="mb-2"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                onChange={handleImageChange}
              />
              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? (
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
                    Uploading...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
