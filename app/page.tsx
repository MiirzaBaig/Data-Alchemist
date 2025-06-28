'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUploadZone } from '@/components/FileUploadZone';
import { DataManagement } from '@/components/DataManagement';
import { RuleBuilder } from '@/components/RuleBuilder';
import { PrioritizationPanel } from '@/components/PrioritizationPanel';
import { ExportSystem } from '@/components/ExportSystem';
import { Documentation } from '@/components/Documentation';
import { LandingPage } from '@/components/LandingPage';
import { 
  Upload, 
  Database, 
  Settings, 
  Zap, 
  Download, 
  Menu, 
  X,
  ChevronRight,
  Sparkles,
  Book,
  HelpCircle,
  Home
} from 'lucide-react';
import { ProcessedData, Rule, OptimizationWeights } from '@/types';

export default function HomePage() {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [weights, setWeights] = useState<OptimizationWeights>({
    priorityLevel: 0.3,
    taskFulfillment: 0.25,
    fairness: 0.2,
    efficiency: 0.15,
    workloadBalance: 0.1
  });
  const [activeSection, setActiveSection] = useState<'landing' | 'upload' | 'data' | 'rules' | 'priorities' | 'export' | 'docs'>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleDataProcessed = (processedData: ProcessedData) => {
    setData(processedData);
    setActiveSection('data');
  };

  const handleGetStarted = () => {
    setActiveSection('upload');
  };

  // Listen for documentation navigation events from landing page
  useEffect(() => {
    const handleDocsNavigation = () => {
      setActiveSection('docs');
    };

    window.addEventListener('navigate-to-docs', handleDocsNavigation);
    return () => window.removeEventListener('navigate-to-docs', handleDocsNavigation);
  }, []);

  const navigationItems = [
    { 
      id: 'landing', 
      label: 'Home', 
      icon: Home,
      description: 'Landing page'
    },
    { 
      id: 'upload', 
      label: 'Upload Data', 
      icon: Upload,
      description: 'Import your CSV/Excel files'
    },
    { 
      id: 'data', 
      label: 'Data Management', 
      icon: Database,
      description: 'Review and validate data'
    },
    { 
      id: 'rules', 
      label: 'Business Rules', 
      icon: Settings,
      description: 'Configure allocation rules'
    },
    { 
      id: 'priorities', 
      label: 'Optimization', 
      icon: Zap,
      description: 'Set priority weights'
    },
    { 
      id: 'export', 
      label: 'Export', 
      icon: Download,
      description: 'Download results'
    },
    { 
      id: 'docs', 
      label: 'Documentation', 
      icon: Book,
      description: 'Technical documentation'
    }
  ];

  const currentStep = navigationItems.findIndex(item => item.id === activeSection);
  const workflowSteps = navigationItems.slice(1, -1); // Exclude landing and docs

  // Show landing page without sidebar
  if (activeSection === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/80 backdrop-blur-sm">
        <div className="container flex h-14 sm:h-16 items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-ghost p-2 lg:hidden touch-target"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <button
              onClick={() => setActiveSection('landing')}
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-white">
                <Sparkles className="h-3 w-3 sm:h-5 sm:w-5 text-black" />
              </div>
              <div>
                <h1 className="text-sm sm:text-lg font-semibold text-white">Data Alchemist</h1>
                <p className="text-xs text-gray-400 hidden sm:block">AI Resource Allocation</p>
              </div>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400">
            {activeSection !== 'docs' && (
              <>
                <span className="text-xs sm:text-sm">Step {Math.max(0, currentStep - 1)} of {workflowSteps.length}</span>
                <div className="flex items-center gap-1">
                  {workflowSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 w-4 sm:w-6 rounded-full transition-colors ${
                        index < Math.max(0, currentStep - 1) ? 'bg-white' : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('docs')}
              className="btn btn-ghost p-2 touch-target"
              title="Documentation"
            >
              <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm">
              <div className="status-dot success" />
              <span className="text-gray-400">System Ready</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 sm:w-72 transform border-r border-gray-800 bg-black transition-transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 pt-16 lg:pt-4 safe-area-inset-top">
              <nav className="space-y-1 sm:space-y-2">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  const isCompleted = index < currentStep && item.id !== 'docs';
                  const isDisabled = !data && !['upload', 'docs', 'landing'].includes(item.id);
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (!isDisabled) {
                          setActiveSection(item.id as any);
                          setSidebarOpen(false);
                        }
                      }}
                      disabled={isDisabled}
                      className={`nav-item w-full touch-target ${isActive ? 'active' : ''} ${
                        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-white text-black' 
                            : isCompleted 
                            ? 'bg-gray-800 text-green-400' 
                            : 'bg-gray-900 text-gray-400'
                        }`}>
                          <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-medium text-sm sm:text-base truncate">{item.label}</div>
                          <div className="text-xs text-gray-500 truncate">{item.description}</div>
                        </div>
                        {isActive && <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="border-t border-gray-800 p-3 sm:p-4 safe-area-inset-bottom">
              {activeSection !== 'docs' && (
                <div className="text-xs text-gray-500">
                  <div className="mb-2">Progress: {Math.round((Math.max(0, currentStep - 1) / workflowSteps.length) * 100)}%</div>
                  <div className="progress">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${(Math.max(0, currentStep - 1) / workflowSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {activeSection === 'docs' ? (
              <Documentation />
            ) : (
              <div className="container py-4 sm:py-6 lg:py-8 safe-area-inset-left safe-area-inset-right">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="animate-in"
                  >
                    {activeSection === 'upload' && (
                      <FileUploadZone onDataProcessed={handleDataProcessed} />
                    )}
                    
                    {activeSection === 'data' && data && (
                      <DataManagement data={data} onDataUpdate={setData} />
                    )}
                    
                    {activeSection === 'rules' && (
                      <RuleBuilder rules={rules} onRulesUpdate={setRules} data={data} />
                    )}
                    
                    {activeSection === 'priorities' && (
                      <PrioritizationPanel weights={weights} onWeightsUpdate={setWeights} />
                    )}
                    
                    {activeSection === 'export' && data && (
                      <ExportSystem data={data} rules={rules} weights={weights} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}