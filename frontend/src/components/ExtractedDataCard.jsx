function ListSection({ title, items }) {
  return (
    <div>
      <h4 className="font-semibold text-slate-800 mb-1">{title}</h4>

      {items && items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={index}
              className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No data found</p>
      )}
    </div>
  );
}

function ExtractedDataCard({ result }) {
  if (!result) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h2 className="text-lg font-semibold mb-2">Extraction Result</h2>
        <p className="text-slate-500 text-sm">
          Upload a document to view extracted medical data.
        </p>
      </div>
    );
  }

  const structuredData = result.structuredData || result.structured_data || {};

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 space-y-5">
      <h2 className="text-lg font-semibold">Extraction Result</h2>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Raw OCR Text</h3>

        <pre className="bg-slate-100 border rounded-lg p-3 text-sm whitespace-pre-wrap max-h-64 overflow-auto">
          {result.raw_text || result.rawText || "No raw text available"}
        </pre>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ListSection title="Diseases" items={structuredData.diseases} />
        <ListSection title="Medicines" items={structuredData.medicines} />
        <ListSection title="Dosage" items={structuredData.dosage} />
        <ListSection title="Frequency" items={structuredData.frequency} />
        <ListSection title="Duration" items={structuredData.duration} />
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Drug Alerts</h3>

        {result.drug_alerts?.length > 0 || result.drugAlerts?.length > 0 ? (
          <ul className="space-y-2">
            {(result.drug_alerts || result.drugAlerts).map((alert, index) => (
              <li
                key={index}
                className="bg-red-50 border border-red-100 text-red-700 px-3 py-2 rounded-lg text-sm"
              >
                {alert}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No drug alerts found</p>
        )}
      </div>
    </div>
  );
}

export default ExtractedDataCard;