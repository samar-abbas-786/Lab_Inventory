import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiBox, FiCheckCircle, FiLoader } from "react-icons/fi";
import Navbar from "./navbar";

const RequestItem = () => {
  const [items, setItems] = useState([]);
  const [requestedItemId, setRequestedItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestingItem, setRequestingItem] = useState(null);
  const [updateDialog, setUpdateDialog] = useState(null); // { id, name, availableQuantity }
  const [newQuantity, setNewQuantity] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?._id;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/items")
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleRequest = async (itemId) => {
    try {
      setRequestingItem(itemId);
      const res = await axios.post("http://localhost:5000/api/request", {
        studentId,
        itemId,
      });
      setRequestedItemId(itemId);
      alert(
        `Request ${
          res.data.status === "out of stock" ? "Not Available" : "queued"
        }!`
      );
    } catch (error) {
      console.error(error);
      alert("Failed to request item");
    } finally {
      setRequestingItem(null);
    }
  };

  const handleUpdateQuantity = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/items/update/${updateDialog.id}`,
        {
          availableQuantity: parseInt(newQuantity),
        }
      );
      alert("Item quantity updated!");
      setUpdateDialog(null);
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Failed to update item");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800 tracking-tight">
          🧪 Lab Inventory Items
        </h1>

        {loading ? (
          <div className="text-center text-gray-500">
            <FiLoader className="animate-spin mx-auto text-4xl" />
            <p className="mt-2">Loading items...</p>
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No lab items are available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => {
              const isOutOfStock = item.availableQuantity === 0;
              const isRequested = requestedItemId === item._id;
              const isRequesting = requestingItem === item._id;

              return (
                <div
                  key={item._id}
                  className="bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-md hover:shadow-2xl transition duration-300 ease-in-out rounded-3xl p-6 border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gray-200 p-2 rounded-xl">
                      <FiBox className="text-2xl text-gray-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {item.name}
                    </h2>
                  </div>
                  <div className="mb-4">
                    <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full border border-gray-300">
                      Available: <strong>{item.availableQuantity}</strong>
                    </span>
                  </div>

                  {isAdmin ? (
                    <button
                      onClick={() =>
                        setUpdateDialog({
                          id: item._id,
                          name: item.name,
                          availableQuantity: item.availableQuantity,
                        })
                      }
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-semibold"
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRequest(item._id)}
                      disabled={isOutOfStock || isRequested || isRequesting}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200
                    ${
                      isOutOfStock
                        ? "bg-red-100 text-red-700 cursor-not-allowed"
                        : isRequested
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : isRequesting
                        ? "bg-gray-300 text-white cursor-wait"
                        : "bg-gray-700 hover:bg-gray-800 text-white"
                    }`}
                    >
                      {isOutOfStock ? (
                        "Reserved"
                      ) : isRequested ? (
                        <>
                          <FiCheckCircle />
                          Requested
                        </>
                      ) : isRequesting ? (
                        <>
                          <FiLoader className="animate-spin" />
                          Requesting...
                        </>
                      ) : (
                        "Request Item"
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {updateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Update Quantity: {updateDialog.name}
            </h2>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              placeholder="Enter new available quantity"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setUpdateDialog(null)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateQuantity}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestItem;
