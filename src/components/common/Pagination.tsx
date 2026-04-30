import React from 'react';
import { Icon } from './Icon';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="pagination-bar" role="navigation" aria-label="Pagination">
      <div className="pagination-info">
        <span>
          Showing <strong>{startItem}</strong> - <strong>{endItem}</strong> of{' '}
          <strong>{totalItems}</strong> issues
        </span>
      </div>

      <div className="pagination-controls">
        {onPageSizeChange && (
          <div className="page-size-selector">
            <label htmlFor="page-size-select" className="sr-only">
              Issues per page
            </label>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="select-input page-size-dropdown"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        )}

        <div className="pagination-buttons">
          <button
            type="button"
            className="btn btn-secondary btn-icon pagination-btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <Icon name="arrow-down" size={14} className="rotate-90" />
          </button>

          <span className="pagination-current-page" aria-current="page">
            Page {currentPage} of {Math.max(1, totalPages)}
          </span>

          <button
            type="button"
            className="btn btn-secondary btn-icon pagination-btn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <Icon name="arrow-up" size={14} className="rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
};
