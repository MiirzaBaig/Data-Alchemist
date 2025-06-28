'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, AlertCircle, CheckCircle, Edit, X, Eye, EyeOff } from 'lucide-react';
import { ProcessedData, ValidationError } from '@/types';
import { NaturalLanguageSearch } from './NaturalLanguageSearch';

interface DataManagementProps {
  data: ProcessedData;
  onDataUpdate: (data: ProcessedData) => void;
}

export function DataManagement({ data, onDataUpdate }: DataManagementProps) {
  const [activeTab, setActiveTab] = useState<'clients' | 'workers' | 'tasks'>('clients');
  const [editingCell, setEditingCell] = useState<{table: string, row: number, field: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'error' | 'warning'>('all');
  const [showErrors, setShowErrors] = useState(true);

  const getErrorsForTable = (table: string) => {
    const tableErrors = data.validationErrors[table as keyof typeof data.validationErrors] || [];
    const crossRefErrors = data.validationErrors.crossReference?.filter(error => 
      error.field.toLowerCase().includes(table.slice(0, -1))
    ) || [];
    return [...tableErrors, ...crossRefErrors];
  };

  const getErrorsForRow = (table: string, rowIndex: number) => {
    return getErrorsForTable(table).filter(error => error.row === rowIndex);
  };

  const getErrorsForField = (table: string, rowIndex: number, field: string) => {
    return getErrorsForRow(table, rowIndex).filter(error => error.field === field);
  };

  const handleCellEdit = (table: string, rowIndex: number, field: string, newValue: any) => {
    const updatedData = { ...data };
    (updatedData[table as keyof typeof updatedData] as any)[rowIndex][field] = newValue;
    onDataUpdate(updatedData);
    setEditingCell(null);
  };

  const filteredData = useMemo(() => {
    const tableData = data[activeTab] || [];
    if (!searchQuery) return tableData;
    
    return tableData.filter(row => 
      Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, activeTab, searchQuery]);

  const renderDataGrid = (tableData: any[], tableName: string) => {
    if (!tableData || tableData.length === 0) {
      return (
        <div className="card">
          <div className="card-content">
            <div className="text-center py-8 sm:py-12">
              <div className="text-2xl sm:text-4xl mb-4">📊</div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-400 mb-2">No data available</h3>
              <p className="text-sm text-gray-500">Upload your files to see data here</p>
            </div>
          </div>
        </div>
      );
    }

    const headers = Object.keys(tableData[0]);
    const displayData = tableData.slice(0, 100); // Limit for performance

    return (
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell w-12 sm:w-16">#</th>
                {headers.map(header => (
                  <th key={header} className="table-header-cell min-w-[120px] sm:min-w-[150px]">
                    <span className="truncate block">{header}</span>
                  </th>
                ))}
                <th className="table-header-cell w-16 sm:w-20">Status</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((row, rowIndex) => {
                const rowErrors = getErrorsForRow(tableName, rowIndex);
                const hasErrors = rowErrors.length > 0;

                return (
                  <tr
                    key={rowIndex}
                    className={`table-row ${hasErrors ? 'bg-red-950/20' : ''}`}
                  >
                    <td className="table-cell font-mono">{rowIndex + 1}</td>
                    {headers.map(header => {
                      const cellErrors = getErrorsForField(tableName, rowIndex, header);
                      const isEditing = editingCell?.table === tableName && 
                                       editingCell?.row === rowIndex && 
                                       editingCell?.field === header;

                      return (
                        <td 
                          key={header} 
                          className={`table-cell relative ${
                            cellErrors.length > 0 ? 'bg-red-950/30 border-l-2 border-red-500' : ''
                          }`}
                        >
                          {isEditing ? (
                            <div className="flex items-center gap-1 sm:gap-2">
                              <input
                                type="text"
                                defaultValue={row[header]}
                                autoFocus
                                onBlur={(e) => handleCellEdit(tableName, rowIndex, header, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleCellEdit(tableName, rowIndex, header, e.currentTarget.value);
                                  } else if (e.key === 'Escape') {
                                    setEditingCell(null);
                                  }
                                }}
                                className="input text-xs sm:text-sm min-w-0 flex-1"
                              />
                              <button
                                onClick={() => setEditingCell(null)}
                                className="btn btn-ghost p-1 touch-target"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div 
                              className="group cursor-pointer flex items-center gap-1 sm:gap-2 py-1 min-w-0"
                              onClick={() => setEditingCell({table: tableName, row: rowIndex, field: header})}
                            >
                              <span className="text-gray-200 truncate flex-1 max-w-[150px] sm:max-w-[200px]">
                                {String(row[header])}
                              </span>
                              <Edit className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity text-gray-400 flex-shrink-0" />
                            </div>
                          )}
                          
                          {cellErrors.length > 0 && (
                            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">!</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="table-cell">
                      {hasErrors ? (
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
                      ) : (
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {tableData.length > 100 && (
          <div className="border-t border-gray-800 p-3 sm:p-4 text-center text-xs sm:text-sm text-gray-400">
            Showing first 100 rows of {tableData.length} total rows
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { 
      id: 'clients', 
      label: 'Clients', 
      count: data.clients?.length || 0, 
      errors: getErrorsForTable('clients').length
    },
    { 
      id: 'workers', 
      label: 'Workers', 
      count: data.workers?.length || 0, 
      errors: getErrorsForTable('workers').length
    },
    { 
      id: 'tasks', 
      label: 'Tasks', 
      count: data.tasks?.length || 0, 
      errors: getErrorsForTable('tasks').length
    }
  ];

  const totalErrors = Object.values(data.validationErrors).flat().filter(error => 
    filterSeverity === 'all' || error.severity === filterSeverity
  ).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Data Management</h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Review, edit, and validate your data. Click any cell to edit inline.
        </p>
      </div>

      {/* Natural Language Search */}
      <NaturalLanguageSearch data={data} />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-lg transition-colors touch-target ${
              activeTab === tab.id
                ? 'bg-white text-black'
                : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span className="font-medium capitalize text-sm sm:text-base">{tab.label}</span>
            <span className="text-xs sm:text-sm">({tab.count})</span>
            {tab.errors > 0 && (
              <span className="badge badge-error text-xs">
                {tab.errors}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 p-3 sm:p-4 card">
        <div className="flex items-center gap-3 flex-1">
          <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input flex-1 text-sm"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as any)}
              className="input w-full sm:w-auto text-sm"
            >
              <option value="all">All Issues</option>
              <option value="error">Errors Only</option>
              <option value="warning">Warnings Only</option>
            </select>
          </div>

          <button
            onClick={() => setShowErrors(!showErrors)}
            className="btn btn-ghost touch-target"
          >
            {showErrors ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span className="ml-2 text-sm">Errors</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1 bg-gray-900 rounded-lg">
            <div className="status-dot error" />
            <span className="text-xs sm:text-sm text-white">{totalErrors} issues</span>
          </div>
        </div>
      </div>

      {/* Data Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderDataGrid(filteredData, activeTab)}
        </motion.div>
      </AnimatePresence>

      {/* Validation Summary */}
      {totalErrors > 0 && showErrors && (
        <div className="card border-red-800 bg-red-950/20">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-400 flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="card-title text-red-400 text-lg sm:text-xl">Validation Issues</h3>
                <p className="card-description text-sm">
                  {totalErrors} issues found that need attention
                </p>
              </div>
            </div>
          </div>
          
          <div className="card-content">
            <div className="space-y-3 sm:space-y-4 max-h-60 sm:max-h-80 overflow-y-auto">
              {Object.entries(data.validationErrors).map(([table, errors]) => 
                errors
                  .filter(error => filterSeverity === 'all' || error.severity === filterSeverity)
                  .slice(0, 10)
                  .map((error, idx) => (
                    <div
                      key={`${table}-${idx}`}
                      className={`p-3 sm:p-4 rounded-lg border ${
                        error.severity === 'error' 
                          ? 'border-red-800 bg-red-950/30' 
                          : 'border-yellow-800 bg-yellow-950/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          error.severity === 'error' ? 'text-red-400' : 'text-yellow-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white mb-1 text-sm sm:text-base">
                            {table.charAt(0).toUpperCase() + table.slice(1)} - Row {error.row + 1}
                          </div>
                          <div className="text-gray-300 text-xs sm:text-sm mb-2">{error.message}</div>
                          {error.suggestion && (
                            <div className="text-blue-400 text-xs sm:text-sm italic">
                              💡 {error.suggestion}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}