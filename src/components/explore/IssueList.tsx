
import React from "react";
import { IssueData } from "@/types";
import IssueCard from "@/components/IssueCard";

interface IssueListProps {
  issues: IssueData[];
  selectedIssue: IssueData | null;
  onIssueClick: (issue: IssueData) => void;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
}

const IssueList: React.FC<IssueListProps> = ({
  issues,
  selectedIssue,
  onIssueClick,
  onUpvote,
  onDownvote,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 p-2 flex-1">
      {issues.length > 0 ? (
        issues.map(issue => (
          <div 
            key={issue.id} 
            id={`issue-card-${issue.id}`}
            className="col-span-1"
          >
            <IssueCard
              issue={issue}
              onClick={() => onIssueClick(issue)}
              isSelected={selectedIssue?.id === issue.id}
              onUpvote={onUpvote}
              onDownvote={onDownvote}
            />
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground col-span-2">
          No issues found matching your filters
        </div>
      )}
    </div>
  );
};

export default IssueList;
