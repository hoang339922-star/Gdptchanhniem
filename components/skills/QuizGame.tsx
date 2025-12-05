
import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, CheckCircle, XCircle, ArrowRight, RefreshCcw, Trophy, Star, Info, Radio
} from 'lucide-react';
import { TOPIC_CONFIG } from '../../lib/skillData';
import { QuizQuestion, SkillTopic } from '../../types';

interface QuizGameProps {
  questions: QuizQuestion[];
  topic: SkillTopic;
  onExit: () => void;
  onRetry: () => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ questions, topic, onExit, onRetry }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Play Morse Audio Logic
  const playMorse = (text: string) => {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const dot = 0.08; 
      const freq = 600; 

      const code: Record<string, string> = {
          'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
          'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
          'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
          'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
          'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', 
          '4': '....-', '5': '.....', 'SOS': '...---...', 'CH': '----'
      };

      let sequence = "";
      if (text.includes('.') || text.includes('-')) {
          sequence = text.replace(/[^.-]/g, ''); 
      } else {
          const words = text.toUpperCase().split(' ');
          for (const w of words) {
              if (code[w]) sequence += code[w] + " "; 
          }
      }
      
      if (!sequence && currentQuestionIndex >= 0) {
          const exp = questions[currentQuestionIndex].explanation || "";
          if (exp.includes('.') || exp.includes('-')) {
             sequence = exp.replace(/[^.-]/g, '');
          }
      }

      if (!sequence) return;

      let time = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      gain.gain.value = 0; 

      for (const char of sequence) {
          if (char === '.') {
              gain.gain.setValueAtTime(1, time);
              time += dot;
              gain.gain.setValueAtTime(0, time);
              time += dot; 
          } else if (char === '-') {
              gain.gain.setValueAtTime(1, time);
              time += dot * 3;
              gain.gain.setValueAtTime(0, time);
              time += dot; 
          } else {
              time += dot * 3; 
          }
      }
      osc.stop(time);
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === questions[currentQuestionIndex].correct_answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  // --- RESULT VIEW ---
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPass = percentage >= 50;

    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
         <div className="relative">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center ${isPass ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'} animate-bounce`}>
                <Trophy size={64} />
            </div>
            {isPass && (
               <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-full border-4 border-white">
                  <Star size={24} className="text-white fill-white" />
               </div>
            )}
         </div>

         <div>
             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
               {isPass ? "Chúc mừng! Bạn làm rất tốt." : "Cố gắng lần sau nhé!"}
             </h2>
             <p className="text-gray-500">
               Bạn đã hoàn thành bài kiểm tra <strong>{TOPIC_CONFIG[topic]?.label}</strong>.
             </p>
         </div>
         
         <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-full">
             <div className="flex justify-between text-sm font-semibold text-gray-500 uppercase mb-2">
                <span>Kết quả</span>
                <span>{percentage}%</span>
             </div>
             <div className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
                <span className={isPass ? 'text-green-600' : 'text-orange-500'}>{score}</span>
                <span className="text-3xl text-gray-400">/{questions.length}</span>
             </div>
             <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${isPass ? 'bg-green-500' : 'bg-orange-500'}`} 
                  style={{ width: `${percentage}%` }}
                ></div>
             </div>
         </div>

         <div className="flex gap-4 w-full">
            <button onClick={onExit} className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition font-medium">
              Chọn môn khác
            </button>
            <button onClick={onRetry} className="flex-1 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition flex items-center justify-center gap-2 font-bold shadow-lg">
              <RefreshCcw size={20} /> Làm lại đề này
            </button>
         </div>
      </div>
    );
  }

  // --- ACTIVE GAME VIEW ---
  if (questions.length === 0) return <div>Đang tải đề thi...</div>;

  const currentQ = questions[currentQuestionIndex];
  const isCorrect = selectedOption === currentQ.correct_answer;
  const TopicIcon = TOPIC_CONFIG[topic]?.icon || Lightbulb;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
       {/* Header */}
       <div className="flex items-center justify-between mb-2">
          <button onClick={onExit} className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
             <ArrowRight className="rotate-180" size={16} /> Thoát
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
             <TopicIcon size={14} className={TOPIC_CONFIG[topic]?.color} />
             <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">{TOPIC_CONFIG[topic]?.label}</span>
          </div>
       </div>

       {/* Progress */}
       <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-primary-600 transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
       </div>

       {/* Question Card */}
       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden animate-slide-up">
          <div className="p-6 md:p-8">
             <div className="flex flex-col gap-6 mb-6">
                 <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-relaxed flex items-start gap-2">
                    <span className="text-gray-400 text-lg whitespace-nowrap">#{currentQuestionIndex + 1}</span>
                    <span>{currentQ.question}</span>
                 </h3>
                 
                 {/* Image Support */}
                 {currentQ.image_url && (
                     <div className="w-full flex justify-center bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                         <img src={currentQ.image_url} alt="Question Visual" className="max-h-64 h-auto max-w-full rounded-lg object-contain bg-white" />
                     </div>
                 )}

                 {/* Morse Audio Support */}
                 {topic === 'Morse' && (
                     <div className="flex justify-center">
                         <button 
                            onClick={() => playMorse(currentQ.question)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-full font-bold hover:bg-blue-200 transition"
                         >
                             <Radio size={24} /> Nghe tín hiệu
                         </button>
                     </div>
                 )}
             </div>

             {/* Options */}
             <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                   let containerClass = "border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer";
                   let labelClass = "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400";
                   let textClass = "text-gray-700 dark:text-gray-200";
                   let icon = null;

                   if (isAnswered) {
                      containerClass = "cursor-default opacity-60 border-gray-100 dark:border-gray-800";
                      if (idx === currentQ.correct_answer) {
                         containerClass = "bg-green-50 dark:bg-green-900/20 border-green-500 opacity-100";
                         labelClass = "bg-green-500 text-white";
                         textClass = "text-green-800 dark:text-green-300 font-bold";
                         icon = <CheckCircle size={20} className="text-green-600" />;
                      } else if (idx === selectedOption) {
                         containerClass = "bg-red-50 dark:bg-red-900/20 border-red-500 opacity-100";
                         labelClass = "bg-red-500 text-white";
                         textClass = "text-red-800 dark:text-red-300 font-bold";
                         icon = <XCircle size={20} className="text-red-600" />;
                      }
                   } 

                   return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${containerClass}`}
                      >
                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold border transition-colors flex-shrink-0 ${labelClass}`}>
                             {String.fromCharCode(65 + idx)}
                         </div>
                         <span className={`flex-1 text-lg ${textClass}`}>{option}</span>
                         {icon}
                      </button>
                   );
                })}
             </div>

             {/* Explanation */}
             {isAnswered && (
                 <div className={`mt-8 p-6 rounded-xl border animate-fade-in ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/10' : 'bg-orange-50 border-orange-200 dark:bg-orange-900/10'}`}>
                     <div className="flex gap-3">
                         <div className={`mt-1 flex-shrink-0 ${isCorrect ? 'text-green-600' : 'text-orange-600'}`}>
                             {isCorrect ? <Info size={24} /> : <Lightbulb size={24} />}
                         </div>
                         <div>
                             <h4 className={`font-bold text-lg mb-1 ${isCorrect ? 'text-green-800 dark:text-green-400' : 'text-orange-800 dark:text-orange-400'}`}>
                                 {isCorrect ? 'Thông tin thêm' : 'Kiến thức cần nhớ'}
                             </h4>
                             <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                 {currentQ.explanation || "Chưa có giải thích cho câu hỏi này."}
                             </p>
                         </div>
                     </div>
                 </div>
             )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end h-24 items-center">
              {isAnswered && (
                <button 
                  onClick={handleNextQuestion}
                  className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 shadow-lg flex items-center gap-2 animate-bounce-short"
                >
                  {currentQuestionIndex + 1 === questions.length ? 'Xem kết quả' : 'Câu hỏi tiếp theo'} <ArrowRight size={20} />
                </button>
              )}
          </div>
       </div>
    </div>
  );
};

export default QuizGame;
