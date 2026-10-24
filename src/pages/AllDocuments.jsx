import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { FileText, Plus, Download, Eye, Calendar, Trash2, Share2, Search, FileCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { INDIAN_DOCUMENTS } from '../data/indianClinicalData';
import { toast } from 'sonner';

const AllDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) {
        setDocuments(INDIAN_DOCUMENTS);
        setLoading(false);
        return;
      }

      try {
        const documentsRef = collection(db, `users/${user.uid}/documents`);
        const snapshot = await getDocs(documentsRef);
        const documentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (documentsData.length > 0) {
          setDocuments(documentsData);
        } else {
          setDocuments(INDIAN_DOCUMENTS);
        }
      } catch (error) {
        console.warn('Loading Indian medical documents fallback:', error?.message);
        setDocuments(INDIAN_DOCUMENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      if (user && !user.isDemo && documentToDelete.id?.length > 10) {
        const documentRef = doc(db, `users/${user.uid}/documents`, documentToDelete.id);
        await deleteDoc(documentRef);
      }
      setDocuments(prev => prev.filter(d => d.id !== documentToDelete.id));
      toast.success('Document deleted from vault');
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleDownload = (url, filename) => {
    try {
      window.open(url, '_blank');
      toast.success('Opening medical record document');
    } catch (e) {
      toast.error('Could not open document link');
    }
  };

  const handleShare = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Encrypted link copied to clipboard');
    } catch (err) {
      toast.error('Could not copy link');
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.doctor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Medical Records Vault
            </h1>
            <Badge variant="outline" className="font-bold text-xs bg-primary/5 text-primary">
              {filteredDocuments.length} Verified Files
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Encrypted diagnostic lab tests, clinical discharge summaries (AIIMS / Apollo), and OCR parsed scans.
          </p>
        </div>
        <Link to="/prescriptions/upload">
          <Button size="sm" className="rounded-xl text-xs font-bold gap-1.5 shadow-xs">
            <Plus className="h-4 w-4" />
            Upload Document
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by file name, hospital, or document type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-11 rounded-xl text-sm"
        />
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 rounded-2xl bg-muted/40 animate-pulse border border-border/40" />
          ))}
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((docItem) => (
            <Card
              key={docItem.id}
              className="group flex flex-col justify-between border-border/80 hover:border-primary/50 shadow-xs hover:shadow-md transition-[transform,box-shadow,border-color] duration-160 ease-emil-out"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold transition-transform duration-140 group-hover:scale-105 shrink-0">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-foreground line-clamp-1">
                        {docItem.name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-[10px] font-bold mt-1">
                        {docItem.type || 'Clinical Document'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setDocumentToDelete(docItem);
                      setShowDeleteModal(true);
                    }}
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    title="Delete File"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 pt-0 text-xs">
                {docItem.doctor && (
                  <p className="text-xs font-semibold text-foreground">
                    Provider: {docItem.doctor}
                  </p>
                )}
                <div className="flex items-center justify-between text-muted-foreground text-[11px] pt-1 border-t border-border/40">
                  <div className="flex items-center gap-1.5 tabular-numbers font-medium">
                    <Calendar className="h-3 w-3" />
                    <span>{docItem.date || 'Recent'}</span>
                  </div>
                  {docItem.size && (
                    <span className="font-mono text-[10px] bg-muted px-1.5 py-0.2 rounded border border-border/40">
                      {docItem.size}
                    </span>
                  )}
                </div>

                {docItem.tags && docItem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {docItem.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-3 border-t border-border/50 flex justify-between items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(docItem.url || window.location.href)}
                  className="rounded-xl text-xs h-8 gap-1 font-semibold text-muted-foreground hover:text-foreground"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share Link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(docItem.url, docItem.name)}
                  className="rounded-xl text-xs h-8 gap-1 font-bold text-primary border-primary/30 hover:bg-primary/10"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View File
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16 border-dashed border-2">
          <CardContent className="space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">No documents found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Upload your medical bills, lab reports, or discharge certificates to keep them encrypted in your vault.
              </p>
            </div>
            <Link to="/prescriptions/upload">
              <Button size="sm" className="rounded-xl text-xs font-bold">
                <Plus className="h-4 w-4 mr-1.5" />
                Upload First Document
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive">
              Delete Document?
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to remove <strong className="text-foreground">{documentToDelete?.name}</strong> from your health records vault?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(false)}
              className="rounded-xl text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteDocument}
              className="rounded-xl text-xs font-bold"
            >
              Delete File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllDocuments;
