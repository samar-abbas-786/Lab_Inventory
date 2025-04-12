import React, { useEffect, useState } from "react";
import Navbar from "./navbar";

const StudentRequests = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchRequests = () => {
    setLoading(true);
    fetch(`http://localhost:5000/api/students/requests?studentId=${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched items:", data);
        setItems(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching student requests:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  const filteredItems =
    filter === "all" ? items : items.filter((item) => item.status === filter);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          My Requested Items
        </h1>

        {/* Filter and Refresh */}
        <div className="flex flex-wrap gap-4 justify-center items-center mb-6">
          {["all", "pending", "out of stock", "issued"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded font-medium transition ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <button
            onClick={fetchRequests}
            className="px-4 py-2 rounded font-medium bg-green-600 text-white hover:bg-green-700"
          >
            Refresh
          </button>
        </div>

        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-500">
            No requests found for this filter.
          </p>
        ) : (
          <table className="min-w-full table-auto border mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Item Name</th>
                <th className="border px-4 py-2">Request At</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, idx) => (
                <tr className="text-center" key={idx}>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">
                    {item.requestedAt
                      ? new Date(item.requestedAt).toLocaleString()
                      : "No description"}
                  </td>
                  <td
                    className={`border px-4 py-2 font-medium ${
                      item.status === "issued"
                        ? "text-green-600"
                        : item.status === "reserved"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default StudentRequests;
