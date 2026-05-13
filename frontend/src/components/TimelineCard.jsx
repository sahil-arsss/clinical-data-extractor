function DataList({ title, items }) {
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

function TimelineCard({ record }) {
  return (
    <div className="relative bg-white border rounded-xl shadow-sm p-5">
      <div className="absolute -left-3 top-6 w-5 h-5 bg-blue-700 rounded-full border-4 border-white"></div>

      <div className="mb-4">
        <h3 className="font-semibold text-slate-800">
          Medical Record
        </h3>

        <p className="text-sm text-slate-500">
          {new Date(record.date).toLocaleString()}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <DataList title="Diseases" items={record.diseases} />
        <DataList title="Medicines" items={record.medicines} />
        <DataList title="Dosage" items={record.dosage} />
        <DataList title="Frequency" items={record.frequency} />
        <DataList title="Duration" items={record.duration} />
      </div>

      <div className="mt-4">
        <p className="font-medium text-slate-700">Drug Alerts</p>

        {record.drugAlerts && record.drugAlerts.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {record.drugAlerts.map((alert, index) => (
              <li
                key={index}
                className="bg-red-50 text-red-700 border border-red-100 px-3 py-2 rounded-lg text-sm"
              >
                {alert}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-400 mt-1">No alerts</p>
        )}
      </div>
    </div>
  );
}

export default TimelineCard;