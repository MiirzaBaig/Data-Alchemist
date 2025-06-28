'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, BarChart3, Users, Clock, Shuffle } from 'lucide-react';
import { OptimizationWeights } from '@/types';

interface PrioritizationPanelProps {
  weights: OptimizationWeights;
  onWeightsUpdate: (weights: OptimizationWeights) => void;
}

export function PrioritizationPanel({ weights, onWeightsUpdate }: PrioritizationPanelProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');

  const presets = {
    balanced: {
      name: 'Balanced Approach',
      description: 'Equal consideration of all factors',
      icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />,
      weights: { priorityLevel: 0.25, taskFulfillment: 0.25, fairness: 0.25, efficiency: 0.15, workloadBalance: 0.1 }
    },
    'priority-first': {
      name: 'Priority First',
      description: 'Client priority is the main focus',
      icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
      weights: { priorityLevel: 0.5, taskFulfillment: 0.3, fairness: 0.1, efficiency: 0.05, workloadBalance: 0.05 }
    },
    'fair-distribution': {
      name: 'Fair Distribution',
      description: 'Maximize fairness and balance',
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
      weights: { priorityLevel: 0.1, taskFulfillment: 0.2, fairness: 0.4, efficiency: 0.15, workloadBalance: 0.15 }
    },
    'efficiency-focused': {
      name: 'Efficiency Focused',
      description: 'Optimize for maximum efficiency',
      icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />,
      weights: { priorityLevel: 0.2, taskFulfillment: 0.3, fairness: 0.1, efficiency: 0.3, workloadBalance: 0.1 }
    }
  };

  const weightConfig = [
    {
      key: 'priorityLevel',
      label: 'Priority Level',
      description: 'How much client priority level affects allocation',
      color: 'from-red-500 to-pink-500',
      icon: '🔥'
    },
    {
      key: 'taskFulfillment',
      label: 'Task Fulfillment',
      description: 'Ensuring client requests are satisfied',
      color: 'from-blue-500 to-cyan-500',
      icon: '✅'
    },
    {
      key: 'fairness',
      label: 'Fairness',
      description: 'Equal distribution among clients',
      color: 'from-green-500 to-teal-500',
      icon: '⚖️'
    },
    {
      key: 'efficiency',
      label: 'Efficiency',
      description: 'Optimal resource utilization',
      color: 'from-purple-500 to-indigo-500',
      icon: '⚡'
    },
    {
      key: 'workloadBalance',
      label: 'Workload Balance',
      description: 'Even distribution across workers',
      color: 'from-orange-500 to-yellow-500',
      icon: '📊'
    }
  ];

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (presets[presetKey as keyof typeof presets]) {
      onWeightsUpdate(presets[presetKey as keyof typeof presets].weights);
    }
  };

  const handleWeightChange = (key: keyof OptimizationWeights, value: number) => {
    const newWeights = { ...weights, [key]: value };
    
    // Normalize weights to ensure they sum to 1
    const total = Object.values(newWeights).reduce((sum, w) => sum + w, 0);
    if (total > 0) {
      Object.keys(newWeights).forEach(k => {
        newWeights[k as keyof OptimizationWeights] = newWeights[k as keyof OptimizationWeights] / total;
      });
    }
    
    onWeightsUpdate(newWeights);
    setSelectedPreset('custom');
  };

  const randomizeWeights = () => {
    const random = Array.from({ length: 5 }, () => Math.random());
    const total = random.reduce((sum, r) => sum + r, 0);
    const normalizedWeights = random.map(r => r / total);

    const newWeights: OptimizationWeights = {
      priorityLevel: normalizedWeights[0],
      taskFulfillment: normalizedWeights[1],
      fairness: normalizedWeights[2],
      efficiency: normalizedWeights[3],
      workloadBalance: normalizedWeights[4]
    };

    onWeightsUpdate(newWeights);
    setSelectedPreset('custom');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Optimization Priorities
        </h2>
        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto px-4">
          Configure how the AI should balance different objectives when allocating resources.
        </p>
      </div>

      {/* Preset Profiles */}
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Quick Presets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Object.entries(presets).map(([key, preset]) => (
            <motion.button
              key={key}
              onClick={() => handlePresetChange(key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 text-left touch-target ${
                selectedPreset === key
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                {preset.icon}
                <span className="font-semibold text-white text-sm sm:text-base">{preset.name}</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">{preset.description}</p>
            </motion.button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={randomizeWeights}
            className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors touch-target"
          >
            <Shuffle className="w-4 h-4" />
            <span className="text-sm">Randomize Weights</span>
          </button>
        </div>
      </div>

      {/* Weight Sliders */}
      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Custom Configuration</h3>
        
        {weightConfig.map((config, index) => (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl">{config.icon}</span>
                <div className="min-w-0">
                  <h4 className="font-semibold text-white text-sm sm:text-base">{config.label}</h4>
                  <p className="text-gray-400 text-xs sm:text-sm">{config.description}</p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {(weights[config.key as keyof OptimizationWeights] * 100).toFixed(0)}%
                </div>
                <div className="text-xs sm:text-sm text-gray-400">weight</div>
              </div>
            </div>

            <div className="relative">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={weights[config.key as keyof OptimizationWeights]}
                onChange={(e) => handleWeightChange(config.key as keyof OptimizationWeights, parseFloat(e.target.value))}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb touch-target"
                style={{
                  background: `linear-gradient(to right, 
                    rgb(107, 114, 128) 0%, 
                    rgb(107, 114, 128) ${weights[config.key as keyof OptimizationWeights] * 100}%, 
                    rgb(55, 65, 81) ${weights[config.key as keyof OptimizationWeights] * 100}%, 
                    rgb(55, 65, 81) 100%)`
                }}
              />
              <div 
                className={`absolute top-0 left-0 h-3 rounded-lg bg-gradient-to-r ${config.color} transition-all duration-300`}
                style={{ width: `${weights[config.key as keyof OptimizationWeights] * 100}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Low Priority</span>
              <span>High Priority</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Configuration Preview */}
      <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-xl p-4 sm:p-6 border border-green-500/20">
        <h3 className="text-lg sm:text-xl font-semibold text-green-400 mb-4">Configuration Summary</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h4 className="font-medium text-white mb-3 text-sm sm:text-base">Weight Distribution</h4>
            <div className="space-y-2">
              {weightConfig.map(config => (
                <div key={config.key} className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-300">{config.label}</span>
                  <span className="font-mono text-white">
                    {(weights[config.key as keyof OptimizationWeights] * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-white mb-3 text-sm sm:text-base">Optimization Focus</h4>
            <div className="space-y-2">
              <div className="text-xs sm:text-sm text-gray-300">
                Primary: <span className="text-green-400 font-medium">
                  {weightConfig.find(c => weights[c.key as keyof OptimizationWeights] === Math.max(...Object.values(weights)))?.label}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-gray-300">
                Secondary: <span className="text-blue-400 font-medium">
                  {weightConfig.find(c => {
                    const sorted = Object.entries(weights).sort(([,a], [,b]) => b - a);
                    return c.key === sorted[1][0];
                  })?.label}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-gray-300">
                Balance Score: <span className="text-purple-400 font-medium">
                  {(100 - (Math.max(...Object.values(weights)) - Math.min(...Object.values(weights))) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-900/50 rounded-lg">
          <h4 className="font-medium text-white mb-2 text-sm sm:text-base">Export Configuration</h4>
          <pre className="text-xs sm:text-sm text-gray-300 overflow-x-auto">
            {JSON.stringify(weights, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}