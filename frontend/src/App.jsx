import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import PatientTimeline from "./pages/PatientTimeline";
import SearchRecords from "./pages/SearchRecords";

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/timeline" element={<PatientTimeline />} />
          <Route path="/search" element={<SearchRecords />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;