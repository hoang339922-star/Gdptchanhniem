
import React, { useState } from 'react';
import { BookOpen, Plus, X, ArrowRight } from 'lucide-react';
import { TOPIC_CONFIG } from '../../lib/skillData';
import { QuizQuestion, SkillTopic, UserRole } from '../../types';
import { useAuthStore } from '../../store';

interface SkillDashboardProps {
  allQuestions: QuizQuestion[];
  onSelectTopic: (topic: string) => void;
  onAddQuestion: (q: QuizQuestion) => void;
}

const SkillDashboard: React.FC<SkillDashboardProps> = ({ allQuestions, onSelectTopic, onAddQuestion }) => {
  const { user } = useAuthStore();
  const isHuynhTruong = user?.role === UserRole.HUYNH_TRUONG || user?.role === UserRole.GIA_TRUONG || user?.role === UserRole.ADMIN_ROOT;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Partial<QuizQuestion>>({
      options: ['', '', '', ''],
      correct_answer: 0
  });

  const handleAddQuestionSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newQuestion.question || !newQuestion.topic) return;

      const q: QuizQuestion = {
          id: `q_new_${Date.now()}`,
          topic: newQuestion.topic as SkillTopic,
          question: newQuestion.question,
          options: newQuestion.options as string[],
          correct_answer: newQuestion.correct_answer || 0,
          explanation: newQuestion.explanation,
          image_url: newQuestion.image_url
      };

      onAddQuestion(q);
      setIsAddModalOpen(false);
      setNewQuestion({ options: ['', '', '', ''], correct_answer: 0 });
      alert("Đã thêm câu hỏi thành công vào ngân hàng đề!");
  };

  const sections = ['Chuyên Môn', 'Tu Học & Kiến Thức'];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <BookOpen className="text-primary-600"/> Rèn Luyện Kỹ Năng
                </h2>
                <p className="text-gray-500 text-sm mt-1">Ngân hàng {allQuestions.length} câu hỏi. Mỗi lần thi 20 câu ngẫu nhiên.</p>
            </div>
            {isHuynhTruong && (
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-primary-700 transition flex items-center gap-2"
                >
                    <Plus size={18} /> Soạn đề thi
                </button>
            )}
        </div>

        {sections.map(section => (
            <div key={section}>
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4 border-l-4 border-primary-500 pl-3">
                    {section}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(TOPIC_CONFIG)
                    .filter(key => TOPIC_CONFIG[key].section === section)
                    .map((key) => {
                        const config = TOPIC_CONFIG[key];
                        const Icon = config.icon;
                        const count = allQuestions.filter(q => q.topic === key).length;

                        return (
                        <button 
                            key={key}
                            onClick={() => onSelectTopic(key)}
                            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all text-left flex flex-col h-full group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${config.bg} ${config.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                    <Icon size={28} />
                                </div>
                                <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-2 py-1 rounded-full">
                                    Kho: {count} câu
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{config.label}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 flex-1">{config.description}</p>
                            <div className="flex items-center text-primary-600 text-sm font-semibold">
                                {key === 'Semaphore' ? 'Học & Thi' : 'Bắt đầu thi'} <ArrowRight size={16} className="ml-1" />
                            </div>
                        </button>
                        );
                })}
                </div>
            </div>
        ))}

        {/* Add Question Modal */}
        {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-primary-600 text-white">
                        <h3 className="text-xl font-bold">Thêm Câu Hỏi Mới</h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="text-white/80 hover:text-white"><X size={20}/></button>
                    </div>
                    <div className="p-6 overflow-y-auto">
                        <form onSubmit={handleAddQuestionSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Chủ đề</label>
                                <select 
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={newQuestion.topic}
                                    onChange={e => setNewQuestion({...newQuestion, topic: e.target.value as SkillTopic})}
                                    required
                                >
                                    <option value="">-- Chọn chủ đề --</option>
                                    {Object.keys(TOPIC_CONFIG).map(k => (
                                        <option key={k} value={k}>{TOPIC_CONFIG[k].label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Câu hỏi</label>
                                <textarea 
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    rows={2}
                                    value={newQuestion.question}
                                    onChange={e => setNewQuestion({...newQuestion, question: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Link hình ảnh (Tùy chọn)</label>
                                <input 
                                    type="url"
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="https://..."
                                    value={newQuestion.image_url || ''}
                                    onChange={e => setNewQuestion({...newQuestion, image_url: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[0, 1, 2, 3].map(idx => (
                                    <div key={idx}>
                                        <label className="block text-xs font-medium mb-1 text-gray-500">Đáp án {String.fromCharCode(65+idx)}</label>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="radio" 
                                                name="correct" 
                                                checked={newQuestion.correct_answer === idx}
                                                onChange={() => setNewQuestion({...newQuestion, correct_answer: idx})}
                                            />
                                            <input 
                                                type="text"
                                                className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                value={newQuestion.options?.[idx]}
                                                onChange={e => {
                                                    const opts = [...(newQuestion.options || [])];
                                                    opts[idx] = e.target.value;
                                                    setNewQuestion({...newQuestion, options: opts});
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Giải thích</label>
                                <textarea 
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    rows={2}
                                    value={newQuestion.explanation || ''}
                                    onChange={e => setNewQuestion({...newQuestion, explanation: e.target.value})}
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Hủy</button>
                                <button type="submit" className="px-4 py-2 bg-primary-600 text-white font-bold rounded hover:bg-primary-700">Lưu câu hỏi</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default SkillDashboard;
