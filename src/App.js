import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000"; // backend URL
  const [form, setForm] = useState({
    employeeName: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [msg, setMsg] = useState("");
  const [leaves, setLeaves] = useState([]);

  // Fetch all leaves
  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${API}/api/leaves`);
      setLeaves(res.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit (Add leave)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/leaves`, form);
      setMsg(`✅ Leave created: ${res.data._id}`);
      setForm({
        employeeName: "",
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
      fetchLeaves();
    } catch (error) {
      setMsg("❌ Error creating leave request!");
      console.error(error);
    }
  };

  // Handle Approve / Reject
  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${API}/api/leaves/${id}`, { status });
      setMsg(`✅ Leave ${status} successfully!`);
      fetchLeaves();
    } catch (error) {
      setMsg("❌ Error updating leave status!");
      console.error(error);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/leaves/${id}`);
      setMsg("🗑 Leave deleted successfully!");
      fetchLeaves();
    } catch (error) {
      setMsg("❌ Error deleting leave!");
      console.error(error);
    }
  };

  return (
    <div style={{ margin: "30px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "darkgreen" }}>Leave Manager</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          name="employeeName"
          value={form.employeeName}
          onChange={handleChange}
          placeholder="Employee Name"
          required
        />
        <input
          type="text"
          name="leaveType"
          value={form.leaveType}
          onChange={handleChange}
          placeholder="Leave Type"
          required
        />
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          required
        />
        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="Reason"
          required
        ></textarea>
        <button
          type="submit"
          style={{
            background: "darkgreen",
            color: "white",
            border: "none",
            padding: "8px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>

      {/* Message */}
      {msg && (
        <div
          style={{
            marginBottom: "15px",
            fontWeight: "bold",
            color: msg.includes("❌") ? "red" : "green",
          }}
        >
          {msg}
        </div>
      )}

      {/* Leave List */}
      <h3>All Leave Requests</h3>
      {leaves.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {leaves.map((leave) => (
            <li
              key={leave._id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <strong>{leave.employeeName}</strong> - {leave.leaveType}
              <br />
              From: {new Date(leave.startDate).toLocaleDateString()} To:{" "}
              {new Date(leave.endDate).toLocaleDateString()}
              <br />
              Reason: {leave.reason}
              <br />
              Status:{" "}
              <span
                style={{
                  color:
                    leave.status === "Approved"
                      ? "green"
                      : leave.status === "Rejected"
                      ? "red"
                      : "orange",
                  fontWeight: "bold",
                }}
              >
                {leave.status}
              </span>
              <br />
              {/* Action buttons */}
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => handleStatusUpdate(leave._id, "Approved")}
                  style={{
                    background: "green",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    marginRight: "5px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(leave._id, "Rejected")}
                  style={{
                    background: "orange",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    marginRight: "5px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDelete(leave._id)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;