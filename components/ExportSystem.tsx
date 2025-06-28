'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle, Settings, Database } from 'lucide-react';
import { ProcessedData, Rule, OptimizationWeights } from '@/types';

interface ExportSystemProps {
  data: ProcessedData;
  rules: Rule[];
  weights: OptimizationWeights;
}

export function ExportSystem({ data, rules, weights }: ExportSystemProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const downloadFile = (content: string, filename: string, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateCleanCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  const generateValidationReport = () => {
    const allErrors = [
      ...data.validationErrors.clients.map(e => ({ ...e, table: 'clients' })),
      ...data.validationErrors.workers.map(e => ({ ...e, table: 'workers' })),
      ...data.validationErrors.tasks.map(e => ({ ...e, table: 'tasks' })),
      ...data.validationErrors.crossReference.map(e => ({ ...e, table: 'cross-reference' }))
    ];

    const report = {
      summary: {
        totalRecords: {
          clients: data.clients?.length || 0,
          workers: data.workers?.length || 0,
          tasks: data.tasks?.length || 0
        },
        validationResults: {
          totalErrors: allErrors.filter(e => e.severity === 'error').length,
          totalWarnings: allErrors.filter(e => e.severity === 'warning').length,
          overallStatus: allErrors.filter(e => e.severity === 'error').length === 0 ? 'PASSED' : 'FAILED'
        }
      },
      errors: allErrors,
      recommendations: [
        'Review all error-level validation issues before proceeding',
        'Consider addressing warning-level issues for optimal performance',
        'Ensure all cross-references are valid',
        'Verify skill coverage across all tasks'
      ]
    };

    return JSON.stringify(report, null, 2);
  };

  const generateRulesConfig = () => {
    const config = {
      metadata: {
        version: '1.0',
        exportDate: new Date().toISOString(),
        totalRules: rules.length,
        activeRules: rules.filter(r => r.enabled).length
      },
      optimizationWeights: weights,
      businessRules: rules.map(rule => ({
        id: rule.id,
        type: rule.type,
        description: rule.description,
        parameters: rule.parameters,
        enabled: rule.enabled,
        createdAt: rule.createdAt
      })),
      rulesByType: {
        coRun: rules.filter(r => r.type === 'coRun').length,
        slotRestriction: rules.filter(r => r.type === 'slotRestriction').length,
        loadLimit: rules.filter(r => r.type === 'loadLimit').length,
        phaseWindow: rules.filter(r => r.type === 'phaseWindow').length,
        patternMatch: rules.filter(r => r.type === 'patternMatch').length
      }
    };

    return JSON.stringify(config, null, 2);
  };

  const exportAllData = async () => {
    setIsExporting(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate and download cleaned CSV files
      const clientsCSV = generateCleanCSV(data.clients, 'clients_cleaned.csv');
      const workersCSV = generateCleanCSV(data.workers, 'workers_cleaned.csv');
      const tasksCSV = generateCleanCSV(data.tasks, 'tasks_cleaned.csv');
      
      // Generate configuration files
      const rulesConfig = generateRulesConfig();
      const validationReport = generateValidationReport();

      // Download all files
      downloadFile(clientsCSV, 'clients_cleaned.csv', 'text/csv');
      downloadFile(workersCSV, 'workers_cleaned.csv', 'text/csv');
      downloadFile(tasksCSV, 'tasks_cleaned.csv', 'text/csv');
      downloadFile(rulesConfig, 'rules_config.json', 'application/json');
      downloadFile(validationReport, 'validation_report.json', 'application/json');

      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportFiles = [
    {
      name: 'clients_cleaned.csv',
      description: 'Validated client data with corrections applied',
      icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />,
      size: `${data.clients?.length || 0} records`,
      color: 'text-blue-400'
    },
    {
      name: 'workers_cleaned.csv',
      description: 'Validated worker data with skills and availability',
      icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />,
      size: `${data.workers?.length || 0} records`,
      color: 'text-green-400'
    },
    {
      name: 'tasks_cleaned.csv',
      description: 'Validated task data with requirements and phases',
      icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />,
      size: `${data.tasks?.length || 0} records`,
      color: 'text-purple-400'
    },
    {
      name: 'rules_config.json',
      description: 'Business rules and optimization weights configuration',
      icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />,
      size: `${rules.length} rules`,
      color: 'text-orange-400'
    },
    {
      name: 'validation_report.json',
      description: 'Comprehensive validation results and recommendations',
      icon: <Database className="w-4 h-4 sm:w-5 sm:h-5"  />,
      size: 'Full report',
      color: 'text-red-400'
    }
  ];

  const totalErrors = Object.values(data.validationErrors).flat().filter(e => e.severity === 'error').length;
  const totalWarnings = Object.values(data.validationErrors).flat().filter(e => e.severity === 'warning').length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Export & Deployment
        </h2>
        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto px-4">
          Download your cleaned, validated data and configuration files ready for production deployment.
        </p>
      </div>

      {/* Export Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
            <h3 className="font-semibold text-white text-sm sm:text-base">Data Quality</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Total Records:</span>
              <span className="text-white font-medium">
                {(data.clients?.length || 0) + (data.workers?.length || 0) + (data.tasks?.length || 0)}
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Errors:</span>
              <span className={`font-medium ${totalErrors > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {totalErrors}
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Warnings:</span>
              <span className="text-yellow-400 font-medium">{totalWarnings}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 flex-shrink-0" />
            <h3 className="font-semibold text-white text-sm sm:text-base">Rules & Config</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Total Rules:</span>
              <span className="text-white font-medium">{rules.length}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Active Rules:</span>
              <span className="text-green-400 font-medium">{rules.filter(r => r.enabled).length}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Optimization:</span>
              <span className="text-blue-400 font-medium">Configured</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${totalErrors === 0 ? 'text-green-400' : 'text-red-400'}`} />
            <h3 className="font-semibold text-white text-sm sm:text-base">Ready Status</h3>
          </div>
          <div className="space-y-2">
            <div className={`text-base sm:text-lg font-bold ${totalErrors === 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalErrors === 0 ? 'READY' : 'NEEDS ATTENTION'}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">
              {totalErrors === 0 
                ? 'All validations passed' 
                : `${totalErrors} errors need resolution`
              }
            </div>
          </div>
        </div>
      </div>

      {/* Export Files Preview */}
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold text-white">Export Package Contents</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {exportFiles.map((file, index) => (
            <motion.div
              key={file.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-700"
            >
              <div className="flex items-start gap-3">
                <div className={`${file.color} mt-1 flex-shrink-0`}>
                  {file.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white mb-1 text-sm sm:text-base truncate">{file.name}</h4>
                  <p className="text-gray-400 text-xs sm:text-sm mb-2">{file.description}</p>
                  <span className="text-xs text-gray-500">{file.size}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        <motion.button
          onClick={exportAllData}
          disabled={isExporting || totalErrors > 0}
          whileHover={{ scale: totalErrors === 0 ? 1.05 : 1 }}
          whileTap={{ scale: totalErrors === 0 ? 0.95 : 1 }}
          className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-3 touch-target ${
            totalErrors > 0
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : isExporting
              ? 'bg-blue-600 text-white'
              : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isExporting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Download className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>
              <span>Exporting Data...</span>
            </>
          ) : exportComplete ? (
            <>
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Export Complete!</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Export All Data</span>
            </>
          )}
        </motion.button>

        {totalErrors > 0 && (
          <div className="text-center p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-xl max-w-md">
            <p className="text-red-400 font-medium mb-2 text-sm sm:text-base">⚠️ Export Blocked</p>
            <p className="text-gray-300 text-xs sm:text-sm">
              Please resolve all validation errors before exporting. 
              Check the Data Management section to fix issues.
            </p>
          </div>
        )}

        <div className="text-center text-gray-400 text-xs sm:text-sm max-w-2xl px-4">
          <p>
            Your exported files will be optimized and ready for production use. 
            The validation report includes recommendations for further improvements.
          </p>
        </div>
      </div>

      {/* Export Success Animation */}
      {exportComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
        >
          <div className="bg-gray-900 border border-green-500 rounded-2xl p-6 sm:p-8 text-center max-w-sm w-full">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Export Successful!</h3>
            <p className="text-gray-300 text-sm sm:text-base">All files have been downloaded to your device.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}