"use client";

export default function CmsTable({
  columns,
  data,
  renderActions,
  editingId,
  renderEditRow,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
            <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-6 py-10 text-center text-gray-400 italic"
              >
                No items found.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {editingId === row.id && renderEditRow ? (
                  renderEditRow(row)
                ) : (
                  <>
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4">
                        {col.render ? (
                          col.render(row)
                        ) : (
                          <span className="text-gray-800 font-medium">
                            {row[col.key]}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      {renderActions && renderActions(row)}
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
