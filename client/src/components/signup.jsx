import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const API_URL = "http://localhost:5000/api";

const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleForm = async () => {
    try {
      const user = await axios.post(`${API_URL}/users/createUser`, {
        name,
        email,
        password,
        role,
      });
      console.log("user", user);
      localStorage.setItem("user", JSON.stringify(user.data.user));
      navigate("/request-item");
      toast.success("User created successfully!");
    } catch (error) {
      toast.error("User creation failed!");
    }
  };

  return (
    <>
      <div className="flex items-center pt-16 justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-cyan-100">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl border border-gray-200"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Create an Account
          </h2>
          <div className="mt-6">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 mt-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 mt-3 border rounded-md border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleForm}
              className="w-full mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SignUp;
