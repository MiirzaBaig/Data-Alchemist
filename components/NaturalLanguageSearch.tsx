'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Filter } from 'lucide-react';
import { ProcessedData } from '@/types';

interface NaturalLanguageSearchProps {
  data: ProcessedData;
}

export function NaturalLanguageSearch({ data }: NaturalLanguageSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeDataset, setActiveDataset] = useState<'clients' | 'workers' | 'tasks'>('tasks');

  const exampleQueries = [
    "All tasks having a Duration of more than 1 phase and having phase 2 in their Preferred Phases list",
    "Workers with qualification level above 7 and available in phase 1",
    "Clients with priority level 5 requesting more than 3 tasks",
    "Tasks requiring 'JavaScript' skill with duration less than 3 phases"
  ];

  const parseNaturalLanguage = (naturalQuery: string) => {
    const query = naturalQuery.toLowerCase();
    const filters: any = {};

    // Parse duration conditions
    if (query.includes('duration')) {
      const durationMatch = query.match(/duration\s*(>|<|>=|<=|=|of|more than|less than|equals?)\s*(\d+)/);
      if (durationMatch) {
        const operator = durationMatch[1];
        const value = parseInt(durationMatch[2]);
        
        if (operator.includes('more') || operator === '>') {
          filters.duration = (item: any) => item.Duration > value;
        } else if (operator.includes('less') || operator === '<') {
          filters.duration = (item: any) => item.Duration < value;
        } else if (operator.includes('=') || operator === 'of') {
          filters.duration = (item: any) => item.Duration === value;
        }
      }
    }

    // Parse phase conditions
    if (query.includes('phase')) {
      const phaseMatch = query.match(/phase\s*(\d+)/);
      if (phaseMatch) {
        const phaseNumber = parseInt(phaseMatch[1]);
        filters.phase = (item: any) => {
          if (item.PreferredPhases) {
            const phases = item.PreferredPhases.toString();
            if (phases.includes('-')) {
              const [start, end] = phases.split('-').map(p => parseInt(p.trim()));
              return phaseNumber >= start && phaseNumber <= end;
            } else {
              const phaseList = phases.split(',').map(p => parseInt(p.trim()));
              return phaseList.includes(phaseNumber);
            }
          }
          if (item.AvailableSlots) {
            const slots = item.AvailableSlots.split(',').map(s => parseInt(s.trim()));
            return slots.includes(phaseNumber);
          }
          return false;
        };
      }
    }

    // Parse skill conditions
    const skillMatch = query.match(/'([^']+)'|"([^"]+)"/);
    if (skillMatch) {
      const skill = skillMatch[1] || skillMatch[2];
      filters.skill = (item: any) => {
        const skills = item.Skills || item.RequiredSkills || '';
        return skills.toLowerCase().includes(skill.toLowerCase());
      };
    }

    // Parse priority level conditions
    if (query.includes('priority')) {
      const priorityMatch = query.match(/priority\s*level\s*(>|<|>=|<=|=|above|below|equals?)\s*(\d+)/);
      if (priorityMatch) {
        const operator = priorityMatch[1];
        const value = parseInt(priorityMatch[2]);
        
        if (operator.includes('above') || operator === '>') {
          filters.priority = (item: any) => item.PriorityLevel > value;
        } else if (operator.includes('below') || operator === '<') {
          filters.priority = (item: any) => item.PriorityLevel < value;
        } else if (operator.includes('=') || operator === 'equals') {
          filters.priority = (item: any) => item.PriorityLevel === value;
        }
      }
    }

    // Parse qualification level conditions
    if (query.includes('qualification')) {
      const qualMatch = query.match(/qualification\s*level\s*(>|<|>=|<=|=|above|below|equals?)\s*(\d+)/);
      if (qualMatch) {
        const operator = qualMatch[1];
        const value = parseInt(qualMatch[2]);
        
        if (operator.includes('above') || operator === '>') {
          filters.qualification = (item: any) => item.QualificationLevel > value;
        } else if (operator.includes('below') || operator === '<') {
          filters.qualification = (item: any) => item.QualificationLevel < value;
        } else if (operator.includes('=') || operator === 'equals') {
          filters.qualification = (item: any) => item.QualificationLevel === value;
        }
      }
    }

    // Parse task count conditions
    if (query.includes('requesting') && query.includes('task')) {
      const taskMatch = query.match(/requesting\s*(more than|less than|exactly|>|<|=)\s*(\d+)\s*tasks?/);
      if (taskMatch) {
        const operator = taskMatch[1];
        const count = parseInt(taskMatch[2]);
        
        filters.taskCount = (item: any) => {
          if (!item.RequestedTaskIDs) return false;
          const taskCount = item.RequestedTaskIDs.split(',').length;
          
          if (operator.includes('more') || operator === '>') {
            return taskCount > count;
          } else if (operator.includes('less') || operator === '<') {
            return taskCount < count;
          } else if (operator.includes('exactly') || operator === '=') {
            return taskCount === count;
          }
          return false;
        };
      }
    }

    return filters;
  };

  const applyFilters = (dataset: any[], filters: any) => {
    return dataset.filter(item => {
      return Object.values(filters).every((filterFn: any) => filterFn(item));
    });
  };

  const handleSearch = async (naturalQuery: string) => {
    if (!naturalQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filters = parseNaturalLanguage(naturalQuery);
      const dataset = data[activeDataset] || [];
      const filteredResults = applyFilters(dataset, filters);
      
      setResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    // Auto-detect dataset based on query
    if (example.includes('worker')) {
      setActiveDataset('workers');
    } else if (example.includes('client')) {
      setActiveDataset('clients');
    } else {
      setActiveDataset('tasks');
    }
    handleSearch(example);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-xl p-6 border border-indigo-500/20">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          <h3 className="text-xl font-semibold text-white">Natural Language Search</h3>
        </div>
        
        <div className="space-y-4">
          {/* Dataset Selector */}
          <div className="flex gap-2">
            {(['clients', 'workers', 'tasks'] as const).map(dataset => (
              <button
                key={dataset}
                onClick={() => setActiveDataset(dataset)}
                className={`px-4 py-2 rounded-lg capitalize transition-all duration-300 ${
                  activeDataset === dataset
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {dataset}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {isSearching ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </motion.div>
              ) : (
                <Search className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <input
              type="text"
              placeholder="Describe what you're looking for in plain English..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
              className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-indigo-500/30 rounded-lg text-white placeholder-gray-400 focus:border-indigo-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={() => handleSearch(query)}
            disabled={isSearching || !query.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-medium text-white hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isSearching ? '🔍 Searching...' : '🤖 Search with AI'}
          </button>
        </div>

        {/* Example Queries */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Example Queries:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {exampleQueries.map((example, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleClick(example)}
                className="text-left p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-sm text-gray-300 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
          >
            <div className="p-4 bg-gray-800/50 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-green-400" />
                <span className="font-medium text-white">Search Results</span>
                <span className="text-sm text-green-400 bg-green-500/20 px-2 py-1 rounded">
                  {results.length} found
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {results.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {Object.entries(item).slice(0, 4).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-gray-400 capitalize">{key}:</span>
                          <div className="text-white font-medium">{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {query && results.length === 0 && !isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-400"
        >
          No results found for your query. Try rephrasing or using different keywords.
        </motion.div>
      )}
    </div>
  );
}