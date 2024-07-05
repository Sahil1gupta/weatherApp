import React, { useState } from 'react';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';

const registrationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().min(1, { message: "Name is required" }),
  contact: z.string().min(10, { message: "Contact number must be at least 10 digits" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Registration() {
  const [input, setInput] = useState({
    email: "",
    name: "",
    contact: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [customError, setCustomError] = useState(""); // New state for custom error message
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    setCustomError(""); // Clear custom error
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = registrationSchema.safeParse(input);

    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors(formattedErrors);
    } else {
      fetch(`http://localhost:3000/users?email=${input.email}`, {
        method: 'GET',
      })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCustomError("User already exists. Please try to register with a different email.");
        } else {
          fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...input, tasks: [] }),
          })
          .then(response => response.json())
          .then(() => {
            navigate("/login");
          })
          .catch(error => {
            console.error('Error:', error);
          });
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
      <form className="bg-white p-14 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h1 className='text-[rgb(246,164,31)] text-center font-medium text-4xl mb-5'>Registration</h1>
        {customError && (
          <div className="mb-5 text-red-500">
            {customError}
          </div>
        )}
        <div className="mb-5 w-full">
          <input
            name="email"
            value={input.email}
            onChange={handleInputChange}
            type="email"
            placeholder="Email"
            className={`border w-full border-gray-400 p-2 rounded-md ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-500">{errors.email._errors[0]}</p>}
        </div>
        <div className="mb-5">
          <input
            name="name"
            value={input.name}
            onChange={handleInputChange}
            type="text"
            placeholder="Name"
            className={`border w-full border-gray-400 p-2 rounded-md ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-red-500">{errors.name._errors[0]}</p>}
        </div>
        <div className="mb-5">
          <input
            name="contact"
            value={input.contact}
            onChange={handleInputChange}
            type="number"
            placeholder="Contact"
            className={`border w-full border-gray-400 p-2 rounded-md ${errors.contact ? 'border-red-500' : ''}`}
          />
          {errors.contact && <p className="text-red-500">{errors.contact._errors[0]}</p>}
        </div>
        <div className="mb-5">
          <input
            name="password"
            value={input.password}
            onChange={handleInputChange}
            type="password"
            placeholder="Password"
            className={`border w-full border-gray-400 p-2 rounded-md ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && <p className="text-red-500">{errors.password._errors[0]}</p>}
        </div>
        <div className="mb-5">
          <input
            name="confirmPassword"
            value={input.confirmPassword}
            onChange={handleInputChange}
            type="password"
            placeholder="Confirm your password"
            className={`border w-full border-gray-400 p-2 rounded-md ${errors.confirmPassword ? 'border-red-500' : ''}`}
          />
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword._errors[0]}</p>}
        </div>
        <button type="submit" className="w-full bg-[rgb(246,164,31)] text-white p-2 rounded-md mb-5">Register</button>
        <span className="text-center italic">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
}
