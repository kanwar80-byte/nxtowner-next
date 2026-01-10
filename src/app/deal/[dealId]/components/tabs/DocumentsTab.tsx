"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, File, Download, Trash2, Calendar } from "lucide-react";
import type { DealDocument, DocType } from "@/types/deal";
// Date formatting helper
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

interface DocumentsTabProps {
  dealId: string;
  documents: DealDocument[];
}

const DOC_TYPE_LABELS: Record<DocType, string> = {
  financial: "Financial",
  legal: "Legal",
  operational: "Operational",
  other: "Other",
};

const DOC_TYPE_COLORS: Record<DocType, string> = {
  financial: "bg-green-500/10 text-green-400 border-green-500/20",
  legal: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  operational: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  other: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function DocumentsTab({ dealId, documents }: DocumentsTabProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // TODO: Implement actual upload when repo function is wired
      // const formData = new FormData();
      // formData.append('file', file);
      // formData.append('dealId', dealId);
      // formData.append('docType', 'other'); // Default, can be made selectable
      //
      // const response = await fetch('/api/deal/documents/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Upload failed');
      // }
      //
      // // Refresh documents list
      // window.location.reload();
      
      alert("Document upload will be implemented when database tables are ready.");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (document: DealDocument) => {
    // TODO: Implement actual download when repo function is wired
    alert("Document download will be implemented when storage is configured.");
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      // TODO: Implement actual delete when repo function is wired
      // const response = await fetch(`/api/deal/documents/${documentId}`, {
      //   method: 'DELETE',
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Delete failed');
      // }
      //
      // // Refresh documents list
      // window.location.reload();
      
      alert("Document deletion will be implemented when database tables are ready.");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete document. Please try again.");
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Header with upload button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Documents</h2>
          <p className="text-sm text-slate-400 mt-1">
            Upload and manage deal-related documents
          </p>
        </div>
        <div className="relative">
          <input
            type="file"
            id="document-upload"
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
          />
          <Button
            onClick={() => document.getElementById("document-upload")?.click()}
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </div>

      {/* Documents list */}
      {documents.length === 0 ? (
        <div className="text-center py-12 border border-slate-800 rounded-lg bg-slate-900/20">
          <File className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-2">No documents uploaded yet</p>
          <p className="text-sm text-slate-500">
            Upload financial, legal, or operational documents to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border border-slate-800 rounded-lg bg-slate-900/20 hover:bg-slate-900/40 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 shrink-0">
                  <File className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-white truncate">{doc.file_name}</h3>
                    <Badge
                      variant="outline"
                      className={DOC_TYPE_COLORS[doc.doc_type] || DOC_TYPE_COLORS.other}
                    >
                      {DOC_TYPE_LABELS[doc.doc_type] || "Other"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(doc.created_at)}
                    </span>
                    {doc.file_size && <span>{formatFileSize(doc.file_size)}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(doc)}
                  className="text-slate-400 hover:text-blue-400"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(doc.id)}
                  className="text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
