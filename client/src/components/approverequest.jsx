import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./navbar";

const API_URL = "http://localhost:5000/api";

const ApproveRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/requests`);
      setRequests(res.data);
    } catch (error) {
      toast.error("Failed to fetch requests.");
    }
  };

  const issueRequest = async (requestId) => {
    try {
      const res = await axios.post(`${API_URL}/issue/${requestId}`);
      toast.success(res.data.message);
      fetchRequests(); // refresh list
    } catch (error) {
      toast.error("Failed to issue item.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <>
      <Navbar />
      <div className="p-8 max-w-5xl my-auto mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
          ✅ Approve Item Requests
        </h2>

        {requests.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No requests found.
          </p>
        ) : (
          <div className="grid gap-6">
            {requests.map((req) => {
              const { date, time } = formatDateTime(req.requestedAt);
              const statusColor = {
                pending: "bg-yellow-100 text-yellow-800",
                approved: "bg-green-100 text-green-800",
                rejected: "bg-red-100 text-red-800",
              };

              return (
                <div
                  key={req._id}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-xl border border-gray-200 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {req.itemName}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Requested by <strong>{req.studentName}</strong>
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full border ${
                        statusColor[req.status]
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="text-gray-500 text-sm mb-4">
                    <p>
                      <strong>Date:</strong> {date}
                    </p>
                    <p>
                      <strong>Time:</strong> {time}
                    </p>
                  </div>

                  {req.status === "pending" && (
                    <button
                      onClick={() => issueRequest(req._id)}
                      className="mt-2 px-5 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
                    >
                      Approve & Issue
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <ToastContainer />
      </div>
    </>
  );
};

export default ApproveRequests;
