import React, { useState, useEffect } from 'react';
import { useBoardStore } from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, FileText, CheckCircle, Loader2, ArrowRight, Save, RotateCcw } from 'lucide-react';

const steps = [
  { id: 0, title: '输入目标', description: '您想要研究什么？' },
  { id: 1, title: '制定计划', description: '正在分析任务并分解步骤...' },
  { id: 2, title: '全网搜索', description: '正在抓取关键信息源...' },
  { id: 3, title: '深度分析', description: '正在整合数据并生成洞察...' },
  { id: 4, title: '完成报告', description: '研究已完成，请查看结果。' },
];

export function DeepResearchModal() {
  const { 
    isDeepResearchModalOpen, 
    setDeepResearchModalOpen, 
    deepResearchStep, 
    setDeepResearchStep,
    deepResearchLogs,
    addDeepResearchLog,
    deepResearchQuery,
    setDeepResearchQuery,
    deepResearchResult,
    setDeepResearchResult,
    resetDeepResearch,
    addContent,
    selectedBoardId
  } = useBoardStore();

  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning && deepResearchStep > 0 && deepResearchStep < 4) {
      const timer = setTimeout(() => {
        // Simulate logs
        if (deepResearchStep === 1) addDeepResearchLog('正在拆解研究目标...');
        if (deepResearchStep === 2) addDeepResearchLog(`搜索关键词: "${deepResearchQuery}" ...`);
        if (deepResearchStep === 3) addDeepResearchLog('发现 12 个相关来源，正在阅读...');

        setDeepResearchStep(deepResearchStep + 1);
      }, 2000); // 2 seconds per step for demo
      return () => clearTimeout(timer);
    } else if (deepResearchStep === 4 && isRunning) {
      setIsRunning(false);
      setDeepResearchResult(`# 关于 "${deepResearchQuery}" 的深度研究报告\n\n## 1. 核心发现\n\n经过对全网信息的深度挖掘，我们发现...（此处为模拟生成的报告内容）。\n\n## 2. 关键数据\n\n- 市场规模增长了 15%\n- 用户关注度提升显著\n\n## 3. 下一步建议\n\n建议重点关注垂直领域的深入拓展。`);
    }
  }, [deepResearchStep, isRunning]);

  const startResearch = () => {
    if (!deepResearchQuery.trim()) return;
    setIsRunning(true);
    setDeepResearchStep(1);
    addDeepResearchLog('开始新的研究任务...');
  };

  const handleSave = () => {
    if (!selectedBoardId || !deepResearchResult) return;
    
    addContent(selectedBoardId, {
      id: crypto.randomUUID(),
      boardId: selectedBoardId,
      title: `深度研究: ${deepResearchQuery}`,
      content: deepResearchResult,
      type: 'note',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    // Close and reset
    setDeepResearchModalOpen(false);
    resetDeepResearch();
    alert('研究报告已保存到当前白板！');
  };

  if (!isDeepResearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">深度研究 Deep Research</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">基于 AI 的全网信息深度挖掘与整合</p>
            </div>
          </div>
          <button onClick={() => setDeepResearchModalOpen(false)} className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {deepResearchStep === 0 ? (
            <div className="flex flex-col gap-6">
              <div className="text-center py-8">
                <Search className="w-16 h-16 text-blue-200 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-2">想要研究什么？</h3>
                <p className="text-zinc-500 max-w-md mx-auto">输入任何主题、公司、技术或问题，AI 将为您自主规划、搜索、阅读并生成深度报告。</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={deepResearchQuery}
                  onChange={(e) => setDeepResearchQuery(e.target.value)}
                  placeholder="例如：2024年生成式AI在教育领域的应用趋势..."
                  className="w-full p-4 pr-12 text-lg border-2 border-zinc-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 focus:outline-none bg-transparent"
                  onKeyDown={(e) => e.key === 'Enter' && startResearch()}
                />
                <button 
                  onClick={startResearch}
                  disabled={!deepResearchQuery.trim()}
                  className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 justify-center text-sm text-zinc-500">
                <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full cursor-pointer hover:bg-zinc-200" onClick={() => setDeepResearchQuery('SpaceX 星舰最新进展分析')}>SpaceX 星舰进展</span>
                <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full cursor-pointer hover:bg-zinc-200" onClick={() => setDeepResearchQuery('React Server Components 最佳实践')}>RSC 最佳实践</span>
                <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full cursor-pointer hover:bg-zinc-200" onClick={() => setDeepResearchQuery('全球咖啡市场消费趋势报告')}>咖啡市场趋势</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Progress Steps */}
              <div className="flex justify-between mb-8 px-4">
                {steps.slice(1).map((step, idx) => {
                   const isActive = deepResearchStep === step.id;
                   const isCompleted = deepResearchStep > step.id;
                   return (
                     <div key={step.id} className="flex-1 flex flex-col items-center relative">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 z-10 transition-colors ${
                         isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/30' :
                         isCompleted ? 'bg-green-500 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400'
                       }`}>
                         {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.id}
                       </div>
                       <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-zinc-500'}`}>{step.title}</span>
                       
                       {/* Connector Line */}
                       {idx < steps.length - 2 && (
                         <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-0 ${deepResearchStep > step.id ? 'bg-green-500' : 'bg-zinc-200 dark:bg-zinc-700'}`} />
                       )}
                     </div>
                   );
                })}
              </div>

              {/* Logs & Result Area */}
              <div className="flex-1 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden relative flex flex-col">
                {deepResearchStep < 4 ? (
                  <div className="p-4 space-y-2 overflow-y-auto font-mono text-sm max-h-[300px]">
                     {deepResearchLogs.map((log, i) => (
                       <motion.div 
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         key={i} 
                         className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400"
                       >
                         <span className="text-blue-500">➜</span> {log}
                       </motion.div>
                     ))}
                     <div className="flex items-center gap-2 text-blue-600 animate-pulse">
                       <Loader2 className="w-4 h-4 animate-spin" />
                       <span>PROCESSING...</span>
                     </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                     <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-between items-center">
                       <span className="text-sm font-medium text-green-600 flex items-center gap-2">
                         <CheckCircle className="w-4 h-4" /> 研究完成
                       </span>
                       <div className="flex gap-2">
                         <button onClick={() => { resetDeepResearch(); setDeepResearchStep(0); }} className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg flex items-center gap-1">
                           <RotateCcw className="w-3 h-3" /> 重试
                         </button>
                       </div>
                     </div>
                     <div className="p-6 overflow-y-auto prose dark:prose-invert max-w-none flex-1">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-700 dark:text-zinc-300">
                          {deepResearchResult}
                        </pre>
                     </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {deepResearchStep === 4 && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 flex justify-end gap-3">
            <button 
              onClick={() => setDeepResearchModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              取消
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 flex items-center gap-2 shadow-lg shadow-blue-500/10"
            >
              <Save className="w-4 h-4" />
              保存为笔记
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
