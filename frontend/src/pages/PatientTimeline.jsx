import { useState } from "react";
import API from "../api/api";
import TimelineCard from "../components/TimelineCard";

function PatientTimeline() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchTimeline = async (e) => {
    e.preventDefault();

    if (!patientId.trim()) {
      setMessage("Please enter patient ID.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setPatient(null);
      setTimeline([]);

      const res = await API.get(`/patient/${patientId}/timeline`);

      setPatient(res.data.patient);
      setTimeline(res.data.timeline || []);

      if (!res.data.timeline || res.data.timeline.length === 0) {
        setMessage("No medical records found for this patient.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to fetch timeline"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-xl shadow-sm p-5">
        <h1 className="text-xl font-bold text-slate-800">
          Patient Medical Timeline
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Enter a patient ID to view all extracted medical records in chronological order.
        </p>

        <form onSubmit={fetchTimeline} className="mt-4 flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Enter patient MongoDB ID"
            className="flex-1 border rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? "Loading..." : "Get Timeline"}
          </button>
        </form>

        {message && (
          <p className="mt-3 text-sm text-slate-600">
            {message}
          </p>
        )}
      </div>

      {patient && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h2 className="font-semibold text-blue-900">Patient Details</h2>

          <div className="grid md:grid-cols-4 gap-3 mt-2 text-sm text-blue-900">
            <p>
              <span className="font-medium">Name:</span> {patient.name}
            </p>
            <p>
              <span className="font-medium">Age:</span> {patient.age}
            </p>
            <p>
              <span className="font-medium">Gender:</span> {patient.gender}
            </p>
            <p>
              <span className="font-medium">Records:</span> {timeline.length}
            </p>
          </div>
        </div>
      )}

      <div className="relative border-l-2 border-blue-200 pl-6 space-y-5">
        {timeline.map((record) => (
          <TimelineCard key={record.recordId} record={record} />
        ))}
      </div>
    </div>
  );
}

export default PatientTimeline;