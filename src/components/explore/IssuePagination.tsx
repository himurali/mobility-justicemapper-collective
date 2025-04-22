
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface IssuePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  totalItems: number;
  visibleItems: number;
}

const IssuePagination: React.FC<IssuePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  visibleItems,
}) => {
  return (
    <div className="border-t p-4">
      <div className="flex items-center justify-between px-4 py-2 border-b mb-4">
        <span className="text-sm text-muted-foreground">
          Showing {visibleItems} of {totalItems} issues
        </span>
        <select
          className="text-sm border rounded p-1"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={30}>30 per page</option>
        </select>
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }).map((_, index) => (
            <PaginationItem key={index + 1}>
              <PaginationLink
                onClick={() => onPageChange(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default IssuePagination;
