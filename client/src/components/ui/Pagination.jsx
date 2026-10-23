import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-lg border border-border hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
        let pageNum;
        if (pages <= 7) pageNum = i + 1;
        else if (i === 0) pageNum = 1;
        else if (i === 6) pageNum = pages;
        else pageNum = Math.max(2, Math.min(page - 2 + i, pages - 1));
        return (
          <button
            key={i}
            onClick={() => onPageChange(pageNum)}
            className={`w-9 h-9 rounded-lg text-sm font-medium ${page === pageNum ? 'bg-primary text-white' : 'border border-border hover:bg-surface text-text-secondary'}`}
          >
            {pageNum}
          </button>
        );
      })}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        className="p-2 rounded-lg border border-border hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
export default Pagination;
