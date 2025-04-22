
import React from 'react';
import { FileText } from 'lucide-react';

interface Document {
  name: string;
}

interface DocumentsTabProps {
  documents?: Document[];
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4 text-amber-700 dark:text-amber-300">Related Documents</h3>
      {documents && documents.length > 0 ? (
        <div className="space-y-2">
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center gap-2 p-2 rounded-md hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors">
              <FileText className="text-amber-600 dark:text-amber-400" size={24} />
              <span>{doc.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No documents available</p>
      )}
    </div>
  );
};

export default DocumentsTab;
