import { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Search,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { Button, Modal, Spinner, EmptyState } from '../../components/ui';
import { formatDate, formatFileSize, getStatusColor } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdvocateDocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDocsAndCases = async () => {
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
    fetchDocsAndCases();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      toast.error('Only PDF, JPG, and PNG files are accepted');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds maximum 10MB limit');
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      if (selectedCaseId) {
        formData.append('caseId', selectedCaseId);
      }

      const { data } = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        toast.success('Document uploaded to chambers repository');
        setUploadModalOpen(false);
        setSelectedFile(null);
        setSelectedCaseId('');
        fetchDocsAndCases();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (docId) => {
    const downloadUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/documents/${docId}/download`;
    window.open(downloadUrl, '_blank');
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
            Evidence & Legal Briefs
          </span>
          <h1 className="text-2xl font-bold text-text-primary mt-0.5">
            Document Repository & Review
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Review client-uploaded documents, court summons, and case petitions
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

      {/* Search */}
      <div className="bg-white p-3.5 rounded-2xl border border-border flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by file name or case..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 text-xs py-2"
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-muted hidden sm:flex">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span>Privileged Attorney Repository</span>
        </div>
      </div>

      {/* Documents Table */}
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
                  <th className="px-5 py-3.5">Document Name</th>
                  <th className="px-5 py-3.5">Linked Case</th>
                  <th className="px-5 py-3.5">File Size</th>
                  <th className="px-5 py-3.5">Upload Date</th>
                  <th className="px-5 py-3.5">Status</th>
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
                        <span className="text-text-muted">Unlinked file</span>
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
                      <button
                        onClick={() => handleDownload(doc._id)}
                        className="p-1.5 text-primary hover:bg-primary-50 rounded-lg transition-colors"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
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
            title="No Documents Available"
            description="Client-uploaded briefs and filings for your assigned matters will appear here."
          />
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Case Brief to Repository"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={uploading}
              disabled={!selectedFile}
              onClick={handleUploadSubmit}
            >
              Upload Brief
            </Button>
          </div>
        }
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="label text-xs">Link to Active Case</label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="input-field text-xs"
            >
              <option value="">General Chamber Document (Unlinked)</option>
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
                id="advDocUpload"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
              <label htmlFor="advDocUpload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-8 h-8 text-primary mb-2" />
                <span className="text-xs font-bold text-text-primary">
                  {selectedFile ? selectedFile.name : 'Select court petition or brief file'}
                </span>
                <span className="text-[11px] text-text-muted mt-1">
                  Supported: PDF, JPG, PNG (Max 10MB)
                </span>
              </label>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdvocateDocumentsPage;
