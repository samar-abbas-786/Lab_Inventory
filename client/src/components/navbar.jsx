import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/request-item"
          className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text"
        >
          AMU LAB
        </Link>

        <ul className="flex gap-6 items-center text-gray-700 font-medium">
          {role === "admin" && (
            <>
              <Link to="/add-items" className="hover:text-blue-500">
                Add Items
              </Link>
              <Link to="/approve-item" className="hover:text-blue-500">
                Student Requests
              </Link>
            </>
          )}

          {role === "student" && (
            <>
              <Link to="/student-request" className="hover:text-blue-500">
                My Requests
              </Link>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="hover:text-blue-500">
                Login
              </Link>
              <Link to="/signup" className="hover:text-blue-500">
                Sign Up
              </Link>
            </>
          )}

          {user && (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaUserCircle className="text-lg" />
                {user.name}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
              >
                Logout
              </button>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
