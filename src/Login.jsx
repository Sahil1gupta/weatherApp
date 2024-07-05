import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../Context/loginStatus';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
  const [input, setInput] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [customError, setCustomError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    setCustomError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3000/users?email=${input.email}`, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(users => {
      if (users.length > 0) {
         console.log(users)
        const user = users[0]; // Assuming the email is unique and only one user should be returned
        console.log(user)
        if (user.password === input.password) {
          login(); // Call the login function from your auth context
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('currentUser', JSON.stringify({ email: input.email }));
          navigate("/home"); // Navigate to the home or any other page after login
        } else {
          setCustomError("Invalid credentials. Please try again.");
        }
      } else {
        setCustomError("User does not exist. Please register.");
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setCustomError("An error occurred. Please try again later.");
    });
  };

  return (
    <div className="flex flex-col justify-center bg-gray-200 items-center h-screen">
      <form className="bg-white flex flex-col justify-center items-center p-10 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h1 className="text-[rgb(246,164,31)] text-center font-medium text-4xl mb-5">Login</h1>
        {customError && <p className="text-red-500 mb-3">{customError}</p>}
        <div className="mb-5 w-full">
          <input
            name="email"
            value={input.email}
            onChange={handleInputChange}
            type="email"
            placeholder="Email"
            className={`border w-full border-gray-400 p-2 ${errors.email ? 'border-red-500' : '' }  rounded-md`}
          />
          {errors.email && <p className="text-red-500">{errors.email._errors[0]}</p>}
        </div>
        <div className="mb-5 w-full">
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
        <button type="submit" className="w-full bg-[rgb(246,164,31)] text-white p-2 mb-5">
          LOGIN
        </button>
        <span className="text-center italic">
          Don't have an account?{" "}
          <Link to="/registration" className="text-blue-600">
            Register
          </Link>
        </span>
      </form>
    </div>
  );
}
