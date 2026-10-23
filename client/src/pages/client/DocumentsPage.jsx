import { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  FileCheck2,
  AlertCircle,
  File,
  Plus,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Button, Modal, Spinner, EmptyState } from '../../components/ui';
import { formatDate, formatFileSize, getStatusColor } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [associatedCaseId, setAssociatedCaseId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDocumentsAndCases = async () => {
    setLoading(true);
    try {
      const [docsRes, casesRes] = await Promise.all([
        api.get('/documents/my'),
        api.get('/cases/my'),
      ]);
      if (docsRes.data.success) {
        setDocuments(docsRes.data.data.documents || []);
      }
      if (casesRes.data.success) {
        setCases(casesRes.data.data.cases || []);
      }
    } catch (err) {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentsAndCases();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type: PDF, JPG, JPEG, PNG
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      toast.error('Only PDF, JPG, and PNG files are accepted');
      return;
    }
    // Validate size: 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds maximum 10MB limit');
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a valid document file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      if (associatedCaseId) {
        formData.append('caseId', associatedCaseId);
      }

      const { data } = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        toast.success('Document uploaded to secure vault successfully');
        setUploadModalOpen(false);
        setSelectedFile(null);
        setAssociatedCaseId('');
        fetchDocumentsAndCases();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (docId, originalName) => {
    const downloadUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/documents/${docId}/download`;
    window.open(downloadUrl, '_blank');
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);
    try {
      const { data } = await api.delete(`/documents/${deleteConfirmId}`);
      if (data.success) {
        toast.success('Document removed from vault');
        setDeleteConfirmId(null);
        fetchDocumentsAndCases();
      }
    } catch (err) {
      toast.error('Failed to delete document');
    } finally {
      setDeleting(false);
    }
  };

  const filteredDocs = documents.filter((d) =>
    searchQuery
      ? d.originalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.case?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Confidential File Vault
          </span>
          <h1 className="text-2xl font-bold text-text-primary mt-0.5">
            Documents & Filings
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Securely upload, store, and manage confidential court briefs and case evidence
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setUploadModalOpen(true)}
          className="self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" /> Upload Document
        </Button>
      </div>

      {/* Search Bar & Security Note */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by file name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 text-xs py-2"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span>Restricted Access: Authorized Parties Only</span>
        </div>
      </div>

      {/* Document List Table */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <Spinner size="lg" />
          <p className="text-xs text-text-secondary mt-3">Loading documents...</p>
        </div>
      ) : filteredDocs.length > 0 ? (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface border-b border-border text-text-muted uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-5 py-3.5">Document File</th>
                  <th className="px-5 py-3.5">Linked Matter</th>
                  <th className="px-5 py-3.5">File Size</th>
                  <th className="px-5 py-3.5">Date Uploaded</th>
                  <th className="px-5 py-3.5">Review Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDocs.map((doc) => (
                  <tr key={doc._id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-text-primary max-w-xs truncate block" title={doc.originalName}>
                          {doc.originalName}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {doc.case ? (
                        <span className="font-medium text-text-primary truncate max-w-[180px] block" title={doc.case.title}>
                          {doc.case.title}
                        </span>
                      ) : (
                        <span className="text-text-muted">Unlinked (General)</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-text-secondary">
                      {formatFileSize(doc.size)}
                    </td>

                    <td className="px-5 py-4 text-text-secondary">
                      {formatDate(doc.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`badge ${getStatusColor(doc.status)} text-[10px]`}>
                        {doc.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDownload(doc._id, doc.originalName)}
                          className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(doc._id)}
                          className="p-1.5 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card bg-white p-12 text-center">
          <EmptyState
            icon={FileText}
            title="No Documents Uploaded"
            description="Upload petitions, agreements, evidence receipts, or affidavits to share them directly with your attorney."
            action={
              <Button variant="primary" size="sm" onClick={() => setUploadModalOpen(true)}>
                <Upload className="w-4 h-4" /> Upload First Document
              </Button>
            }
          />
        </div>
      )}

      {/* Upload Document Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          setSelectedFile(null);
        }}
        title="Upload Document to Vault"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setUploadModalOpen(false);
                setSelectedFile(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={uploading}
              disabled={!selectedFile}
              onClick={handleUploadSubmit}
            >
              Upload Securely
            </Button>
          </div>
        }
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="label text-xs">Attach to Case (Optional)</label>
            <select
              value={associatedCaseId}
              onChange={(e) => setAssociatedCaseId(e.target.value)}
              className="input-field text-xs"
            >
              <option value="">General Vault Document (Not attached)</option>
              {cases.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.caseReference} — {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label text-xs">Select Document File</label>
            <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-colors bg-surface/40">
              <input
                type="file"
                id="docUploadInput"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
              <label htmlFor="docUploadInput" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-8 h-8 text-primary mb-2" />
                <span className="text-xs font-bold text-text-primary">
                  {selectedFile ? selectedFile.name : 'Click to select or drag file here'}
                </span>
                <span className="text-[11px] text-text-muted mt-1">
                  Supported: PDF, JPG, PNG (Max 10MB)
                </span>
              </label>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Document"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Keep File
            </Button>
            <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>
              Delete File
            </Button>
          </div>
        }
      >
        <p className="text-xs text-text-secondary leading-relaxed">
          Are you sure you want to permanently delete this document from your vault? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default DocumentsPage;
