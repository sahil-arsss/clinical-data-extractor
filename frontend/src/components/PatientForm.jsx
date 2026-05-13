import { useState } from "react";
import API from "../api/api";

function PatientForm({ onPatientCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/patient", formData);

      setMessage("Patient created successfully");

      if (onPatientCreated) {
        onPatientCreated(res.data);
      }

      setFormData({
        name: "",
        age: "",
        gender: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      <h2 className="text-lg font-semibold mb-4">Create Patient</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Patient name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          required
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          required
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white rounded-lg py-2 hover:bg-blue-800 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Patient"}
        </button>
      </form>

      {message && (
        <p className="mt-3 text-sm text-slate-600">
          {message}
        </p>
      )}
    </div>
  );
}

export default PatientForm;