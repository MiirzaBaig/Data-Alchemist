'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, Link, Users, Clock, Zap, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Rule, ProcessedData } from '@/types';
import { NaturalLanguageRuleConverter } from './NaturalLanguageRuleConverter';

interface RuleBuilderProps {
  rules: Rule[];
  onRulesUpdate: (rules: Rule[]) => void;
  data?: ProcessedData | null;
}

export function RuleBuilder({ rules, onRulesUpdate, data }: RuleBuilderProps) {
  const [activeRuleType, setActiveRuleType] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  const ruleTypes = [
    {
      id: 'coRun',
      name: 'Co-Run Rules',
      icon: <Link className="w-5 h-5 sm:w-6 sm:h-6" />,
      description: 'Tasks that must run together',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'slotRestriction',
      name: 'Slot Restrictions',
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
      description: 'Minimum common slots for groups',
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'loadLimit',
      name: 'Load Limits',
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      description: 'Maximum workload per phase',
      color: 'from-green-600 to-teal-600'
    },
    {
      id: 'phaseWindow',
      name: 'Phase Windows',
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
      description: 'Time-based execution constraints',
      color: 'from-orange-600 to-red-600'
    }
  ];

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addCoRunRule = (taskIds: string[]) => {
    const newRule: Rule = {
      id: generateId(),
      type: 'coRun',
      description: `Tasks ${taskIds.join(', ')} must run together`,
      parameters: { taskIds },
      enabled: true,
      createdAt: new Date()
    };
    onRulesUpdate([...rules, newRule]);
  };

  const addSlotRestrictionRule = (group: string, minSlots: number) => {
    const newRule: Rule = {
      id: generateId(),
      type: 'slotRestriction',
      description: `Group ${group} requires minimum ${minSlots} common slots`,
      parameters: { group, minCommonSlots: minSlots },
      enabled: true,
      createdAt: new Date()
    };
    onRulesUpdate([...rules, newRule]);
  };

  const addLoadLimitRule = (workerGroup: string, maxSlots: number) => {
    const newRule: Rule = {
      id: generateId(),
      type: 'loadLimit',
      description: `Group ${workerGroup} limited to ${maxSlots} slots per phase`,
      parameters: { workerGroup, maxSlotsPerPhase: maxSlots },
      enabled: true,
      createdAt: new Date()
    };
    onRulesUpdate([...rules, newRule]);
  };

  const toggleRule = (ruleId: string) => {
    const updatedRules = rules.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    );
    onRulesUpdate(updatedRules);
  };

  const deleteRule = (ruleId: string) => {
    onRulesUpdate(rules.filter(rule => rule.id !== ruleId));
  };

  const renderRuleConfigPanel = () => {
    if (!activeRuleType) return null;

    const ruleType = ruleTypes.find(rt => rt.id === activeRuleType);
    if (!ruleType) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-3">
          {ruleType.icon}
          <span className="truncate">Configure {ruleType.name}</span>
        </h3>

        {activeRuleType === 'coRun' && (
          <CoRunRuleForm onSubmit={addCoRunRule} data={data} />
        )}

        {activeRuleType === 'slotRestriction' && (
          <SlotRestrictionForm onSubmit={addSlotRestrictionRule} data={data} />
        )}

        {activeRuleType === 'loadLimit' && (
          <LoadLimitForm onSubmit={addLoadLimitRule} data={data} />
        )}

        <button
          onClick={() => setActiveRuleType(null)}
          className="mt-4 px-4 py-2 border border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors touch-target"
        >
          Cancel
        </button>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Business Rules Configuration
        </h2>
        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto px-4">
          Define intelligent rules that govern resource allocation. Use natural language or visual configuration.
        </p>
      </div>

      {/* Natural Language Rule Converter */}
      <NaturalLanguageRuleConverter onRuleCreated={(rule) => onRulesUpdate([...rules, rule])} />

      {/* Rule Type Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {ruleTypes.map((ruleType, index) => (
          <motion.button
            key={ruleType.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setActiveRuleType(ruleType.id)}
            className={`p-4 sm:p-6 rounded-xl bg-gradient-to-br ${ruleType.color}/20 border border-gray-700 hover:border-gray-600 transition-all duration-300 text-left group touch-target`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`text-2xl sm:text-3xl mb-3 sm:mb-4 p-2 sm:p-3 rounded-lg bg-gradient-to-br ${ruleType.color}/20 inline-block`}>
              {ruleType.icon}
            </div>
            <h3 className="font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors text-sm sm:text-base">
              {ruleType.name}
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">{ruleType.description}</p>
            <div className="flex items-center gap-2 text-purple-400">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Add Rule</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Rule Configuration Panel */}
      <AnimatePresence>
        {renderRuleConfigPanel()}
      </AnimatePresence>

      {/* Active Rules List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xl sm:text-2xl font-semibold text-white">Active Rules</h3>
          <span className="text-xs sm:text-sm text-gray-400">
            {rules.filter(r => r.enabled).length} of {rules.length} enabled
          </span>
        </div>

        {rules.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-400">
            <Settings className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
            <p className="text-base sm:text-lg">No rules configured yet</p>
            <p className="text-xs sm:text-sm">Add your first rule using the panels above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 ${
                  rule.enabled 
                    ? 'bg-green-500/5 border-green-500/30' 
                    : 'bg-gray-500/5 border-gray-600'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    rule.enabled 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {ruleTypes.find(rt => rt.id === rule.type)?.icon || <Settings className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h4 className="font-semibold text-white capitalize text-sm sm:text-base">
                        {rule.type.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium self-start ${
                        rule.enabled 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {rule.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-3 text-xs sm:text-sm">{rule.description}</p>
                    
                    {/* Rule Parameters */}
                    <div className="text-xs sm:text-sm text-gray-400 bg-gray-900/50 rounded-lg p-2 sm:p-3 overflow-x-auto">
                      <strong>Parameters:</strong>
                      <pre className="mt-1 whitespace-pre-wrap break-all">
                        {JSON.stringify(rule.parameters, null, 2)}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className="p-2 rounded-lg hover:bg-gray-700 transition-colors touch-target"
                    >
                      {rule.enabled ? (
                        <ToggleRight className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingRule(rule)}
                      className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-blue-400 touch-target"
                    >
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="p-2 rounded-lg hover:bg-red-500/20 transition-colors text-red-400 touch-target"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Rule Configuration Forms
function CoRunRuleForm({ onSubmit, data }: { onSubmit: (taskIds: string[]) => void; data?: ProcessedData | null }) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const availableTasks = data?.tasks || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Tasks to Run Together
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 sm:max-h-60 overflow-y-auto">
          {availableTasks.map(task => (
            <label key={task.TaskID} className="flex items-center gap-2 p-2 rounded border border-gray-700 hover:border-gray-600 touch-target">
              <input
                type="checkbox"
                checked={selectedTasks.includes(task.TaskID)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTasks([...selectedTasks, task.TaskID]);
                  } else {
                    setSelectedTasks(selectedTasks.filter(id => id !== task.TaskID));
                  }
                }}
                className="rounded border-gray-600"
              />
              <span className="text-xs sm:text-sm text-gray-300 truncate">{task.TaskID}</span>
            </label>
          ))}
        </div>
      </div>
      
      <button
        onClick={() => onSubmit(selectedTasks)}
        disabled={selectedTasks.length < 2}
        className="w-full px-6 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target"
      >
        Create Co-Run Rule ({selectedTasks.length} tasks)
      </button>
    </div>
  );
}

function SlotRestrictionForm({ onSubmit, data }: { onSubmit: (group: string, minSlots: number) => void; data?: ProcessedData | null }) {
  const [group, setGroup] = useState('');
  const [minSlots, setMinSlots] = useState(1);

  const availableGroups = [...new Set(data?.workers?.map(w => w.WorkerGroup).filter(Boolean) || [])];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Worker Group</label>
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none touch-target"
        >
          <option value="">Select a group</option>
          {availableGroups.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Common Slots</label>
        <input
          type="number"
          min="1"
          value={minSlots}
          onChange={(e) => setMinSlots(parseInt(e.target.value))}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none touch-target"
        />
      </div>
      
      <button
        onClick={() => onSubmit(group, minSlots)}
        disabled={!group}
        className="w-full px-6 py-3 bg-purple-600 rounded-lg text-white font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target"
      >
        Create Slot Restriction Rule
      </button>
    </div>
  );
}

function LoadLimitForm({ onSubmit, data }: { onSubmit: (workerGroup: string, maxSlots: number) => void; data?: ProcessedData | null }) {
  const [workerGroup, setWorkerGroup] = useState('');
  const [maxSlots, setMaxSlots] = useState(1);

  const availableGroups = [...new Set(data?.workers?.map(w => w.WorkerGroup).filter(Boolean) || [])];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Worker Group</label>
        <select
          value={workerGroup}
          onChange={(e) => setWorkerGroup(e.target.value)}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none touch-target"
        >
          <option value="">Select a group</option>
          {availableGroups.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Max Slots Per Phase</label>
        <input
          type="number"
          min="1"
          value={maxSlots}
          onChange={(e) => setMaxSlots(parseInt(e.target.value))}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none touch-target"
        />
      </div>
      
      <button
        onClick={() => onSubmit(workerGroup, maxSlots)}
        disabled={!workerGroup}
        className="w-full px-6 py-3 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target"
      >
        Create Load Limit Rule
      </button>
    </div>
  );
}