'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  FileVideo, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Download,
  Eye,
  X
} from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'analyzing' | 'completed' | 'error';
  analysis?: {
    duration: string;
    incidents: Array<{
      timestamp: string;
      type: string;
      description: string;
      confidence: number;
    }>;
    summary: string;
  };
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const videoFiles = files.filter(file => file.type.startsWith('video/'));
    
    videoFiles.forEach(file => {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
        status: 'uploading'
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate upload process
      simulateUpload(newFile.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadedFiles(prev => 
        prev.map(file => {
          if (file.id === fileId && file.status === 'uploading') {
            const newProgress = Math.min(file.progress + Math.random() * 15, 100);
            if (newProgress >= 100) {
              clearInterval(uploadInterval);
              // Start analysis
              setTimeout(() => simulateAnalysis(fileId), 1000);
              return { ...file, progress: 100, status: 'analyzing' };
            }
            return { ...file, progress: newProgress };
          }
          return file;
        })
      );
    }, 500);
  };

  const simulateAnalysis = (fileId: string) => {
    // Simulate analysis process
    setTimeout(() => {
      setUploadedFiles(prev => 
        prev.map(file => {
          if (file.id === fileId) {
            return {
              ...file,
              status: 'completed',
              analysis: {
                duration: '2:34',
                incidents: [
                  {
                    timestamp: '00:45',
                    type: 'weapon',
                    description: 'Potential knife detected in frame',
                    confidence: 87
                  },
                  {
                    timestamp: '01:23',
                    type: 'suspicious',
                    description: 'Person exhibiting suspicious behavior',
                    confidence: 73
                  },
                  {
                    timestamp: '02:10',
                    type: 'emotion',
                    description: 'Aggressive behavior detected',
                    confidence: 91
                  }
                ],
                summary: 'Analysis completed. 3 potential security incidents detected with high confidence levels.'
              }
            };
          }
          return file;
        })
      );
    }, 3000);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading': return 'default';
      case 'analyzing': return 'outline';
      case 'completed': return 'default';
      case 'error': return 'destructive';
      default: return 'default';
    }
  };

  const getIncidentColor = (type: string) => {
    switch (type) {
      case 'weapon': return 'destructive';
      case 'suspicious': return 'outline';
      case 'emotion': return 'secondary';
      default: return 'default';
    }
  };

  const downloadReport = (file: UploadedFile) => {
    const reportData = {
      filename: file.file.name,
      uploadTime: new Date().toISOString(),
      analysis: file.analysis
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_${file.file.name}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Upload External Footage</h1>
        <p className="text-gray-400 mt-1">
          Upload video files for AI-powered analysis and threat detection
        </p>
      </div>

      {/* Upload Area */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Upload className="h-5 w-5 text-blue-500" />
            Upload Video Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <FileVideo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Drop video files here or click to browse
            </h3>
            <p className="text-gray-400 mb-4">
              Supports MP4, AVI, MOV, and other video formats. Max file size: 500MB
            </p>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Queue */}
      {uploadedFiles.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5 text-yellow-500" />
              Processing Queue ({uploadedFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="p-4 bg-gray-900 rounded-lg border border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileVideo className="h-8 w-8 text-blue-500" />
                    <div>
                      <h4 className="font-medium text-white">{file.file.name}</h4>
                      <p className="text-sm text-gray-400">
                        {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(file.status)}>
                      {file.status === 'uploading' && 'Uploading'}
                      {file.status === 'analyzing' && 'Analyzing'}
                      {file.status === 'completed' && 'Completed'}
                      {file.status === 'error' && 'Error'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                {(file.status === 'uploading' || file.status === 'analyzing') && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">
                        {file.status === 'uploading' ? 'Uploading...' : 'Analyzing...'}
                      </span>
                      {file.status === 'uploading' && (
                        <span className="text-gray-400">{Math.round(file.progress)}%</span>
                      )}
                    </div>
                    <Progress 
                      value={file.status === 'uploading' ? file.progress : 50} 
                      className="h-2"
                    />
                  </div>
                )}

                {/* Analysis Results */}
                {file.status === 'completed' && file.analysis && (
                  <div className="space-y-4">
                    <Separator className="bg-gray-700" />
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-white flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Analysis Complete
                        </h5>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadReport(file)}
                            className="border-gray-600 text-white hover:bg-gray-700"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Report
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-white hover:bg-gray-700"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="text-sm font-medium text-gray-300 mb-2">Summary</h6>
                          <p className="text-sm text-gray-400 mb-3">{file.analysis.summary}</p>
                          <div className="text-sm">
                            <span className="text-gray-400">Duration: </span>
                            <span className="text-white">{file.analysis.duration}</span>
                          </div>
                        </div>

                        <div>
                          <h6 className="text-sm font-medium text-gray-300 mb-2">
                            Detected Incidents ({file.analysis.incidents.length})
                          </h6>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {file.analysis.incidents.map((incident, index) => (
                              <div
                                key={index}
                                className="p-2 bg-gray-800 rounded border border-gray-700"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <Badge variant={getIncidentColor(incident.type)} className="text-xs">
                                    {incident.type.toUpperCase()}
                                  </Badge>
                                  <span className="text-xs text-gray-400">{incident.timestamp}</span>
                                </div>
                                <p className="text-xs text-gray-300">{incident.description}</p>
                                <div className="text-xs text-gray-500 mt-1">
                                  Confidence: {incident.confidence}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Upload Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-white mb-3">Supported Formats</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• MP4 (recommended)</li>
                <li>• AVI</li>
                <li>• MOV</li>
                <li>• WMV</li>
                <li>• MKV</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-3">Analysis Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Weapon detection</li>
                <li>• Suspicious behavior analysis</li>
                <li>• Emotion recognition</li>
                <li>• Object tracking</li>
                <li>• Crowd analysis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}