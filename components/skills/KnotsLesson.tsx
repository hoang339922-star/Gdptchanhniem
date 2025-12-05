
import React, { useState } from 'react';
import { ArrowRight, Anchor, GraduationCap, Play, Search, Info, Lasso } from 'lucide-react';

interface KnotsLessonProps {
  onBack: () => void;
  onStartQuiz: () => void;
}

// Helper to draw ropes simply
const RopePath = ({ d, color = "#ea580c" }: { d: string, color?: string }) => (
    <>
        <path d={d} stroke="rgba(0,0,0,0.2)" strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d={d} stroke={color} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d={d} stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,10" fill="none" />
    </>
);

const KNOTS_DATA: Record<string, { label: string; usage: string; draw: () => React.ReactNode }> = {
  'NutDet': {
    label: 'Nút Dẹt (Reef Knot)',
    usage: 'Dùng để nối hai đầu dây có cùng tiết diện (kích thước), dùng trong băng cứu thương.',
    draw: () => (
      <g>
         {/* Left Rope (Blue) */}
         <RopePath d="M 10 30 Q 40 30 50 50 T 90 70" color="#3b82f6" />
         {/* Right Rope (Orange) */}
         <RopePath d="M 90 30 Q 60 30 50 50 T 10 70" color="#f97316" />
         {/* Overlay to simulate intertwining - Fake logic for visual simplicity */}
         <circle cx="50" cy="50" r="10" fill="#3b82f6" opacity="0.8" />
         <circle cx="50" cy="50" r="6" fill="#f97316" />
      </g>
    )
  },
  'NutThoDet': {
    label: 'Nút Thợ Dệt (Sheet Bend)',
    usage: 'Dùng để nối hai đầu dây có tiết diện khác nhau (một to, một nhỏ) hoặc nối dây vào góc vải.',
    draw: () => (
      <g>
         {/* Big Rope (Blue - Loop) */}
         <RopePath d="M 20 20 L 20 60 Q 20 80 50 80 Q 80 80 80 60 L 80 20" color="#3b82f6" />
         {/* Small Rope (Orange) */}
         <RopePath d="M 50 95 L 50 65" color="#f97316" /> 
         <path d="M 50 65 Q 50 40 30 40 L 10 40" stroke="#f97316" strokeWidth="10" strokeLinecap="round" fill="none" />
         {/* Crossing part simulated */}
         <rect x="30" y="55" width="40" height="12" fill="#f97316" rx="4" transform="rotate(-10 50 60)" />
      </g>
    )
  },
  'NutThuyenChai': {
    label: 'Nút Thuyền Chài (Clove Hitch)',
    usage: 'Dùng để buộc dây vào cọc, neo thuyền, khởi đầu các nút ráp cây.',
    draw: () => (
      <g>
         {/* The Pole */}
         <rect x="40" y="10" width="20" height="80" rx="2" fill="#78350f" />
         {/* Rope loops */}
         <RopePath d="M 10 40 L 90 40" color="#f97316" />
         <RopePath d="M 10 60 L 90 60" color="#f97316" />
         {/* Cross */}
         <path d="M 40 40 L 60 60" stroke="#f97316" strokeWidth="10" />
      </g>
    )
  },
  'NutSo8': {
    label: 'Nút Số 8 (Figure Eight)',
    usage: 'Dùng để chặn đầu dây không cho tuột qua ròng rọc hoặc lỗ khuyên.',
    draw: () => (
      <g>
         <RopePath d="M 30 80 C 10 80 10 50 30 40 S 70 20 70 50 S 50 80 30 80 L 80 20" />
      </g>
    )
  },
  'NutGheDon': {
    label: 'Nút Ghế Đơn (Bowline)',
    usage: 'Tạo vòng tròn cố định không bị xiết lại, dùng để kéo người, cứu hộ.',
    draw: () => (
      <g>
         <RopePath d="M 50 10 L 50 40" />
         <circle cx="50" cy="65" r="20" stroke="#ea580c" strokeWidth="10" fill="none" />
         <RopePath d="M 50 40 L 70 65 L 30 65 Z" /> 
      </g>
    )
  },
  'NutThongLong': {
    label: 'Nút Thòng Lòng (Running Knot)',
    usage: 'Dùng để bắt súc vật, buộc dây vào cọc mà có thể mở nhanh, vòng dây chạy (xiết vào/nới ra được).',
    draw: () => (
      <g>
          {/* Main Loop */}
          <circle cx="50" cy="60" r="25" stroke="#ea580c" strokeWidth="10" fill="none" />
          {/* Standing part running through */}
          <line x1="50" y1="10" x2="50" y2="50" stroke="#ea580c" strokeWidth="10" strokeLinecap="round" />
          {/* Knot body */}
          <circle cx="50" cy="35" r="8" fill="#ea580c" />
      </g>
    )
  },
  'NutChi': {
    label: 'Nút Chịu Đơn (Overhand)',
    usage: 'Nút đơn giản nhất, dùng để chặn dây hoặc làm điểm tựa.',
    draw: () => (
      <g>
          <RopePath d="M 20 50 Q 50 10 80 50 Q 50 90 20 50" />
          <RopePath d="M 20 50 L 80 50" />
      </g>
    )
  },
  'NutKeoGo': {
    label: 'Nút Kéo Gỗ (Timber Hitch)',
    usage: 'Dùng để buộc vào các vật dài (gỗ, cột) để kéo, càng kéo càng xiết.',
    draw: () => (
      <g>
          <rect x="20" y="30" width="60" height="40" fill="#78350f" />
          <RopePath d="M 10 50 L 90 50" />
          <circle cx="50" cy="50" r="15" stroke="#ea580c" strokeWidth="8" fill="none" />
      </g>
    )
  }
};

const KnotFigure = ({ knotKey, size = 120 }: { knotKey: string, size?: number }) => {
    const data = KNOTS_DATA[knotKey];
    if (!data) return null;

    return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md bg-white rounded-lg border border-gray-100">
            {data.draw()}
        </svg>
    );
};

const KnotsLesson: React.FC<KnotsLessonProps> = ({ onBack, onStartQuiz }) => {
  const [mode, setMode] = useState<'menu' | 'learn'>('menu');
  const [selectedKnot, setSelectedKnot] = useState<string | null>(null);

  // 1. Menu Mode
  if (mode === 'menu') {
      return (
          <div className="max-w-3xl mx-auto space-y-8 py-10 animate-fade-in bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <button onClick={onBack} className="text-sm font-bold text-gray-600 hover:text-black flex items-center gap-2">
                 <ArrowRight className="rotate-180" size={20} /> Quay lại Menu Chính
              </button>
              
              <div className="text-center">
                  <div className="w-24 h-24 bg-white border-4 border-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                      <Anchor size={48} />
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 mb-2 uppercase">Nút Dây</h2>
                  <p className="text-gray-600 font-medium">Kỹ năng thắt nút và ứng dụng đời sống</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setMode('learn')}
                    className="p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-orange-500 hover:shadow-xl transition-all text-left flex flex-col group items-center text-center"
                  >
                      <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <GraduationCap size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Học Các Nút</h3>
                      <p className="text-gray-500 mt-2 text-sm font-medium">Danh sách các nút dây thông dụng trong GĐPT và hướng dẫn sử dụng.</p>
                  </button>

                  <button 
                    onClick={onStartQuiz}
                    className="p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:shadow-xl transition-all text-left flex flex-col group items-center text-center"
                  >
                      <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Play size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Làm Bài Tập</h3>
                      <p className="text-gray-500 mt-2 text-sm font-medium">Kiểm tra kiến thức nhận biết và ứng dụng nút dây.</p>
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
             <ArrowRight className="rotate-180" size={18} /> Menu Nút Dây
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-bold uppercase tracking-wider text-sm">
             <Lasso size={16} /> Knots
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: List */}
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 lg:col-span-1 h-fit">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <Search size={20} className="text-orange-600"/>
                  <h3 className="font-bold text-gray-900">Danh Sách Nút</h3>
              </div>
              <div className="space-y-2 h-[600px] overflow-y-auto pr-2">
                  {Object.keys(KNOTS_DATA).map((key) => (
                      <button
                        key={key}
                        onClick={() => setSelectedKnot(key)}
                        className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${
                            selectedKnot === key 
                            ? 'bg-orange-50 border-orange-200 text-orange-800 border' 
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                          <div className="w-10 h-10 bg-white rounded-md border border-gray-200 flex items-center justify-center flex-shrink-0">
                              <div className="scale-50"><KnotFigure knotKey={key} size={40} /></div>
                          </div>
                          <span className="font-medium text-sm">{KNOTS_DATA[key].label}</span>
                      </button>
                  ))}
              </div>
          </div>

          {/* Right: Detail */}
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 lg:col-span-2 min-h-[400px]">
              {selectedKnot ? (
                  <div className="animate-slide-up">
                      <div className="flex flex-col items-center mb-8">
                          <div className="p-6 bg-orange-50 rounded-full border-4 border-white shadow-sm mb-6">
                              <KnotFigure knotKey={selectedKnot} size={200} />
                          </div>
                          <h2 className="text-3xl font-black text-gray-900 text-center mb-2">{KNOTS_DATA[selectedKnot].label}</h2>
                          <div className="px-4 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-bold uppercase tracking-wide">Kỹ năng Trại</div>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-start gap-3">
                          <Info className="text-blue-600 flex-shrink-0 mt-1" />
                          <div>
                              <h4 className="font-bold text-blue-800 mb-1">Công dụng:</h4>
                              <p className="text-blue-900 leading-relaxed text-lg">{KNOTS_DATA[selectedKnot].usage}</p>
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <Anchor size={64} className="mb-4 opacity-20" />
                      <p>Chọn một nút dây để xem chi tiết</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default KnotsLesson;
