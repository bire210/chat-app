/* eslint-disable react/prop-types */
import React, { useId, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", ...props },
  ref
) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  // Determine the input type (either "text" or "password")
  const inputType = type === "password" && !showPassword ? "password" : "text";

  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-1 pl-1" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          type={inputType}
          className={`px-3 py-2 pr-10 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
          ref={ref}
          {...props}
          id={id}
        />
        {type === "password" && (
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>
    </div>
  );
});

export default Input;
