
import React, { useState } from 'react';
import { ArrowRight, Map, GraduationCap, Play, Search, Info, TreePine, Navigation } from 'lucide-react';

interface TrailSignsLessonProps {
  onBack: () => void;
  onStartQuiz: () => void;
}

// Dữ liệu cấu hình cho các dấu đi đường
// type: 'rocks' | 'grass' | 'twigs' | 'drawn'
const TRAIL_SIGNS_DATA: Record<string, { label: string; desc: string; type: string; draw: (color: string) => React.ReactNode }> = {
  'bat_dau': {
    label: 'Bắt đầu đi',
    desc: 'Dấu hiệu khởi hành. Mũi tên xếp bằng đá hoặc cành cây chỉ hướng đi.',
    type: 'rocks',
    draw: (c) => (
      <g>
        <path d="M 20 50 Q 25 40 35 45 Q 40 55 30 60 Q 15 55 20 50" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2"/>
        <path d="M 40 50 L 85 50" stroke="#8B4513" strokeWidth="5" strokeLinecap="round"/>
        <path d="M 70 35 L 85 50 L 70 65" stroke="#8B4513" strokeWidth="5" strokeLinecap="round" fill="none"/>
      </g>
    )
  },
  'di_thang': {
    label: 'Đi thẳng',
    desc: 'Một viên đá nhỏ đặt trên một viên đá lớn.',
    type: 'rocks',
    draw: (c) => (
      <g>
        {/* Đá lớn bên dưới */}
        <path d="M 30 75 Q 20 55 40 45 Q 60 35 80 55 Q 90 75 70 90 Q 50 100 30 75" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2" />
        {/* Đá nhỏ đặt lên trên */}
        <path d="M 45 40 Q 40 30 50 25 Q 60 20 65 30 Q 70 40 60 45 Q 50 50 45 40" fill="#6B7280" stroke="#374151" strokeWidth="2" />
      </g>
    )
  },
  're_trai': {
    label: 'Rẽ trái',
    desc: 'Cỏ cột túm đầu, ngọn nghiêng về bên trái.',
    type: 'grass',
    draw: (c) => (
      <g>
        {/* Gốc cỏ */}
        <path d="M 50 85 Q 55 60 55 50" stroke="#166534" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M 45 85 Q 45 60 45 50" stroke="#166534" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M 55 85 Q 60 60 55 50" stroke="#166534" strokeWidth="4" fill="none" strokeLinecap="round"/>
        
        {/* Nút thắt */}
        <rect x="42" y="45" width="16" height="8" rx="2" fill="#d97706" />

        {/* Ngọn cỏ nghiêng trái */}
        <path d="M 48 45 Q 40 20 15 25" stroke="#166534" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M 50 45 Q 45 20 20 20" stroke="#166534" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M 52 45 Q 50 15 25 15" stroke="#166534" strokeWidth="4" fill="none" strokeLinecap="round"/>
      </g>
    )
  },
  're_phai': {
    label: 'Rẽ phải',
    desc: 'Cỏ cột túm đầu, ngọn nghiêng về bên phải.',
    type: 'grass',
    draw: (c) => (
      <g>
        {/* Gốc cỏ */}
        <path d="M 50 85 Q 45 60 45 50" stroke="#166534" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M 55 85 Q 55 60 55 50" stroke="#166534" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M 45 85 Q 40 60 45 50" stroke="#166534" strokeWidth="4" fill="none" strokeLinecap="round"/>
        
        {/* Nút thắt */}
        <rect x="42" y="45" width="16" height="8" rx="2" fill="#d97706" />

        {/* Ngọn cỏ nghiêng phải */}
        <path d="M 52 45 Q 60 20 85 25" stroke="#166534" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M 50 45 Q 55 20 80 20" stroke="#166534" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M 48 45 Q 50 15 75 15" stroke="#166534" strokeWidth="4" fill="none" strokeLinecap="round"/>
      </g>
    )
  },
  'nguy_hiem': {
    label: 'Nguy hiểm',
    desc: 'Cẩn thận! Ba viên đá chồng lên nhau hoặc xếp thành hình tam giác.',
    type: 'rocks',
    draw: (c) => (
      <g>
        {/* 3 đá chồng lên nhau */}
        <path d="M 30 85 Q 50 95 70 85 Q 80 75 70 70 Q 50 60 30 70 Q 20 80 30 85" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2"/>
        <path d="M 35 68 Q 50 72 65 68 Q 70 60 60 55 Q 50 50 40 55 Q 30 60 35 68" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2"/>
        <path d="M 42 53 Q 50 56 58 53 Q 62 48 55 42 Q 50 40 45 42 Q 38 48 42 53" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2"/>
      </g>
    )
  },
  'nuoc_uong': {
    label: 'Nước uống được',
    desc: 'Hình vẽ sóng nước trong khung hình chữ nhật hoặc vòng tròn.',
    type: 'drawn',
    draw: (c) => (
      <g>
        <rect x="20" y="20" width="60" height="60" rx="10" fill="none" stroke="#2563EB" strokeWidth="4"/>
        <path d="M 30 40 Q 40 30 50 40 T 70 40" stroke="#3B82F6" strokeWidth="3" fill="none"/>
        <path d="M 30 55 Q 40 45 50 55 T 70 55" stroke="#3B82F6" strokeWidth="3" fill="none"/>
        <path d="M 30 70 Q 40 60 50 70 T 70 70" stroke="#3B82F6" strokeWidth="3" fill="none"/>
      </g>
    )
  },
  'nuoc_doc': {
    label: 'Nước độc / Không uống',
    desc: 'Hình sóng nước bị gạch chéo.',
    type: 'drawn',
    draw: (c) => (
      <g>
        <rect x="20" y="20" width="60" height="60" rx="10" fill="none" stroke="#EF4444" strokeWidth="4"/>
        <path d="M 30 40 Q 40 30 50 40 T 70 40" stroke="#EF4444" strokeWidth="3" fill="none"/>
        <path d="M 30 55 Q 40 45 50 55 T 70 55" stroke="#EF4444" strokeWidth="3" fill="none"/>
        {/* Dấu gạch chéo */}
        <line x1="25" y1="75" x2="75" y2="25" stroke="#EF4444" strokeWidth="4" />
      </g>
    )
  },
  've_nha': {
    label: 'Đã về nhà / Kết thúc',
    desc: 'Vòng tròn có chấm ở giữa (hoặc đá xếp vòng tròn có 1 viên giữa).',
    type: 'drawn',
    draw: (c) => (
      <g>
        <circle cx="50" cy="50" r="30" fill="none" stroke="#10B981" strokeWidth="4"/>
        <circle cx="50" cy="50" r="6" fill="#10B981"/>
      </g>
    )
  },
  'di_nhanh': {
    label: 'Chạy nhanh',
    desc: 'Mũi tên gãy khúc hoặc nhiều mũi tên nối tiếp.',
    type: 'twigs',
    draw: (c) => (
      <g>
        <path d="M 20 70 L 40 40 L 60 70 L 80 40" stroke="#8B4513" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M 70 45 L 80 40 L 75 55" stroke="#8B4513" strokeWidth="5" strokeLinecap="round" fill="none"/>
      </g>
    )
  },
  'doi_o_day': {
    label: 'Đợi ở đây',
    desc: 'Hình vuông hoặc chữ nhật xếp bằng đá/cây.',
    type: 'twigs',
    draw: (c) => (
      <g>
        <rect x="30" y="30" width="40" height="40" fill="none" stroke="#8B4513" strokeWidth="5"/>
        <circle cx="50" cy="50" r="5" fill="#8B4513"/>
      </g>
    )
  },
  'chia_hai': {
    label: 'Chia hai ngả',
    desc: 'Mũi tên tẽ làm đôi.',
    type: 'twigs',
    draw: (c) => (
      <g>
        <line x1="50" y1="80" x2="50" y2="50" stroke="#8B4513" strokeWidth="5" strokeLinecap="round"/>
        <line x1="50" y1="50" x2="20" y2="20" stroke="#8B4513" strokeWidth="5" strokeLinecap="round"/>
        <line x1="50" y1="50" x2="80" y2="20" stroke="#8B4513" strokeWidth="5" strokeLinecap="round"/>
        {/* Mũi tên */}
        <path d="M 15 30 L 20 20 L 30 25" stroke="#8B4513" strokeWidth="3" fill="none"/>
        <path d="M 70 25 L 80 20 L 85 30" stroke="#8B4513" strokeWidth="3" fill="none"/>
      </g>
    )
  },
  'co_thu': {
    label: 'Có thú dữ',
    desc: 'Hình chữ nhật hở cạnh dưới, có 2 chấm (mắt thú) bên trong.',
    type: 'drawn',
    draw: (c) => (
      <g>
        <rect x="25" y="30" width="50" height="40" stroke="#8B4513" strokeWidth="4" fill="none"/>
        <line x1="50" y1="30" x2="50" y2="70" stroke="#8B4513" strokeWidth="4"/>
        <circle cx="35" cy="40" r="2" fill="#8B4513"/>
        <circle cx="65" cy="40" r="2" fill="#8B4513"/>
        <path d="M 40 60 Q 50 50 60 60" stroke="#8B4513" strokeWidth="2" fill="none"/>
      </g>
    )
  }
};

const TrailSignFigure = ({ signKey, size = 120 }: { signKey: string, size?: number }) => {
    const data = TRAIL_SIGNS_DATA[signKey];
    if (!data) return null;

    return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md bg-white rounded-lg border border-gray-100">
            {data.draw(data.type)}
        </svg>
    );
};

const TrailSignsLesson: React.FC<TrailSignsLessonProps> = ({ onBack, onStartQuiz }) => {
  const [mode, setMode] = useState<'menu' | 'learn'>('menu');
  const [learnTab, setLearnTab] = useState<'chart' | 'lookup'>('chart');
  const [selectedSign, setSelectedSign] = useState<string | null>(null);

  // 1. Menu Mode
  if (mode === 'menu') {
      return (
          <div className="max-w-3xl mx-auto space-y-8 py-10 animate-fade-in bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <button onClick={onBack} className="text-sm font-bold text-gray-600 hover:text-black flex items-center gap-2">
                 <ArrowRight className="rotate-180" size={20} /> Quay lại Menu Chính
              </button>
              
              <div className="text-center">
                  <div className="w-24 h-24 bg-white border-4 border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                      <Map size={48} />
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 mb-2 uppercase">Dấu Đi Đường</h2>
                  <p className="text-gray-600 font-medium">Ngôn ngữ của thiên nhiên</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setMode('learn')}
                    className="p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-emerald-500 hover:shadow-xl transition-all text-left flex flex-col group items-center text-center"
                  >
                      <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <GraduationCap size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Học Dấu Hiệu</h3>
                      <p className="text-gray-500 mt-2 text-sm font-medium">Tra cứu ý nghĩa các dấu hiệu bằng đá, cây, cỏ và hình vẽ.</p>
                  </button>

                  <button 
                    onClick={onStartQuiz}
                    className="p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:shadow-xl transition-all text-left flex flex-col group items-center text-center"
                  >
                      <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Play size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Làm Bài Tập</h3>
                      <p className="text-gray-500 mt-2 text-sm font-medium">Thử thách nhận biết dấu đi đường qua 20 câu hỏi trắc nghiệm.</p>
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
             <ArrowRight className="rotate-180" size={18} /> Menu Dấu Đi Đường
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-bold uppercase tracking-wider text-sm">
             <TreePine size={16} /> Trail Signs
          </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex gap-2">
          <button 
            onClick={() => setLearnTab('chart')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all border-2 ${
                learnTab === 'chart' 
                ? 'bg-emerald-600 text-white border-emerald-600' 
                : 'bg-white text-gray-600 border-transparent hover:bg-gray-50'
            }`}
          >
              Bảng Dấu Hiệu (Chart)
          </button>
          <button 
            onClick={() => setLearnTab('lookup')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all border-2 ${
                learnTab === 'lookup' 
                ? 'bg-emerald-600 text-white border-emerald-600' 
                : 'bg-white text-gray-600 border-transparent hover:bg-gray-50'
            }`}
          >
              Tra Cứu Nhanh (Dictionary)
          </button>
      </div>

      {learnTab === 'chart' && (
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center gap-3 mb-8 border-b-2 border-gray-100 pb-4">
                  <Search size={24} className="text-emerald-600" />
                  <h3 className="font-bold text-xl text-gray-900">Danh Mục Dấu Hiệu</h3>
                  <span className="text-xs text-gray-500 ml-auto bg-gray-100 px-3 py-1 rounded font-medium">Chạm vào để xem chi tiết</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
                  {Object.keys(TRAIL_SIGNS_DATA).map((key) => {
                      const item = TRAIL_SIGNS_DATA[key];
                      return (
                          <div 
                            key={key} 
                            onClick={() => setSelectedSign(key)}
                            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer group bg-white ${selectedSign === key ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-gray-100 hover:border-emerald-400 hover:shadow-lg'}`}
                          >
                              <div className="w-full flex items-center justify-center mb-3">
                                  <TrailSignFigure signKey={key} size={100} />
                              </div>
                              <span className="font-bold text-sm text-gray-800 text-center">{item.label}</span>
                          </div>
                      );
                  })}
              </div>

              {/* Detail Panel */}
              {selectedSign && (
                  <div className="mt-8 p-6 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-6 animate-slide-up">
                      <div className="flex-shrink-0 bg-white p-2 rounded-lg border border-emerald-200">
                          <TrailSignFigure signKey={selectedSign} size={150} />
                      </div>
                      <div>
                          <h4 className="text-2xl font-bold text-emerald-800 mb-2">{TRAIL_SIGNS_DATA[selectedSign].label}</h4>
                          <p className="text-emerald-700 text-lg">{TRAIL_SIGNS_DATA[selectedSign].desc}</p>
                          <div className="mt-4 flex gap-2">
                              <span className="px-3 py-1 bg-white text-emerald-600 rounded-full text-xs font-bold border border-emerald-200 uppercase">
                                  Loại: {TRAIL_SIGNS_DATA[selectedSign].type === 'rocks' ? 'Đá' : TRAIL_SIGNS_DATA[selectedSign].type === 'twigs' ? 'Cành cây' : TRAIL_SIGNS_DATA[selectedSign].type === 'grass' ? 'Cỏ' : 'Hình vẽ'}
                              </span>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      )}

      {learnTab === 'lookup' && (
          <div className="space-y-6">
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                  <label className="block text-base font-bold text-gray-900 mb-3">Chọn ý nghĩa cần tra cứu:</label>
                  <div className="relative">
                      <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <select 
                        value={selectedSign || ''}
                        onChange={(e) => setSelectedSign(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-300 focus:border-emerald-500 focus:ring-0 outline-none text-xl font-bold text-gray-800 bg-gray-50 appearance-none cursor-pointer"
                      >
                          <option value="">-- Chọn nội dung --</option>
                          {Object.keys(TRAIL_SIGNS_DATA).map(key => (
                              <option key={key} value={key}>{TRAIL_SIGNS_DATA[key].label}</option>
                          ))}
                      </select>
                  </div>
              </div>

              {selectedSign && (
                  <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 flex flex-col items-center text-center animate-slide-up">
                      <h3 className="text-xl font-bold text-gray-500 mb-6 uppercase tracking-widest">Kết quả hình ảnh</h3>
                      <div className="p-8 bg-gray-50 rounded-full border-4 border-emerald-100 mb-6">
                          <TrailSignFigure signKey={selectedSign} size={200} />
                      </div>
                      <h2 className="text-3xl font-black text-gray-900 mb-2">{TRAIL_SIGNS_DATA[selectedSign].label}</h2>
                      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg font-medium">
                          <Info size={18} />
                          {TRAIL_SIGNS_DATA[selectedSign].desc}
                      </div>
                  </div>
              )}
          </div>
      )}
    </div>
  );
};

export default TrailSignsLesson;
