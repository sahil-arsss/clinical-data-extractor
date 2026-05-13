import { useState } from "react";
import API from "../api/api";

function TagList({ title, items }) {
  return (
    <div>
      <p className="font-medium text-slate-700">{title}</p>

      {items && items.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-1">
          {items.map((item, index) => (
            <span
              key={index}
              className="text-xs bg-slate-100 border px-2 py-1 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400 mt-1">No data</p>
      )}
    </div>
  );
}

function SearchRecords() {
  const [searchType, setSearchType] = useState("medicine");
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setMessage("Please enter a search value.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setRecords([]);

      const res = await API.get(`/search?${searchType}=${query}`);

      setRecords(res.data || []);

      if (!res.data || res.data.length === 0) {
        setMessage("No records found.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Search failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-xl shadow-sm p-5">
        <h1 className="text-xl font-bold text-slate-800">
          Search Medical Records
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Search extracted records by medicine or disease.
        </p>

        <form onSubmit={handleSearch} className="mt-4 grid md:grid-cols-4 gap-3">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="medicine">Medicine</option>
            <option value="disease">Disease</option>
          </select>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchType === "medicine"
                ? "Example: paracetamol"
                : "Example: diabetes"
            }
            className="md:col-span-2 border rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 text-white rounded-lg px-5 py-2 hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {message && (
          <p className="mt-3 text-sm text-slate-600">
            {message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <div
            key={record._id}
            className="bg-white border rounded-xl shadow-sm p-5 space-y-4"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <div>
                <h2 className="font-semibold text-slate-800">
                  Medical Record
                </h2>

                <p className="text-sm text-slate-500">
                  {new Date(record.createdAt).toLocaleString()}
                </p>
              </div>

              {record.patientId && (
                <div className="text-sm bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                  <p>
                    <span className="font-medium">Patient:</span>{" "}
                    {record.patientId.name || record.patientId}
                  </p>

                  {record.patientId.age && (
                    <p>
                      <span className="font-medium">Age:</span>{" "}
                      {record.patientId.age}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <TagList
                title="Diseases"
                items={record.structuredData?.diseases}
              />

              <TagList
                title="Medicines"
                items={record.structuredData?.medicines}
              />

              <TagList
                title="Dosage"
                items={record.structuredData?.dosage}
              />

              <TagList
                title="Frequency"
                items={record.structuredData?.frequency}
              />

              <TagList
                title="Duration"
                items={record.structuredData?.duration}
              />
            </div>

            <div>
              <p className="font-medium text-slate-700">Drug Alerts</p>

              {record.drugAlerts && record.drugAlerts.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {record.drugAlerts.map((alert, index) => (
                    <li
                      key={index}
                      className="bg-red-50 border border-red-100 text-red-700 px-3 py-2 rounded-lg text-sm"
                    >
                      {alert}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 mt-1">No alerts</p>
              )}
            </div>

            <details>
              <summary className="cursor-pointer text-sm font-medium text-blue-700">
                View Raw OCR Text
              </summary>

              <pre className="mt-3 bg-slate-100 border rounded-lg p-3 text-sm whitespace-pre-wrap max-h-60 overflow-auto">
                {record.rawText || "No raw text available"}
              </pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchRecords;