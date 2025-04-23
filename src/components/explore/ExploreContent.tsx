
import React from "react";
import { IssueData } from "@/types";
import IssueList from "./IssueList";
import IssuePagination from "./IssuePagination";

interface ExploreContentProps {
  paginatedIssues: IssueData[];
  selectedIssue: IssueData | null;
  onIssueClick: (issue: IssueData) => void;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  totalItems: number;
}

const ExploreContent: React.FC<ExploreContentProps> = ({
  paginatedIssues,
  selectedIssue,
  onIssueClick,
  onUpvote,
  onDownvote,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <span className="text-sm text-muted-foreground">
          Showing {paginatedIssues.length} of {totalItems} issues
        </span>
        <select
          className="text-sm border rounded p-1"
          value={itemsPerPage}
          onChange={(e) => {
            onItemsPerPageChange(Number(e.target.value));
          }}
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={30}>30 per page</option>
        </select>
      </div>
      
      <IssueList
        issues={paginatedIssues}
        selectedIssue={selectedIssue}
        onIssueClick={onIssueClick}
        onUpvote={onUpvote}
        onDownvote={onDownvote}
      />
      
      {totalPages > 1 && (
        <IssuePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          totalItems={totalItems}
          visibleItems={paginatedIssues.length}
        />
      )}
    </div>
  );
};

export default ExploreContent;
