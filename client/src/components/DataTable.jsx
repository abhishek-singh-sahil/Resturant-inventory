const DataTable = ({
  columns = [],
  data = [],
  emptyMessage = "No data found.",
}) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e3e3e9] bg-[#FDFCFA] shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#012A36]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold text-white"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-[#e3e3e9] transition hover:bg-[#FAF5EF]"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="whitespace-nowrap px-5 py-4 text-sm text-[#5F313B]"
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center text-[#747293]"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;