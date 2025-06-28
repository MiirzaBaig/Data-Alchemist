'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  Code, 
  Database, 
  Settings, 
  Zap, 
  Download, 
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Play,
  AlertTriangle,
  Sparkles,
  Search,
  Filter,
  Star,
  ArrowRight,
  Lightbulb,
  Target,
  Rocket,
  Shield,
  Brain,
  Layers
} from 'lucide-react';

export function Documentation() {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const documentationSections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Book,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      subsections: [
        { id: 'what-is', title: 'What is Data Alchemist?', description: 'Introduction to the platform' },
        { id: 'features', title: 'Key Features', description: 'Core capabilities overview' },
        { id: 'architecture', title: 'System Architecture', description: 'Technical foundation' }
      ]
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Rocket,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      subsections: [
        { id: 'quick-start', title: 'Quick Start Guide', description: '5-minute setup tutorial' },
        { id: 'data-format', title: 'Data Format Requirements', description: 'File structure specifications' },
        { id: 'sample-data', title: 'Sample Data', description: 'Download example files' }
      ]
    },
    {
      id: 'data-management',
      title: 'Data Management',
      icon: Database,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      subsections: [
        { id: 'upload', title: 'File Upload', description: 'Data import process' },
        { id: 'validation', title: 'Validation Engine', description: 'AI-powered data validation' },
        { id: 'editing', title: 'Inline Editing', description: 'Real-time data modification' },
        { id: 'search', title: 'Natural Language Search', description: 'AI search capabilities' }
      ]
    },
    {
      id: 'business-rules',
      title: 'Business Rules',
      icon: Settings,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      subsections: [
        { id: 'rule-types', title: 'Rule Types', description: 'Available rule categories' },
        { id: 'natural-language', title: 'Natural Language Rules', description: 'AI rule conversion' },
        { id: 'rule-management', title: 'Rule Management', description: 'Creating and editing rules' }
      ]
    },
    {
      id: 'optimization',
      title: 'Optimization',
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      subsections: [
        { id: 'weights', title: 'Priority Weights', description: 'Optimization configuration' },
        { id: 'presets', title: 'Optimization Presets', description: 'Pre-configured settings' },
        { id: 'algorithms', title: 'Allocation Algorithms', description: 'Technical implementation' }
      ]
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: Code,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/30',
      subsections: [
        { id: 'data-types', title: 'Data Types', description: 'TypeScript interfaces' },
        { id: 'validation-api', title: 'Validation API', description: 'Validation methods' },
        { id: 'export-api', title: 'Export API', description: 'Data export functions' }
      ]
    }
  ];

  const CodeBlock = ({ code, language = 'typescript', id, title }: { code: string; language?: string; id: string; title?: string }) => (
    <div className="relative bg-gray-950/80 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900/80 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
            <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          </div>
          {title && <span className="text-sm text-gray-300 font-medium">{title}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono px-2 py-1 bg-gray-800 rounded">{language}</span>
          <button
            onClick={() => copyToClipboard(code, id)}
            className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors group"
          >
            {copiedCode === id ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-gray-400 group-hover:text-white" />
            )}
          </button>
        </div>
      </div>
      <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  const InfoCard = ({ icon, title, description, color = "blue" }: { icon: React.ReactNode; title: string; description: string; color?: string }) => (
    <div className={`p-4 rounded-xl border bg-${color}-500/5 border-${color}-500/20`}>
      <div className={`flex items-center gap-3 mb-2 text-${color}-400`}>
        {icon}
        <h4 className="font-semibold text-white">{title}</h4>
      </div>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'what-is':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Brain className="h-8 w-8 text-blue-400" />
                What is Data Alchemist?
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  Data Alchemist is a revolutionary AI-powered platform that transforms chaotic spreadsheet data 
                  into intelligent, optimized resource allocation systems. It combines advanced machine learning, 
                  natural language processing, and optimization algorithms to create production-ready allocation solutions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                icon={<Sparkles className="h-5 w-5" />}
                title="AI-Powered Intelligence"
                description="Advanced machine learning algorithms automatically analyze data patterns and optimize resource allocation with minimal human intervention."
                color="purple"
              />
              <InfoCard
                icon={<Shield className="h-5 w-5" />}
                title="Enterprise-Grade Security"
                description="Built with security-first principles, ensuring your sensitive data remains protected throughout the entire processing pipeline."
                color="green"
              />
              <InfoCard
                icon={<Layers className="h-5 w-5" />}
                title="Scalable Architecture"
                description="Designed to handle everything from small team allocations to enterprise-wide resource management with thousands of entities."
                color="blue"
              />
              <InfoCard
                icon={<Target className="h-5 w-5" />}
                title="Production Ready"
                description="Generate clean, validated data and configuration files ready for immediate deployment in your production environment."
                color="orange"
              />
            </div>

            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-blue-500/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Rocket className="h-6 w-6 text-blue-400" />
                Core Capabilities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-400 rounded-full" />
                    <span className="text-gray-300">AI-powered data validation with 12+ built-in rules</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-400 rounded-full" />
                    <span className="text-gray-300">Natural language rule creation and conversion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-400 rounded-full" />
                    <span className="text-gray-300">Real-time data editing with instant validation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-400 rounded-full" />
                    <span className="text-gray-300">Multi-objective optimization engine</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-400 rounded-full" />
                    <span className="text-gray-300">Cross-reference validation and error detection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-400 rounded-full" />
                    <span className="text-gray-300">Customizable optimization weight configuration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-400 rounded-full" />
                    <span className="text-gray-300">Clean data export with validation reports</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-400 rounded-full" />
                    <span className="text-gray-300">Production-ready configuration output</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'quick-start':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Rocket className="h-8 w-8 text-green-400" />
                Quick Start Guide
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Get up and running with Data Alchemist in just 5 minutes. Follow this step-by-step guide to transform your first dataset.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: 'Prepare Your Data Files',
                  description: 'Organize your data into three separate files with the correct naming convention',
                  icon: <FileText className="h-6 w-6" />,
                  color: 'blue',
                  code: `// Required file structure:
clients.csv - Client information with priorities and task requests
workers.csv - Worker skills, availability, and capacity information  
tasks.csv - Task definitions with requirements and constraints

// File naming patterns (auto-detected):
*client* → clients.csv (e.g., "client_data.csv", "clients_2024.xlsx")
*worker* → workers.csv (e.g., "worker_info.csv", "team_workers.xlsx")
*task* → tasks.csv (e.g., "task_list.csv", "project_tasks.xlsx")`,
                  tips: [
                    'Use descriptive file names that include the keywords',
                    'Both CSV and Excel formats are supported',
                    'Ensure column headers match our template format'
                  ]
                },
                {
                  step: 2,
                  title: 'Upload and Auto-Detection',
                  description: 'Drag and drop your files or use the file browser. Our AI automatically categorizes them',
                  icon: <Database className="h-6 w-6" />,
                  color: 'purple',
                  code: `// Upload methods supported:
1. Drag & Drop - Simply drag files onto the upload zone
2. File Browser - Click "Browse Files" to select multiple files
3. Individual Upload - Use specific file type cards

// Auto-detection process:
- File name analysis for category detection
- Content structure validation
- Format compatibility check
- Data type inference`,
                  tips: [
                    'Files are processed immediately upon upload',
                    'Multiple files can be uploaded simultaneously',
                    'Real-time progress indicators show upload status'
                  ]
                },
                {
                  step: 3,
                  title: 'AI Validation & Analysis',
                  description: 'Our advanced validation engine automatically checks your data for errors and inconsistencies',
                  icon: <Brain className="h-6 w-6" />,
                  color: 'green',
                  code: `// Validation categories:
Data Quality Checks:
- Missing required fields detection
- Duplicate identifier validation
- Data type consistency verification
- Range and format validation

Cross-Reference Validation:
- Task ID existence verification
- Skill coverage analysis
- Capacity vs. workload assessment
- Priority distribution analysis`,
                  tips: [
                    'Validation runs automatically in the background',
                    'Errors are categorized by severity (error vs. warning)',
                    'Actionable suggestions provided for each issue'
                  ]
                },
                {
                  step: 4,
                  title: 'Configure Business Rules',
                  description: 'Set up intelligent allocation rules using natural language or visual configuration',
                  icon: <Settings className="h-6 w-6" />,
                  color: 'orange',
                  code: `// Natural language examples:
"Tasks T12 and T14 should always run together"
→ Converts to Co-Run Rule

"Sales workers should not work more than 3 phases each"
→ Converts to Load Limit Rule

"High priority tasks must be completed in phase 1 or 2"
→ Converts to Phase Window Rule

// Visual rule builder also available for complex configurations`,
                  tips: [
                    'Start with natural language for quick setup',
                    'Use visual builder for complex rule combinations',
                    'Rules can be enabled/disabled individually'
                  ]
                },
                {
                  step: 5,
                  title: 'Export Production-Ready Results',
                  description: 'Download cleaned data and configuration files ready for immediate deployment',
                  icon: <Download className="h-6 w-6" />,
                  color: 'pink',
                  code: `// Export package includes:
Data Files:
- clients_cleaned.csv - Validated and corrected client data
- workers_cleaned.csv - Processed worker information
- tasks_cleaned.csv - Optimized task definitions

Configuration Files:
- rules_config.json - Business rules and optimization settings
- validation_report.json - Comprehensive quality assessment

// All files are production-ready and deployment-optimized`,
                  tips: [
                    'Export is only available after validation passes',
                    'All files include comprehensive metadata',
                    'Configuration files are version-controlled'
                  ]
                }
              ].map((step) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: step.step * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className={`h-12 w-12 bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`text-${step.color}-400`}>
                            {step.icon}
                          </div>
                          <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                        </div>
                        <p className="text-gray-300 mb-6">{step.description}</p>
                        
                        <div className="space-y-4">
                          <CodeBlock 
                            code={step.code} 
                            language="javascript" 
                            id={`step-${step.step}`}
                            title={`Step ${step.step} Implementation`}
                          />
                          
                          <div className={`bg-${step.color}-500/10 border border-${step.color}-500/20 rounded-xl p-4`}>
                            <h4 className={`font-semibold text-${step.color}-400 mb-3 flex items-center gap-2`}>
                              <Lightbulb className="h-4 w-4" />
                              Pro Tips
                            </h4>
                            <ul className="space-y-2">
                              {step.tips.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                                  <div className={`h-1.5 w-1.5 rounded-full bg-${step.color}-400 mt-2 flex-shrink-0`}></div>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-2xl p-8 border border-green-500/20">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Star className="h-6 w-6 text-green-400" />
                Congratulations!
              </h3>
              <p className="text-gray-300 mb-4">
                You've successfully completed the quick start guide. Your data is now optimized and ready for production use.
              </p>
              <div className="flex items-center gap-2 text-green-400">
                <ArrowRight className="h-4 w-4" />
                <span className="font-medium">Next: Explore advanced features and customization options</span>
              </div>
            </div>
          </div>
        );

      case 'data-format':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Database className="h-8 w-8 text-purple-400" />
                Data Format Requirements
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Detailed specifications for each data file format to ensure optimal processing and validation.
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  title: 'Clients Data (clients.csv)',
                  description: 'Client information with priorities, task requests, and organizational details',
                  icon: <Users className="h-6 w-6" />,
                  color: 'blue',
                  schema: `interface ClientData {
  ClientID: string;          // Unique identifier (required)
  ClientName: string;        // Display name (required)
  PriorityLevel: number;     // 1-5 scale, 5 = highest priority (required)
  RequestedTaskIDs: string;  // Comma-separated task IDs
  GroupTag: string;          // Client grouping/category
  AttributesJSON: string;    // JSON metadata for custom properties
}`,
                  example: `ClientID,ClientName,PriorityLevel,RequestedTaskIDs,GroupTag,AttributesJSON
C001,Acme Corporation,5,"T001,T002,T003",Enterprise,"{""budget"":50000,""region"":""North""}"
C002,Beta Industries,3,"T004,T005",SMB,"{""budget"":25000,""region"":""South""}"
C003,Gamma Solutions,4,"T001,T006",Enterprise,"{""budget"":75000,""region"":""East""}"
C004,Delta Ventures,2,"T007",Startup,"{""budget"":10000,""region"":""West""}"`,
                  requirements: [
                    'ClientID must be unique across all clients',
                    'PriorityLevel must be between 1-5 (integer)',
                    'RequestedTaskIDs should reference valid task IDs',
                    'AttributesJSON must be valid JSON format'
                  ]
                },
                {
                  title: 'Workers Data (workers.csv)',
                  description: 'Worker skills, availability, capacity, and qualification information',
                  icon: <Users className="h-6 w-6" />,
                  color: 'green',
                  schema: `interface WorkerData {
  WorkerID: string;          // Unique identifier (required)
  WorkerName: string;        // Display name (required)
  Skills: string;            // Comma-separated skills (required)
  AvailableSlots: string;    // Comma-separated phase numbers
  MaxLoadPerPhase: number;   // Maximum concurrent tasks per phase
  WorkerGroup: string;       // Worker team/department grouping
  QualificationLevel: number; // 1-10 skill level scale
}`,
                  example: `WorkerID,WorkerName,Skills,AvailableSlots,MaxLoadPerPhase,WorkerGroup,QualificationLevel
W001,John Doe,"JavaScript,React,Node.js","1,2,3",2,Frontend,8
W002,Jane Smith,"Python,Django,PostgreSQL","2,3,4",3,Backend,9
W003,Bob Johnson,"AWS,Docker,Kubernetes","1,3,5",2,DevOps,7
W004,Alice Brown,"UI/UX,Figma,Adobe XD","1,2,4",1,Design,6`,
                  requirements: [
                    'WorkerID must be unique across all workers',
                    'Skills should be comma-separated without quotes',
                    'AvailableSlots must be valid phase numbers',
                    'MaxLoadPerPhase must be positive integer'
                  ]
                },
                {
                  title: 'Tasks Data (tasks.csv)',
                  description: 'Task definitions with requirements, constraints, and execution parameters',
                  icon: <FileText className="h-6 w-6" />,
                  color: 'purple',
                  schema: `interface TaskData {
  TaskID: string;            // Unique identifier (required)
  TaskName: string;          // Display name (required)
  Category: string;          // Task category/type
  Duration: number;          // Number of phases required (required)
  RequiredSkills: string;    // Comma-separated required skills (required)
  PreferredPhases: string;   // Phase list or range (e.g., "1,2,3" or "1-3")
  MaxConcurrent: number;     // Maximum parallel instances allowed
}`,
                  example: `TaskID,TaskName,Category,Duration,RequiredSkills,PreferredPhases,MaxConcurrent
T001,Frontend Development,Development,3,"JavaScript,React","1-3",2
T002,API Integration,Backend,2,"Python,REST","2,3",1
T003,Database Design,Backend,4,"PostgreSQL,SQL","1,2",1
T004,UI/UX Design,Design,2,"UI/UX,Figma","1,4",2
T005,DevOps Setup,Infrastructure,3,"AWS,Docker","3,4,5",1`,
                  requirements: [
                    'TaskID must be unique across all tasks',
                    'Duration must be positive integer',
                    'RequiredSkills should match worker skills',
                    'PreferredPhases can be list or range format'
                  ]
                }
              ].map((format, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-br from-${format.color}-500 to-${format.color}-600`}>
                        {format.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{format.title}</h3>
                        <p className="text-gray-400">{format.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          TypeScript Interface
                        </h4>
                        <CodeBlock 
                          code={format.schema} 
                          language="typescript" 
                          id={`schema-${index}`}
                          title="Data Structure Definition"
                        />
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Example CSV Data
                        </h4>
                        <CodeBlock 
                          code={format.example} 
                          language="csv" 
                          id={`example-${index}`}
                          title="Sample Data Format"
                        />
                      </div>
                      
                      <div className={`bg-${format.color}-500/10 border border-${format.color}-500/20 rounded-xl p-4`}>
                        <h4 className={`font-semibold text-${format.color}-400 mb-3 flex items-center gap-2`}>
                          <AlertTriangle className="h-4 w-4" />
                          Validation Requirements
                        </h4>
                        <ul className="space-y-2">
                          {format.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                              <div className={`h-1.5 w-1.5 rounded-full bg-${format.color}-400 mt-2 flex-shrink-0`}></div>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Welcome to Data Alchemist
                <span className="block text-2xl text-purple-400 mt-2">Documentation Center</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive guides, tutorials, and API references to help you master AI-powered resource allocation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentationSections.map((section) => {
                const Icon = section.icon;
                return (
                  <motion.button
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setActiveSection(section.subsections[0].id)}
                    className={`text-left p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${section.bgColor} ${section.borderColor} hover:border-opacity-50 group`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-300`}>
                        <Icon className={`h-6 w-6 ${section.color}`} />
                      </div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-gray-100">{section.title}</h3>
                    </div>
                    <div className="space-y-2">
                      {section.subsections.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300">
                          <ChevronRight className="h-3 w-3" />
                          <span>{sub.title}</span>
                        </div>
                      ))}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Rocket className="h-6 w-6 text-purple-400" />
                Quick Navigation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">New Users</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveSection('quick-start')}
                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span>Quick Start Guide</span>
                    </button>
                    <button
                      onClick={() => setActiveSection('data-format')}
                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span>Data Format Requirements</span>
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Advanced Users</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveSection('data-types')}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span>API Reference</span>
                    </button>
                    <button
                      onClick={() => setActiveSection('rule-types')}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span>Business Rules</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const filteredSections = documentationSections.filter(section =>
    searchQuery === '' || 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.subsections.some(sub => 
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="flex h-full bg-gray-950">
      {/* Enhanced Documentation Sidebar */}
      <div className="w-80 border-r border-gray-700 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
              <Book className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Documentation</h2>
              <p className="text-xs text-gray-400">Comprehensive guides & API reference</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>

          <nav className="space-y-2">
            {filteredSections.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSections.includes(section.id);
              
              return (
                <div key={section.id}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-gray-800 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${section.bgColor} ${section.borderColor} border`}>
                        <Icon className={`h-4 w-4 ${section.color}`} />
                      </div>
                      <div className="text-left">
                        <span className="text-gray-200 font-medium text-sm">{section.title}</span>
                        <div className="text-xs text-gray-500">{section.subsections.length} articles</div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-300" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-6 mt-2 space-y-1">
                          {section.subsections.map((subsection) => (
                            <button
                              key={subsection.id}
                              onClick={() => setActiveSection(subsection.id)}
                              className={`block w-full text-left p-3 rounded-lg text-sm transition-all duration-300 ${
                                activeSection === subsection.id
                                  ? `${section.bgColor} ${section.borderColor} border text-white`
                                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                              }`}
                            >
                              <div className="font-medium">{subsection.title}</div>
                              <div className="text-xs text-gray-500 mt-1">{subsection.description}</div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Enhanced Documentation Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}