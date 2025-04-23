
import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Document {
  id?: string;
  name: string;
  url: string;
  type?: string;
}

interface DocumentsTabProps {
  documents?: Document[];
  issueId?: string;
  isMember?: boolean;
  user?: any;
  onDocumentAdded?: (doc: Document) => void;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents, issueId, isMember, user, onDocumentAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocUrl, setNewDocUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const canAdd = Boolean(isMember && user && issueId);

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocUrl.trim() || !issueId) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('issue_documents')
        .insert({
          issue_id: parseInt(issueId),
          name: newDocName,
          url: newDocUrl,
        })
        .select('*')
        .single();

      if (error) throw error;

      toast({
        title: 'Document added!',
        description: "Your document was successfully added to this issue.",
      });

      setShowForm(false);
      setNewDocName('');
      setNewDocUrl('');
      if (onDocumentAdded && data) {
        onDocumentAdded(data);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Could not add document link, please try again.',
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4 text-amber-700 dark:text-amber-300 flex items-center gap-2">
        Related Documents
        {canAdd && (
          <Button variant="ghost" size="icon" onClick={() => setShowForm(v => !v)}>
            <Plus size={18} />
            <span className="sr-only">Add document</span>
          </Button>
        )}
      </h3>

      {showForm && canAdd && (
        <form 
          onSubmit={handleAddDocument} 
          className="mb-4 flex flex-col sm:flex-row gap-2 items-stretch sm:items-end"
        >
          <Input
            placeholder="Document name"
            value={newDocName}
            onChange={e => setNewDocName(e.target.value)}
            className="sm:w-1/3"
            required
            maxLength={80}
            disabled={isSubmitting}
          />
          <Input
            placeholder="Document URL"
            type="url"
            value={newDocUrl}
            onChange={e => setNewDocUrl(e.target.value)}
            required
            className="flex-1"
            maxLength={300}
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setShowForm(false)} disabled={isSubmitting}>Cancel</Button>
        </form>
      )}

      {documents && documents.length > 0 ? (
        <div className="space-y-2">
          {documents.map((doc, index) => (
            <div key={doc.id || index} className="flex items-center gap-2 p-2 rounded-md hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors">
              <FileText className="text-amber-600 dark:text-amber-400" size={24} />
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-200 underline">
                {doc.name}
              </a>
              {doc.type && <span className="ml-2 text-xs text-muted-foreground">({doc.type})</span>}
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
