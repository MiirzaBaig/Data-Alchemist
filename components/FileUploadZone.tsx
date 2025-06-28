'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Database, 
  File, 
  X, 
  Users, 
  Briefcase, 
  ClipboardList,
  FolderOpen,
  FileSpreadsheet,
  Download,
  Sparkles,
  Zap,
  Shield,
  Eye,
  ArrowRight,
  Plus,
  FileCheck,
  AlertTriangle,
  Info,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { ValidationEngine } from '@/utils/validation';
import { ClientData, WorkerData, TaskData, ProcessedData, UploadStatus } from '@/types';

interface FileUploadZoneProps {
  onDataProcessed: (data: ProcessedData) => void;
}

export function FileUploadZone({ onDataProcessed }: FileUploadZoneProps) {
  const [files, setFiles] = useState<{clients?: File, workers?: File, tasks?: File}>({});
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({});
  const [dragActive, setDragActive] = useState(false);
  const [processingData, setProcessingData] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const parseFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      
      if (fileType === 'csv') {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results.data),
          error: (error) => reject(error)
        });
      } else if (fileType === 'xlsx' || fileType === 'xls') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            resolve(jsonData);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsBinaryString(file);
      } else {
        reject(new Error('Unsupported file type'));
      }
    });
  };

  const handleFileUpload = async (file: File, type: 'clients' | 'workers' | 'tasks') => {
    setUploadStatus(prev => ({ ...prev, [type]: 'uploading' }));
    
    try {
      const data = await parseFile(file);
      setFiles(prev => ({ ...prev, [type]: file }));
      setUploadStatus(prev => ({ ...prev, [type]: 'success' }));
      
      const newFiles = { ...files, [type]: file };
      if (newFiles.clients && newFiles.workers && newFiles.tasks) {
        await processAllData(newFiles);
      }
    } catch (error) {
      console.error(`Error processing ${type} file:`, error);
      setUploadStatus(prev => ({ ...prev, [type]: 'error' }));
    }
  };

  const processAllData = async (allFiles: {clients: File, workers: File, tasks: File}) => {
    setProcessingData(true);
    
    try {
      const [clientsData, workersData, tasksData] = await Promise.all([
        parseFile(allFiles.clients),
        parseFile(allFiles.workers),
        parseFile(allFiles.tasks)
      ]);

      const validationEngine = new ValidationEngine();
      const clientErrors = validationEngine.validateClients(clientsData as ClientData[]);
      const workerErrors = validationEngine.validateWorkers(workersData as WorkerData[]);
      const taskErrors = validationEngine.validateTasks(tasksData as TaskData[]);
      const crossRefErrors = validationEngine.validateCrossReferences(
        clientsData as ClientData[],
        workersData as WorkerData[],
        tasksData as TaskData[]
      );

      const processedData: ProcessedData = {
        clients: clientsData as ClientData[],
        workers: workersData as WorkerData[],
        tasks: tasksData as TaskData[],
        validationErrors: {
          clients: clientErrors,
          workers: workerErrors,
          tasks: taskErrors,
          crossReference: crossRefErrors
        }
      };

      onDataProcessed(processedData);
    } catch (error) {
      console.error('Error processing data:', error);
    } finally {
      setProcessingData(false);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    
    for (const file of droppedFiles) {
      const fileName = file.name.toLowerCase();
      if (fileName.includes('client')) {
        await handleFileUpload(file, 'clients');
      } else if (fileName.includes('worker')) {
        await handleFileUpload(file, 'workers');
      } else if (fileName.includes('task')) {
        await handleFileUpload(file, 'tasks');
      }
    }
  }, [files]);

  const removeFile = (type: 'clients' | 'workers' | 'tasks') => {
    setFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[type];
      return newFiles;
    });
    setUploadStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[type];
      return newStatus;
    });
  };

  const fileTypes = [
    { 
      key: 'clients', 
      label: 'Clients Data', 
      description: 'Client information with priorities and task requests',
      example: 'clients.csv',
      icon: <Users className="h-8 w-8" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      features: ['Priority levels', 'Task requests', 'Client groups']
    },
    { 
      key: 'workers', 
      label: 'Workers Data', 
      description: 'Worker skills, availability, and capacity information',
      example: 'workers.csv',
      icon: <Briefcase className="h-8 w-8" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      features: ['Skills & qualifications', 'Availability slots', 'Capacity limits']
    },
    { 
      key: 'tasks', 
      label: 'Tasks Data', 
      description: 'Task definitions with requirements and constraints',
      example: 'tasks.csv',
      icon: <ClipboardList className="h-8 w-8" />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      features: ['Required skills', 'Duration & phases', 'Dependencies']
    }
  ];

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'uploading': 
        return <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />;
      case 'success': 
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error': 
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default: 
        return <Plus className="h-5 w-5 text-gray-400" />;
    }
  };

  const allFilesUploaded = files.clients && files.workers && files.tasks;
  const hasErrors = Object.values(uploadStatus).some(status => status === 'error');

  return (
    <div className="space-y-8">
      {/* Header with enhanced styling */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-6 py-3 glass-card rounded-full mb-6"
        >
          <Database className="h-5 w-5 text-blue-400" />
          <span className="text-sm font-medium text-gray-300">Data Upload Center</span>
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">Upload Your Data</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Transform your spreadsheets into intelligent resource allocation systems. 
          Our AI will validate, clean, and optimize your data automatically.
        </p>
      </div>

      {/* Enhanced Main Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
          dragActive 
            ? 'border-blue-400 bg-blue-500/10 scale-105' 
            : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        <div className="glass-card p-12 text-center">
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ 
                scale: dragActive ? 1.1 : 1,
                rotate: dragActive ? 5 : 0
              }}
              className={`p-6 rounded-2xl mb-6 transition-all duration-300 ${
                dragActive ? 'bg-blue-500/20' : 'bg-gray-800/50'
              }`}
            >
              <FolderOpen className={`h-16 w-16 ${dragActive ? 'text-blue-400' : 'text-gray-400'}`} />
            </motion.div>
            
            <h3 className="text-2xl font-semibold text-white mb-3">
              {dragActive ? 'Drop your files here!' : 'Drag & Drop Your Files'}
            </h3>
            <p className="text-gray-400 mb-8 max-w-md">
              Upload CSV or Excel files. Files will be automatically detected and categorized by name.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="file"
                multiple
                accept=".csv,.xlsx,.xls"
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files || []);
                  selectedFiles.forEach(file => {
                    const fileName = file.name.toLowerCase();
                    if (fileName.includes('client')) {
                      handleFileUpload(file, 'clients');
                    } else if (fileName.includes('worker')) {
                      handleFileUpload(file, 'workers');
                    } else if (fileName.includes('task')) {
                      handleFileUpload(file, 'tasks');
                    }
                  });
                }}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="btn-modern px-8 py-4 rounded-xl font-semibold flex items-center gap-3 cursor-pointer">
                <Upload className="h-5 w-5" />
                Browse Files
              </label>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FileSpreadsheet className="h-4 w-4" />
                <span>CSV, Excel supported</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
        </div>
      </motion.div>

      {/* Enhanced File Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fileTypes.map((fileType, index) => {
          const status = uploadStatus[fileType.key as keyof UploadStatus];
          const file = files[fileType.key as keyof typeof files];
          
          return (
            <motion.div
              key={fileType.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                file 
                  ? `${fileType.borderColor} ${fileType.bgColor}` 
                  : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${fileType.color}`}>
                      {fileType.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{fileType.label}</h3>
                      <p className="text-xs text-gray-500">{fileType.example}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    {file && (
                      <button
                        onClick={() => removeFile(fileType.key as any)}
                        className="p-1 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-gray-400 text-sm mb-4">{fileType.description}</p>
                
                {/* Features */}
                <div className="space-y-2 mb-6">
                  {fileType.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                      <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${fileType.color}`}></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* File Info or Upload Button */}
                {file ? (
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg ${fileType.bgColor} border ${fileType.borderColor}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <FileCheck className={`h-4 w-4 ${fileType.textColor}`} />
                        <span className="text-white font-medium text-sm truncate">{file.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Size: {(file.size / 1024).toFixed(1)} KB</span>
                        <span className="text-gray-400">
                          {new Date(file.lastModified).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {status === 'success' && (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        <span>Successfully uploaded</span>
                      </div>
                    )}
                    
                    {status === 'error' && (
                      <div className="flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>Upload failed</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) {
                          handleFileUpload(selectedFile, fileType.key as any);
                        }
                      }}
                      className="hidden"
                      id={`file-${fileType.key}`}
                    />
                    <label 
                      htmlFor={`file-${fileType.key}`} 
                      className="w-full btn btn-secondary py-3 cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      Choose File
                    </label>
                  </div>
                )}
              </div>
              
              {/* Status indicator line */}
              {file && (
                <div className={`h-1 w-full bg-gradient-to-r ${fileType.color}`}></div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Processing Status */}
      <AnimatePresence>
        {processingData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card rounded-2xl p-8 border border-blue-500/30"
          >
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-ping opacity-20"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">AI Processing Your Data</h3>
                <p className="text-gray-400 mb-4">
                  Our advanced validation engine is analyzing your datasets for quality, consistency, and optimization opportunities.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Shield className="h-4 w-4" />
                    <span>Validating data integrity</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <Eye className="h-4 w-4" />
                    <span>Detecting patterns</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-400">
                    <Sparkles className="h-4 w-4" />
                    <span>Optimizing structure</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success State */}
      {allFilesUploaded && !processingData && !hasErrors && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 border border-green-500/30 bg-green-500/5"
        >
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">Upload Complete!</h3>
              <p className="text-gray-400 mb-4">
                All files have been successfully processed and validated. You can now proceed to review and manage your data.
              </p>
              <div className="flex items-center gap-2 text-green-400">
                <ArrowRight className="h-4 w-4" />
                <span className="font-medium">Ready for next step</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Sample Data Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card rounded-2xl p-8 border border-yellow-500/30 bg-yellow-500/5"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500">
            <HelpCircle className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">Need Sample Data?</h3>
            <p className="text-gray-400 mb-6">
              Download our sample files to test the system with realistic data and understand the expected format.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Clients', 'Workers', 'Tasks'].map((sample, index) => (
                <button 
                  key={sample} 
                  className="flex items-center gap-3 p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-gray-600 hover:bg-gray-800 transition-all duration-300 group"
                >
                  <Download className="h-5 w-5 text-yellow-400 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-medium text-white">{sample} Sample</div>
                    <div className="text-xs text-gray-400">CSV format</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upload Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            icon: <FileText className="h-6 w-6 text-blue-400" />,
            title: "File Format",
            description: "CSV and Excel files are supported. Ensure headers match our template format.",
            color: "border-blue-500/30 bg-blue-500/5"
          },
          {
            icon: <Shield className="h-6 w-6 text-green-400" />,
            title: "Data Security",
            description: "Your data is processed locally and never stored on our servers permanently.",
            color: "border-green-500/30 bg-green-500/5"
          },
          {
            icon: <Zap className="h-6 w-6 text-purple-400" />,
            title: "Auto-Detection",
            description: "Files are automatically categorized based on their names and content structure.",
            color: "border-purple-500/30 bg-purple-500/5"
          }
        ].map((tip, index) => (
          <div key={index} className={`glass-card rounded-xl p-6 border ${tip.color}`}>
            <div className="flex items-center gap-3 mb-3">
              {tip.icon}
              <h4 className="font-semibold text-white">{tip.title}</h4>
            </div>
            <p className="text-gray-400 text-sm">{tip.description}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}