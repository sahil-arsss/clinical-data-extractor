import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-700">
          Clinical Data Extractor
        </h1>

        <div className="flex gap-4 text-sm font-medium">
          <Link to="/" className="text-slate-700 hover:text-blue-700">
            Dashboard
          </Link>
          <Link to="/timeline" className="text-slate-700 hover:text-blue-700">
            Timeline
          </Link>
          <Link to="/search" className="text-slate-700 hover:text-blue-700">
            Search
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;