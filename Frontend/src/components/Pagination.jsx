import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) pages.push(1, 2, 3, 4, "...", totalPages);
      else if (page >= totalPages - 2)
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      else
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-3 mt-10">

      {/* Previous Button */}
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className={`flex items-center gap-1 px-4 py-2 rounded-xl shadow-sm border transition
          ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                       : "bg-white hover:bg-blue-50 text-gray-700"}
        `}
      >
        <ChevronLeft size={18} />
        Prev
      </button>

      {/* Page Numbers */}
      <div className="flex gap-2">
        {pageNumbers.map((num, idx) =>
          num === "..." ? (
            <span key={idx} className="px-3 py-2 text-gray-500">...</span>
          ) : (
            <button
              key={idx}
              onClick={() => setPage(num)}
              className={`px-4 py-2 rounded-xl transition border shadow-sm font-medium
                ${
                  page === num
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white hover:bg-blue-50 text-gray-700"
                }
              `}
            >
              {num}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className={`flex items-center gap-1 px-4 py-2 rounded-xl shadow-sm border transition
          ${page === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                                : "bg-white hover:bg-blue-50 text-gray-700"}
        `}
      >
        Next
        <ChevronRight size={18} />
      </button>

    </div>
  );
};

export default Pagination;
