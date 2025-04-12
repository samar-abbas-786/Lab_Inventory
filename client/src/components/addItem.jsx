import React, { useState } from "react";
import axios from "axios";
import Navbar from "./navbar";

const AddItem = () => {
  const [name, setName] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !totalQuantity) {
      return setMessage("All fields are required");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/items/add", {
        name,
        totalQuantity,
      });
      setMessage(res.data.message);
      setName("");
      setTotalQuantity("");
    } catch (err) {
      console.error(err);
      setMessage("Error adding item");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">
          Add New Item
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Total Quantity
            </label>
            <input
              type="number"
              min={1}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={totalQuantity}
              onChange={(e) => setTotalQuantity(e.target.value)}
              placeholder="Enter total quantity"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          >
            Add Item
          </button>

          {message && (
            <p className="text-center text-sm mt-2 text-green-600">{message}</p>
          )}
        </form>
      </div>
    </>
  );
};

export default AddItem;
