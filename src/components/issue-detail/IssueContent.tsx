
import React from 'react';
import { IssueData } from '@/types';
import VideoPlayer from '../video/VideoPlayer';

interface IssueContentProps {
  issue: IssueData;
}

const IssueContent: React.FC<IssueContentProps> = ({ issue }) => {
  return (
    <div>
      <div className="flex justify-center mb-4">
        <div className="w-3/4 aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden shadow-md">
          <VideoPlayer 
            url={issue.videoUrl || ''}
            title={issue.title}
          />
        </div>
      </div>
      <h3 className="text-lg font-medium mb-2 text-blue-700 dark:text-blue-300">
        Problem Description
      </h3>
      <p className="text-muted-foreground">{issue.description}</p>
    </div>
  );
};

export default IssueContent;
