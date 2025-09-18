import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
}

export const UploadResume = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newFiles = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        uploadDate: new Date(),
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setIsUploading(false);
      
      toast({
        title: "Upload Successful",
        description: `${acceptedFiles.length} resume(s) uploaded successfully.`,
      });

      // Store in localStorage for persistence
      const existingResumes = JSON.parse(localStorage.getItem('resumes') || '[]');
      localStorage.setItem('resumes', JSON.stringify([...existingResumes, ...newFiles]));
    }, 2000);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Upload Resumes</h1>
        <p className="text-muted-foreground">Upload PDF resumes to build your candidate database</p>
      </div>

      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-glow/5 opacity-50" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-primary" />
            <span>Resume Upload</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive 
                ? 'border-primary bg-primary/10 scale-105' 
                : 'border-muted hover:border-primary hover:bg-accent/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              {isDragActive ? (
                <p className="text-lg font-medium text-primary">Drop the files here...</p>
              ) : (
                <>
                  <p className="text-lg font-medium">Drag & drop PDF files here, or click to select</p>
                  <p className="text-sm text-muted-foreground">Only PDF files are accepted</p>
                </>
              )}
              <Button variant="outline" className="mt-4">
                Select Files
              </Button>
            </div>
          </div>

          {isUploading && (
            <div className="mt-4 p-4 bg-accent rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Uploading...</span>
              </div>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-medium text-foreground">Recently Uploaded</h3>
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};