
import React from 'react';
import { MapPin, Clock } from 'lucide-react';

interface IssueMetadataProps {
  location: string;
  city: string;
  createdAt: string;
}

const IssueMetadata: React.FC<IssueMetadataProps> = ({ location, city, createdAt }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex items-center text-[10px] text-muted-foreground mb-1">
      <MapPin size={10} className="mr-0.5" />
      <span className="truncate mr-2">
        {location || city}
      </span>
      <Clock size={10} className="mr-0.5" />
      <span>{formatDate(createdAt)}</span>
    </div>
  );
};

export default IssueMetadata;
