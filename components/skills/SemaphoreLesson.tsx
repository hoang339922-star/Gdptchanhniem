
import React, { useState } from 'react';
import { ArrowRight, Flag, Key, Delete, GraduationCap, Play, Search, Info } from 'lucide-react';

interface SemaphoreLessonProps {
  onBack: () => void;
  onStartQuiz: () => void;
}

// Định nghĩa góc quay của 2 tay (độ) cho từng chữ cái
// 0: 12h, 45: 1h30, 90: 3h, 135: 4h30, 180: 6h (xuống), 225: 7h30, 270: 9h, 315: 10h30
const SEMAPHORE_ANGLES: Record<string, { l: number, r: number }> = {
  'A': { l: 180, r: 225 }, 'B': { l: 180, r: 270 }, 'C': { l: 180, r: 315 }, 'D': { l: 180, r: 0 },
  'E': { l: 180, r: 45 },  'F': { l: 180, r: 90 },  'G': { l: 180, r: 135 },
  'H': { l: 225, r: 270 }, 'I': { l: 225, r: 315 }, 'K': { l: 225, r: 0 },  'L': { l: 225, r: 45 },
  'M': { l: 225, r: 90 },  'N': { l: 225, r: 135 },
  'O': { l: 270, r: 315 }, 'P': { l: 270, r: 0 },  'Q': { l: 270, r: 45 },  'R': { l: 270, r: 90 },
  'S': { l: 270, r: 135 },
  'T': { l: 315, r: 0 },   'U': { l: 315, r: 45 },  'Y': { l: 315, r: 90 }, 
  'Num': { l: 315, r: 135 }, // Dấu số
  'J': { l: 0, r: 90 },    'V': { l: 135, r: 0 },   'W': { l: 45, r: 270 },  'X': { l: 135, r: 315 },
  'Z': { l: 135, r: 90 },
  ' ': { l: 180, r: 180 } // Rest position
};

// Component vẽ người cầm cờ
const SemaphoreFigure = ({ char, size = 100 }: { char: string, size?: number }) => {
    const angles = SEMAPHORE_ANGLES[char.toUpperCase()] || { l: 180, r: 180 };
    
    // Tính toán tọa độ tay dựa trên góc
    const getHandCoords = (angle: number, length: number) => {
        const rad = (angle - 90) * (Math.PI / 180); // -90 để 0 độ là hướng 12h
        return {
            x: 50 + length * Math.cos(rad),
            y: 55 + length * Math.sin(rad)
        };
    };

    const leftHand = getHandCoords(angles.l, 35);
    const rightHand = getHandCoords(angles.r, 35);

    return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="mx-auto drop-shadow-sm">
            {/* Người */}
            <circle cx="50" cy="20" r="12" fill="#395270" /> {/* Đầu */}
            <rect x="42" y="32" width="16" height="40" rx="4" fill="#395270" /> {/* Thân */}
            
            {/* Tay trái & Cờ trái */}
            <line x1="50" y1="35" x2={leftHand.x} y2={leftHand.y} stroke="#395270" strokeWidth="6" strokeLinecap="round" />
            <path d={`M ${leftHand.x} ${leftHand.y} L ${getHandCoords(angles.l, 55).x} ${getHandCoords(angles.l, 55).y}`} stroke="#8B4513" strokeWidth="2" />
            <polygon points={`${getHandCoords(angles.l, 55).x},${getHandCoords(angles.l, 55).y} ${getHandCoords(angles.l - 45, 55).x},${getHandCoords(angles.l - 45, 55).y} ${getHandCoords(angles.l, 40).x},${getHandCoords(angles.l, 40).y}`} fill="#C00000" />
            
            {/* Tay phải & Cờ phải */}
            <line x1="50" y1="35" x2={rightHand.x} y2={rightHand.y} stroke="#395270" strokeWidth="6" strokeLinecap="round" />
            <path d={`M ${rightHand.x} ${rightHand.y} L ${getHandCoords(angles.r, 55).x} ${getHandCoords(angles.r, 55).y}`} stroke="#8B4513" strokeWidth="2" />
            <polygon points={`${getHandCoords(angles.r, 55).x},${getHandCoords(angles.r, 55).y} ${getHandCoords(angles.r + 45, 55).x},${getHandCoords(angles.r + 45, 55).y} ${getHandCoords(angles.r, 40).x},${getHandCoords(angles.r, 40).y}`} fill="#FFC000" />
        </svg>
    );
};

const SemaphoreLesson: React.FC<SemaphoreLessonProps> = ({ onBack, onStartQuiz }) => {
  const [mode, setMode] = useState<'menu' | 'learn'>('menu');
  const [learnTab, setLearnTab] = useState<'alphabet' | 'translate'>('alphabet');
  const [translateText, setTranslateText] = useState('');

  // 1. Menu Selection Mode
  if (mode === 'menu') {
      return (
          <div className="max-w-3xl mx-auto space-y-8 py-10 animate-fade-in bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <button onClick={onBack} className="text-sm font-bold text-gray-600 hover:text-black flex items-center gap-2">
                 <ArrowRight className="rotate-180" size={20} /> Quay lại Menu Chính
              </button>
              
              <div className="text-center">
                  <div className="w-24 h-24 bg-white border-4 border-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                      <Flag size={48} />
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 mb-2 uppercase">Semaphore</h2>
                  <p className="text-gray-600 font-medium">Truyền tin bằng cờ hiệu</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setMode('learn')}
                    className="p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-red-500 hover:shadow-xl transition-all text-left flex flex-col group items-center text-center"
                  >
                      <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <GraduationCap size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Học Hiệu Lệnh</h3>
                      <p className="text-gray-500 mt-2 text-sm font-medium">Bảng tra cứu chữ cái và công cụ dịch văn bản sang hình ảnh cờ.</p>
                  </button>

                  <button 
                    onClick={onStartQuiz}
                    className="p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:shadow-xl transition-all text-left flex flex-col group items-center text-center"
                  >
                      <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Play size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Làm Bài Tập</h3>
                      <p className="text-gray-500 mt-2 text-sm font-medium">Thử thách trí nhớ với 20 câu hỏi trắc nghiệm ngẫu nhiên.</p>
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
                 <ArrowRight className="rotate-180" size={18} /> Menu Semaphore
              </button>
              <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full font-bold uppercase tracking-wider text-sm">
                 <Flag size={16} /> Semaphore
              </div>
          </div>

          {/* Tabs */}
          <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex gap-2">
              <button 
                onClick={() => setLearnTab('alphabet')}
                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all border-2 ${
                    learnTab === 'alphabet' 
                    ? 'bg-red-600 text-white border-red-600' 
                    : 'bg-white text-gray-600 border-transparent hover:bg-gray-50'
                }`}
              >
                  Bảng Chữ Cái (Chart)
              </button>
              <button 
                onClick={() => setLearnTab('translate')}
                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all border-2 ${
                    learnTab === 'translate' 
                    ? 'bg-red-600 text-white border-red-600' 
                    : 'bg-white text-gray-600 border-transparent hover:bg-gray-50'
                }`}
              >
                  Công Cụ Dịch (Translator)
              </button>
          </div>

          {learnTab === 'alphabet' && (
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                  <div className="flex items-center gap-3 mb-8 border-b-2 border-gray-100 pb-4">
                      <Search size={24} className="text-red-600" />
                      <h3 className="font-bold text-xl text-gray-900">Bảng Tra Cứu Hiệu Lệnh</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
                      {Object.keys(SEMAPHORE_ANGLES).map((char) => (
                          <div key={char} className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-100 hover:border-red-500 hover:shadow-lg transition-all cursor-pointer group bg-white">
                              <div className="w-full flex items-center justify-center mb-2">
                                  <SemaphoreFigure char={char} size={100} />
                              </div>
                              <span className="font-black text-3xl text-gray-900">{char}</span>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {learnTab === 'translate' && (
              <div className="space-y-6">
                  <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                      <label className="block text-base font-bold text-gray-900 mb-3 uppercase">Nhập văn bản cần dịch:</label>
                      <div className="relative">
                          <input 
                            type="text" 
                            value={translateText}
                            onChange={(e) => setTranslateText(e.target.value)}
                            placeholder="Ví dụ: CHAO ANH CHI..."
                            className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-300 focus:border-red-500 focus:ring-0 outline-none uppercase font-mono tracking-widest text-2xl font-bold text-gray-900 bg-gray-50"
                          />
                          <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                          {translateText && (
                              <button onClick={() => setTranslateText('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                                  <Delete size={24} />
                              </button>
                          )}
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 bg-blue-50 p-2 rounded-lg inline-block text-blue-700 font-medium">
                          <Info size={16} />
                          Hệ thống sẽ tự động vẽ hình mô phỏng theo ký tự bạn nhập.
                      </div>
                  </div>

                  {translateText && (
                      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                          <h3 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-red-500 pl-4">Kết quả hình ảnh:</h3>
                          <div className="flex flex-wrap gap-6 justify-center bg-gray-50 p-8 rounded-xl border border-gray-200 min-h-[200px] items-start">
                              {translateText.toUpperCase().split('').map((char, idx) => {
                                  // Xử lý khoảng trắng
                                  if (char === ' ') return <div key={idx} className="w-10 h-32 border-b-2 border-gray-300"></div>; 
                                  // Bỏ qua ký tự lạ không có trong map
                                  if (!SEMAPHORE_ANGLES[char]) return null; 

                                  return (
                                      <div key={idx} className="flex flex-col items-center animate-slide-up bg-white p-2 rounded-lg border-2 border-gray-200 shadow-sm w-32">
                                          <SemaphoreFigure char={char} size={100} />
                                          <span className="font-black text-2xl text-gray-900 mt-2 border-t-2 border-gray-100 w-full text-center pt-1">{char}</span>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                  )}
              </div>
          )}
      </div>
  );
};

export default SemaphoreLesson;
