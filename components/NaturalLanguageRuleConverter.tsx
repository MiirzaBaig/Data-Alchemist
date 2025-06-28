'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, X } from 'lucide-react';
import { Rule } from '@/types';

interface NaturalLanguageRuleConverterProps {
  onRuleCreated: (rule: Rule) => void;
}

export function NaturalLanguageRuleConverter({ onRuleCreated }: NaturalLanguageRuleConverterProps) {
  const [ruleDescription, setRuleDescription] = useState('');
  const [suggestedRule, setSuggestedRule] = useState<Rule | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const exampleRules = [
    "Tasks T12 and T14 should always run together",
    "Sales workers should not work more than 3 phases each",
    "Development group requires minimum 2 common time slots",
    "High priority tasks must be completed in phase 1 or 2"
  ];

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const parseRuleIntent = async (description: string) => {
    const desc = description.toLowerCase();

    // Co-run rule detection
    if ((desc.includes('together') || desc.includes('same time')) && desc.includes('task')) {
      const taskMatches = description.match(/t\d+/gi);
      if (taskMatches && taskMatches.length >= 2) {
        return {
          type: 'coRun',
          taskIds: taskMatches,
          confidence: 0.9
        };
      }
    }

    // Load limit rule detection
    if (desc.includes('not work more than') || desc.includes('maximum') || desc.includes('limit')) {
      const numberMatch = description.match(/(\d+)/);
      const groupMatch = description.match(/([\w\s]+?)\s+(?:workers?|group)/i);
      
      if (numberMatch && groupMatch) {
        return {
          type: 'loadLimit',
          group: groupMatch[1].trim(),
          limit: parseInt(numberMatch[1]),
          confidence: 0.8
        };
      }
    }

    // Slot restriction rule detection
    if (desc.includes('common') && (desc.includes('slot') || desc.includes('time'))) {
      const numberMatch = description.match(/(\d+)/);
      const groupMatch = description.match(/([\w\s]+?)\s+(?:group|team)/i);
      
      if (numberMatch && groupMatch) {
        return {
          type: 'slotRestriction',
          group: groupMatch[1].trim(),
          minSlots: parseInt(numberMatch[1]),
          confidence: 0.8
        };
      }
    }

    // Phase window rule detection
    if (desc.includes('phase') && (desc.includes('must') || desc.includes('complete'))) {
      const phaseMatches = description.match(/phase\s*(\d+)/gi);
      if (phaseMatches) {
        return {
          type: 'phaseWindow',
          phases: phaseMatches.map(p => parseInt(p.replace(/\D/g, ''))),
          confidence: 0.7
        };
      }
    }

    return null;
  };

  const convertToRule = async (description: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const ruleIntent = await parseRuleIntent(description);
      
      if (!ruleIntent) {
        setSuggestedRule(null);
        return;
      }

      let rule: Rule;

      switch (ruleIntent.type) {
        case 'coRun':
          rule = {
            id: generateId(),
            type: 'coRun',
            description: description,
            parameters: { taskIds: ruleIntent.taskIds },
            enabled: true,
            createdAt: new Date()
          };
          break;

        case 'loadLimit':
          rule = {
            id: generateId(),
            type: 'loadLimit',
            description: description,
            parameters: { 
              workerGroup: ruleIntent.group, 
              maxSlotsPerPhase: ruleIntent.limit 
            },
            enabled: true,
            createdAt: new Date()
          };
          break;

        case 'slotRestriction':
          rule = {
            id: generateId(),
            type: 'slotRestriction',
            description: description,
            parameters: { 
              group: ruleIntent.group, 
              minCommonSlots: ruleIntent.minSlots 
            },
            enabled: true,
            createdAt: new Date()
          };
          break;

        default:
          rule = {
            id: generateId(),
            type: 'patternMatch',
            description: description,
            parameters: { pattern: description },
            enabled: true,
            createdAt: new Date()
          };
      }

      setSuggestedRule(rule);
    } catch (error) {
      console.error('Error converting rule:', error);
      setSuggestedRule(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const acceptRule = () => {
    if (suggestedRule) {
      onRuleCreated(suggestedRule);
      setSuggestedRule(null);
      setRuleDescription('');
    }
  };

  const rejectRule = () => {
    setSuggestedRule(null);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-xl p-6 border border-indigo-500/20">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-indigo-400" />
        <h3 className="text-xl font-semibold text-white">Natural Language Rule Creator</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Describe your rule in plain English
          </label>
          <textarea
            placeholder="e.g., Tasks T12 and T14 should always run together..."
            value={ruleDescription}
            onChange={(e) => setRuleDescription(e.target.value)}
            className="w-full p-4 bg-gray-900/50 border border-indigo-500/30 rounded-lg text-white placeholder-gray-400 focus:border-indigo-400 focus:outline-none resize-none"
            rows={3}
          />
        </div>

        <button
          onClick={() => convertToRule(ruleDescription)}
          disabled={isProcessing || !ruleDescription.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-medium text-white hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
        >
          {isProcessing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Convert to Rule
            </>
          )}
        </button>

        {/* Example Rules */}
        <div>
          <p className="text-sm text-gray-400 mb-3">Try these examples:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {exampleRules.map((example, idx) => (
              <button
                key={idx}
                onClick={() => setRuleDescription(example)}
                className="text-left p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-sm text-gray-300 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>

        {/* Rule Preview */}
        {suggestedRule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl"
          >
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-400 mb-2">
                  Suggested Rule: {suggestedRule.type.charAt(0).toUpperCase() + suggestedRule.type.slice(1)}
                </h4>
                <p className="text-gray-300 mb-3">{suggestedRule.description}</p>
                <div className="bg-gray-900/50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-400 mb-2">Parameters:</p>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    {JSON.stringify(suggestedRule.parameters, null, 2)}
                  </pre>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={acceptRule}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
                  >
                    Accept Rule
                  </button>
                  <button
                    onClick={rejectRule}
                    className="px-4 py-2 border border-gray-600 hover:border-gray-500 rounded-lg text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}