
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
