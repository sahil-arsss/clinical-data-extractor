import { useState } from "react";
import PatientForm from "../components/PatientForm";
import UploadForm from "../components/UploadForm";
import ExtractedDataCard from "../components/ExtractedDataCard";

function Dashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [extractionResult, setExtractionResult] = useState(null);

  const handlePatientCreated = (patient) => {
    setSelectedPatient(patient);
    setExtractionResult(null);
  };

  const handleUploadComplete = (result) => {
    setExtractionResult(result);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-700 text-white rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold">
          AI-Powered Clinical Data Extraction System
        </h1>

        <p className="mt-2 text-blue-100">
          Upload prescriptions, lab reports, or discharge summaries and extract
          structured medical data using OCR and NLP.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <PatientForm onPatientCreated={handlePatientCreated} />

        <UploadForm
          patientId={selectedPatient?._id}
          onUploadComplete={handleUploadComplete}
        />
      </div>

      {selectedPatient && (
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <h2 className="font-semibold text-slate-800 mb-2">
            Current Patient
          </h2>

          <div className="grid md:grid-cols-4 gap-3 text-sm">
            <p>
              <span className="font-medium">ID:</span> {selectedPatient._id}
            </p>
            <p>
              <span className="font-medium">Name:</span>{" "}
              {selectedPatient.name}
            </p>
            <p>
              <span className="font-medium">Age:</span> {selectedPatient.age}
            </p>
            <p>
              <span className="font-medium">Gender:</span>{" "}
              {selectedPatient.gender}
            </p>
          </div>
        </div>
      )}

      <ExtractedDataCard result={extractionResult} />
    </div>
  );
}

export default Dashboard;