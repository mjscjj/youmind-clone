import React from 'react';
import { useBoardStore } from '../lib/store';
import { X, Search, PenTool, Code, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap: Record<string, React.ReactNode> = {
  'search': <Search className="w-6 h-6" />,
  'pen-tool': <PenTool className="w-6 h-6" />,
  'code': <Code className="w-6 h-6" />,
  'brain': <Brain className="w-6 h-6" />,
};

export function SkillPicker() {
  const { 
    isSkillPickerOpen, 
    setSkillPickerOpen, 
    skills, 
    selectSkill,
    setDeepResearchModalOpen
  } = useBoardStore();

  if (!isSkillPickerOpen) return null;

  const handleSkillSelect = (skillId: string) => {
    selectSkill(skillId);
    setSkillPickerOpen(false);
    
    if (skillId === 'deep-research') {
      setDeepResearchModalOpen(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
           onClick={() => setSkillPickerOpen(false)}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden m-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">选择技能</h2>
            <button 
              onClick={() => setSkillPickerOpen(false)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-zinc-500" />
            </button>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleSkillSelect(skill.id)}
                className="flex items-start gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-left group"
              >
                <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 text-zinc-600 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {iconMap[skill.icon] || <Brain className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">{skill.name}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{skill.description}</p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500">
            更多技能正在开发中...
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
