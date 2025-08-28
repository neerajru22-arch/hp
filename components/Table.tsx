
import React from 'react';

// FIX: Export the Column interface to be reusable across page components.
export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  renderActions?: (item: T) => React.ReactNode;
  rowClassName?: (item: T) => string;
}

const Table = <T extends { id: string | number },>(
  { data, columns, renderActions, rowClassName }: TableProps<T>
) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-100">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
            {renderActions && (
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {data.map((item) => (
            <tr key={item.id} className={`transition-colors hover:bg-slate-50 ${rowClassName ? rowClassName(item) : ''}`}>
              {columns.map((col, index) => (
                <td key={index} className={`px-6 py-4 whitespace-nowrap text-sm ${col.className || 'text-slate-700'}`}>
                  {typeof col.accessor === 'function'
                    ? col.accessor(item)
                    : (item[col.accessor] as React.ReactNode)}
                </td>
              ))}
              {renderActions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {renderActions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
       {data.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>No data available.</p>
        </div>
      )}
    </div>
  );
};

export default Table;