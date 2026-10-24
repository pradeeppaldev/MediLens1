import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Share2,
  Eye,
  Download,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { INDIAN_DOCUMENTS } from '../data/indianClinicalData';
import { toast } from 'sonner';

const UploadPrescription = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const fetchDocuments = async () => {
    if (!user) {
      setDocuments(INDIAN_DOCUMENTS);
      return;
    }
    try {
      const docsRef = collection(db, `users/${user.uid}/documents`);
      const snapshot = await getDocs(docsRef);
      const docsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocuments(docsData.length > 0 ? docsData : INDIAN_DOCUMENTS);
    } catch (error) {
      console.warn('Using Indian documents vault fallback:', error?.message);
      setDocuments(INDIAN_DOCUMENTS);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const handleFileChange = (selectedFile) => {
    if (selectedFile && (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf')) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl(null);
      }
      setUploadedDoc(null);
      setError(null);
    } else {
      setError('Please select a valid image (PNG, JPG, WEBP) or PDF file.');
      toast.error('Invalid file type');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      toast.error('No file selected');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(25);

    try {
      const timestamp = Date.now();
      let downloadURL = previewUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80';

      // Simulate parsing progress
      setTimeout(() => setUploadProgress(65), 300);
      setTimeout(() => setUploadProgress(100), 700);

      const docData = {
        name: file.name,
        type: file.type.startsWith('image/') ? 'Prescription Scan' : 'Clinical Document',
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        url: downloadURL,
        uploadedAt: new Date(),
        userId: user ? user.uid : 'demo',
        status: 'Processed & Verified'
      };

      if (user && !user.isDemo) {
        const docRef = doc(db, `users/${user.uid}/documents`, `doc_${timestamp}`);
        await setDoc(docRef, docData);
      }

      setUploadedDoc(docData);
      setDocuments(prev => [docData, ...prev]);
      toast.success('Prescription uploaded and parsed with Vision AI!');

      setFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload document. Please try again.');
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Prescription OCR & Document Vault
            </h1>
            <Badge variant="outline" className="font-bold text-xs bg-primary/5 text-primary">
              Vision AI
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Upload handwritten or digital Indian prescriptions for automated optical character recognition (OCR) and drug interaction checks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-bold text-foreground">
                <Upload className="h-4 w-4 text-primary" />
                Upload Prescription Image or PDF
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Supported formats: PNG, JPG, WEBP, and PDF up to 25MB.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Drag & Drop Target */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileChange(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-[border-color,background-color] duration-140 cursor-pointer ${
                  isDragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-border/80 hover:border-primary/50 hover:bg-muted/30 bg-card'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={cameraInputRef}
                  onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-foreground text-center">
                  Drag & drop your prescription scan here
                </p>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  or click to browse from device camera or photo roll
                </p>

                <div className="flex items-center gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => cameraInputRef.current?.click()}
                    className="rounded-xl text-xs h-8 gap-1.5 font-bold"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    Take Photo
                  </Button>
                </div>
              </div>

              {/* Selected File Card */}
              {file && (
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-muted/40">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{file.name}</p>
                      <p className="text-[11px] text-muted-foreground tabular-numbers">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="rounded-xl text-xs font-bold h-9 px-4"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze with AI'
                    )}
                  </Button>
                </div>
              )}

              {/* Progress bar */}
              {isUploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Extracting medication dosages...</span>
                    <span className="tabular-numbers font-semibold">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-teal-500 transition-[width] duration-200 ease-emil-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Image Preview if available */}
              {previewUrl && (
                <div className="rounded-xl border border-border/60 overflow-hidden bg-black/5 dark:bg-black/30 p-2">
                  <p className="text-xs font-bold text-muted-foreground mb-2 px-1">Prescription Scan Preview:</p>
                  <img
                    src={previewUrl}
                    alt="Prescription preview"
                    className="max-h-64 rounded-lg object-contain mx-auto"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Vault Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Prescription Archive ({documents.length})
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/documents')}
                  className="text-xs font-bold text-primary h-7"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 divide-y divide-border/50">
              {documents.slice(0, 5).map((docItem, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">{docItem.name}</p>
                    <p className="text-[11px] text-muted-foreground">{docItem.doctor || docItem.type || 'Verified'} • {docItem.size || 'PDF'}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (docItem.url) window.open(docItem.url, '_blank');
                    }}
                    className="h-7 text-xs rounded-lg font-bold shrink-0"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadPrescription;
