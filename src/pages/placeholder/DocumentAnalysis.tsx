import React from 'react';
import { FileSearch } from 'lucide-react';

const DocumentAnalysis = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <FileSearch className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Document Analysis Agent</h1>
        <p className="text-lg text-muted-foreground max-w-md mb-8">
          This feature is coming soon. The Document Analysis Agent will help you extract and analyze information from various document types.
        </p>
        <div className="p-4 bg-muted rounded-md">
          <p className="text-sm">
            This is a placeholder page. In the full implementation, this agent would provide document analysis capabilities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalysis;