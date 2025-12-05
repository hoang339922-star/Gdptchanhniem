
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Radio, Play, Pause, Volume2, RotateCcw, GraduationCap, Search, Headphones } from 'lucide-react';

interface MorseLessonProps {
  onBack: () => void;
  onStartQuiz: () => void;
}

const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----'
};

const MorseLesson: React.FC<MorseLessonProps> = ({ onBack, onStartQuiz }) => {
  const [mode, setMode] = useState<'menu' | 'learn'>('menu');
  const [learnTab, setLearnTab] = useState<'chart' | 'translator'>('chart');
  const [inputText, setInputText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Clean up AudioContext on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Logic phát âm thanh Morse
  const playMorseAudio = async (text: string) => {
    if (isPlaying || !text) return;
    setIsPlaying(true);

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
    }
    const ctx = audioCtxRef.current;
    
    // Resume context if suspended (browser policy)
    if (ctx.state === 'suspended') {
        await ctx.resume();
    }

    const dot = 0.08; // độ dài 1 dot (giây)
    const freq = 600; // tần số âm thanh

    let time = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    gain.gain.value = 0;

    const sequence = text.toUpperCase().split('').map(char => MORSE_CODE[char] || '').join(' ');

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
            time += dot * 3; // Khoảng nghỉ giữa các chữ
        }
    }

    // Dừng sau khi phát xong
    setTimeout(() => {
        osc.stop();
        setIsPlaying(false);
    }, (time - ctx.currentTime) * 1000);
  };

  // 1. Menu Selection Mode
  if (mode === 'menu') {
      return (
          <div className="max-w-3xl mx-auto space-y-8 py-10 animate-fade-in bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <button onClick={onBack} className="text-sm font-bold text-gray-600 hover:text-black flex items-center gap-2">
                 <ArrowRight className="rotate-180" size={20} /> Quay lại Menu Chính
              </button>
              
              <div className="text-center">
                  <div className="w-24 h-24 bg-white border-4 border-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                      <Radio size={48} />
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 mb-2 uppercase">Morse</h2>
                  <p className="text-gray-600 font-medium">Truyền tin bằng âm thanh (Tích - Tè)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setMode('learn')}
                    className="p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all text-left flex flex-col group items-center text-center"
                  >
                      <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <GraduationCap size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Học Hiệu Lệnh</h3>
                      <p className="text-gray-500 mt-2 text-sm font-medium">Bảng mã Morse, quy tắc phát tin và công cụ dịch văn bản.</p>
                  </button>

                  <button 
                    onClick={onStartQuiz}
                    className="p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:shadow-xl transition-all text-left flex flex-col group items-center text-center"
                  >
                      <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Play size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Làm Bài Tập</h3>
                      <p className="text-gray-500 mt-2 text-sm font-medium">Thử thách nghe và dịch tín hiệu với các câu hỏi trắc nghiệm.</p>
                  </button>
              </div>
          </div>
      );
  }

  // 2. Learning Mode
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <button onClick={() => setMode('menu')} className="text-sm font-bold text-gray-600 hover:text-black flex items-center gap-2">
             <ArrowRight className="rotate-180" size={18} /> Menu Morse
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-bold uppercase tracking-wider text-sm">
             <Radio size={16} /> Morse
          </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex gap-2">
          <button 
            onClick={() => setLearnTab('chart')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all border-2 ${
                learnTab === 'chart' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-600 border-transparent hover:bg-gray-50'
            }`}
          >
              Bảng Mã (Alphabet)
          </button>
          <button 
            onClick={() => setLearnTab('translator')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all border-2 ${
                learnTab === 'translator' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-600 border-transparent hover:bg-gray-50'
            }`}
          >
              Bộ Phát Tín Hiệu (Translator)
          </button>
      </div>

      {learnTab === 'chart' && (
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center gap-3 mb-8 border-b-2 border-gray-100 pb-4">
                  <Search size={24} className="text-blue-600" />
                  <h3 className="font-bold text-xl text-gray-900">Bảng Tra Cứu Mã Morse</h3>
                  <span className="text-xs text-gray-500 ml-auto bg-gray-100 px-3 py-1 rounded font-medium">Chạm vào ký tự để nghe</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
                  {Object.entries(MORSE_CODE).map(([char, code]) => (
                      <div 
                        key={char} 
                        className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-lg hover:bg-blue-50 transition-all cursor-pointer group bg-white h-40"
                        onClick={() => playMorseAudio(char)}
                      >
                          <span className="font-black text-4xl text-gray-900 group-hover:text-blue-700 mb-3">{char}</span>
                          <span className="font-mono text-2xl text-blue-600 font-bold bg-gray-50 px-4 py-1 rounded-full group-hover:bg-blue-200 transition-colors">{code}</span>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {learnTab === 'translator' && (
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-3 border-b-2 border-gray-100 pb-4">
                  <Volume2 size={24} className="text-blue-600"/> Bộ Phát Tín Hiệu
              </h3>
              
              <div className="space-y-6">
                  <div>
                      <label className="block text-base font-bold text-gray-900 mb-3">Nhập văn bản:</label>
                      <textarea 
                          className="w-full p-4 border-2 border-gray-300 rounded-xl bg-gray-50 text-gray-900 font-medium outline-none focus:border-blue-500 focus:ring-0 resize-none text-xl font-mono"
                          rows={3}
                          placeholder="Ví dụ: SOS..."
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                      ></textarea>
                  </div>
                  
                  <div className="bg-blue-50 p-8 rounded-xl min-h-[120px] flex items-center justify-center text-center border-2 border-blue-100">
                      {inputText ? (
                          <div className="text-3xl font-mono tracking-widest text-blue-700 font-black break-all leading-relaxed">
                              {inputText.toUpperCase().split('').map(c => MORSE_CODE[c] ? MORSE_CODE[c] + ' ' : '').join('')}
                          </div>
                      ) : (
                          <div className="text-gray-400 italic font-medium">Kết quả mã hóa sẽ hiện ở đây...</div>
                      )}
                  </div>

                  <div className="flex gap-4 pt-4">
                      <button 
                        onClick={() => playMorseAudio(inputText || 'SOS')}
                        disabled={isPlaying}
                        className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-md ${
                            isPlaying 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                      >
                          {isPlaying ? <Pause size={28}/> : <Play size={28}/>}
                          {isPlaying ? 'Đang phát tín hiệu...' : 'Phát Tín Hiệu'}
                      </button>
                      <button 
                        onClick={() => setInputText('')}
                        className="px-8 border-2 border-gray-300 rounded-xl hover:bg-gray-100 text-gray-600 transition"
                        title="Xóa nội dung"
                      >
                          <RotateCcw size={28}/>
                      </button>
                  </div>
                  
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800 flex items-start gap-3 font-medium">
                      <Headphones size={20} className="flex-shrink-0 mt-0.5" />
                      <p>Mẹo: Đeo tai nghe để nghe rõ sự khác biệt giữa tích (ngắn) và tè (dài). Tỷ lệ chuẩn là 1 tè = 3 tích.</p>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default MorseLesson;
