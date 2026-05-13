import { useState } from "react";
import API from "../api/api";

function UploadForm({ patientId, onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!patientId) {
      setMessage("Please create or enter a patient ID first.");
      return;
    }

    if (!file) {
      setMessage("Please select a medical document.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", patientId);

    try {
      setLoading(true);
      setMessage("");

      const res = await API.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Document uploaded and processed successfully.");

      if (onUploadComplete) {
        onUploadComplete(res.data.data);
      }

      setFile(null);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      <h2 className="text-lg font-semibold mb-4">Upload Medical Document</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Patient ID
          </label>

          <input
            type="text"
            value={patientId || ""}
            readOnly
            placeholder="Patient ID will appear after creation"
            className="w-full border rounded-lg px-3 py-2 bg-slate-100 text-slate-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Select Image or PDF
          </label>

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.webp"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white rounded-lg py-2 hover:bg-green-800 disabled:opacity-60"
        >
          {loading ? "Processing..." : "Upload & Extract"}
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

export default UploadForm;