import React, { useState, useEffect } from 'react';
import { storageService, FileAttachment } from '../../services/storageService';
import { Button } from '../ui/button';
import { Paperclip, Loader2, X, Download, FileText, Image as ImageIcon } from 'lucide-react';

interface FileUploaderProps {
  entityType: string;
  entityId: string;
  className?: string;
  onUploadSuccess?: (file: FileAttachment) => void;
  onDeleteSuccess?: (fileId: string) => void;
}

export function FileUploader({ entityType, entityId, className = '', onUploadSuccess, onDeleteSuccess }: FileUploaderProps) {
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadFiles();
  }, [entityId, entityType]);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const data = await storageService.getFiles(entityType, entityId);
      setFiles(data);
    } catch (error) {
      console.error('Failed to load files:', error);
      // alert('تعذر تحميل الملفات المرفقة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate size (50MB)
    if (selected.size > 50 * 1024 * 1024) {
      alert('حجم الملف كبير جداً. الحد الأقصى 50MB');
      return;
    }

    try {
      setIsUploading(true);
      const uploaded = await storageService.uploadFile(selected, entityType, entityId);
      setFiles(prev => [uploaded, ...prev]);
      if (onUploadSuccess) onUploadSuccess(uploaded);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.message || 'تعذر رفع الملف');
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return;
    try {
      await storageService.deleteFile(id);
      setFiles(prev => prev.filter(f => f.id !== id));
      if (onDeleteSuccess) onDeleteSuccess(id);
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(error.message || 'تعذر حذف الملف');
    }
  };

  const handleDownload = async (path: string, name: string) => {
    try {
      const url = await storageService.getDownloadUrl(path);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error('Download error:', error);
      alert('تعذر تحميل الملف');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <ImageIcon className="w-4 h-4 text-blue-400" />;
    if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-400" />;
    return <FileText className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Paperclip className="w-4 h-4" />
          الملفات المرفقة
        </h4>
        <div>
          <input 
            type="file" 
            id={`file-upload-${entityId}`} 
            className="hidden" 
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs bg-slate-800/50"
            disabled={isUploading}
            onClick={() => document.getElementById(`file-upload-${entityId}`)?.click()}
          >
            {isUploading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Paperclip className="w-3 h-3 mr-1" />}
            {isUploading ? 'جارٍ الرفع...' : 'إرفاق ملف'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-4 border border-dashed border-slate-700 rounded-lg">
          <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
        </div>
      ) : files.length === 0 ? (
        <div className="text-center p-4 border border-dashed border-slate-700 rounded-lg bg-slate-900/30">
          <p className="text-xs text-slate-500">لا توجد ملفات مرفقة</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map(f => (
            <div key={f.id} className="flex items-center justify-between p-2 rounded bg-slate-800/40 border border-slate-700/50 group hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="shrink-0 p-1.5 bg-slate-900/50 rounded-md">
                  {getFileIcon(f.file_type)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate" title={f.file_name}>{f.file_name}</p>
                  <p className="text-[10px] text-slate-500">{formatSize(f.file_size)} · {new Date(f.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white" onClick={() => handleDownload(f.storage_path, f.file_name)}>
                  <Download className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDelete(f.id)}>
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
