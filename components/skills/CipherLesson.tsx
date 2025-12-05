
import React, { useState } from 'react';
import { ArrowRight, Lock, Key, Unlock, GraduationCap, Play, RefreshCw, Hash, Grid } from 'lucide-react';

interface CipherLessonProps {
  onBack: () => void;
  onStartQuiz: () => void;
}

// Helper component để vẽ ký hiệu Pigpen (Chuồng bò) bằng SVG
const PigpenSymbol: React.FC<{ char: string }> = ({ char }) => {
    const c = char.toUpperCase();
    if (!/[A-Z]/.test(c)) return <span className="text-3xl font-mono text-gray-400 mx-2 flex items-end pb-2">{c}</span>;

    const isDot = ['J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'W', 'X', 'Y', 'Z'].includes(c);
    
    // Định nghĩa đường vẽ cho khung (ViewBox 0 0 100 100)
    let d = "";
    
    // Khung 1 & 2 (Vuông)
    // A/J: Góc phải dưới
    if (['A', 'J'].includes(c)) d = "M 30 10 L 30 70 L 90 70"; 
    // B/K: Chữ U (Hở trên)
    if (['B', 'K'].includes(c)) d = "M 10 10 L 10 70 L 90 70 L 90 10";
    // C/L: Góc trái dưới
    if (['C', 'L'].includes(c)) d = "M 70 10 L 70 70 L 10 70";
    // D/M: Chữ C (Hở phải) - Thực tế trong GĐPT thường dùng |-|
    if (['D', 'M'].includes(c)) d = "M 10 10 L 90 10 L 90 90 L 10 90"; // Chữ U ngược (Hở dưới)? 
    // GĐPT Chuẩn:
    // A B C
    // D E F
    // G H I
    // A: _|  B: |_|  C: |_
    // D: -| (hở trái) E: [] (kín) F: |- (hở phải) -> Sai, E là ô kín, D hở trái, F hở phải
    // G: -| (góc phải trên) H: T ngược I: Góc trái trên
    
    // Sửa lại theo chuẩn thông dụng nhất:
    // A: _|
    if (['A', 'J'].includes(c)) d = "M 20 20 L 20 80 L 80 80"; 
    // B: |_| (U shape)
    if (['B', 'K'].includes(c)) d = "M 20 20 L 20 80 L 80 80 L 80 20";
    // C: |_
    if (['C', 'L'].includes(c)) d = "M 80 20 L 80 80 L 20 80";
    // D: ] (Hở trái)
    if (['D', 'M'].includes(c)) d = "M 20 20 L 80 20 L 80 80 L 20 80";
    // E: [] (Kín - hoặc ô vuông)
    if (['E', 'N'].includes(c)) d = "M 20 20 L 80 20 L 80 80 L 20 80 L 20 20";
    // F: [ (Hở phải)
    if (['F', 'O'].includes(c)) d = "M 80 20 L 20 20 L 20 80 L 80 80";
    // G: Top Right Corner (7 shape)
    if (['G', 'P'].includes(c)) d = "M 20 80 L 20 20 L 80 20";
    // H: Top (n shape)
    if (['H', 'Q'].includes(c)) d = "M 20 80 L 20 20 L 80 20 L 80 80";
    // I: Top Left Corner (Gamma shape)
    if (['I', 'R'].includes(c)) d = "M 80 80 L 80 20 L 20 20";

    // Khung 3 & 4 (Chữ X)
    // S/W: V shape (Top)
    if (['S', 'W'].includes(c)) d = "M 20 20 L 50 80 L 80 20";
    // T/X: > shape (Right)
    if (['T', 'X'].includes(c)) d = "M 20 20 L 80 50 L 20 80";
    // U/Y: < shape (Left)
    if (['U', 'Y'].includes(c)) d = "M 80 20 L 20 50 L 80 80";
    // V/Z: ^ shape (Bottom)
    if (['V', 'Z'].includes(c)) d = "M 20 80 L 50 20 L 80 80";

    return (
        <svg width="50" height="50" viewBox="0 0 100 100" className="inline-block mx-1 mb-2 bg-white rounded border border-gray-100 shadow-sm">
            <path d={d} stroke="#7e22ce" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            {isDot && <circle cx="50" cy="50" r="8" fill="#7e22ce" />}
        </svg>
    );
};

const CipherLesson: React.FC<CipherLessonProps> = ({ onBack, onStartQuiz }) => {
  const [mode, setMode] = useState<'menu' | 'learn'>('menu');
  const [toolTab, setToolTab] = useState<'caesar' | 'substitution' | 'reverse' | 'pigpen'>('caesar');
  
  // States for tools
  const [inputText, setInputText] = useState('');
  const [shift, setShift] = useState(3); // For Caesar

  // Logic mã hóa Caesar
  const caesarCipher = (str: string, amount: number) => {
    if (amount < 0) return caesarCipher(str, amount + 26);
    let output = '';
    for (let i = 0; i < str.length; i++) {
      let c = str[i];
      if (c.match(/[a-z]/i)) {
        let code = str.charCodeAt(i);
        if (code >= 65 && code <= 90) {
          c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
        }
      }
      output += c;
    }
    return output;
  };

  // Logic thay thế số (A=1, B=2...)
  const numCipher = (str: string) => {
      return str.toUpperCase().split('').map(c => {
          const code = c.charCodeAt(0);
          if (code >= 65 && code <= 90) return (code - 64).toString();
          return c;
      }).join('-');
  };

  // Logic đảo ngược
  const reverseCipher = (str: string) => str.split('').reverse().join('');

  const getResult = () => {
      if (!inputText) return "Kết quả sẽ hiện ở đây...";
      switch (toolTab) {
          case 'caesar': return caesarCipher(inputText, shift);
          case 'substitution': return numCipher(inputText);
          case 'reverse': return reverseCipher(inputText);
          case 'pigpen': return ""; // Handled visually
          default: return "";
      }
  };

  // 1. Menu Mode
  if (mode === 'menu') {
      return (
          <div className="max-w-3xl mx-auto space-y-8 py-10 animate-fade-in bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <button onClick={onBack} className="text-sm font-bold text-gray-600 hover:text-black flex items-center gap-2">
                 <ArrowRight className="rotate-180" size={20} /> Quay lại Menu Chính
              </button>
              
              <div className="text-center">
                  <div className="w-24 h-24 bg-white border-4 border-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                      <Lock size={48} />
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 mb-2 uppercase">Mật Thư</h2>
                  <p className="text-gray-600 font-medium">Nghệ thuật giấu tin và giải mã</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setMode('learn')}
                    className="p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-purple-500 hover:shadow-xl transition-all text-left flex flex-col group items-center text-center"
                  >
                      <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <GraduationCap size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Công Cụ Giải Mã</h3>
                      <p className="text-gray-500 mt-2 text-sm font-medium">Các bộ công cụ hỗ trợ giải mã Caesar, Thay thế số, Chuồng bò...</p>
                  </button>

                  <button 
                    onClick={onStartQuiz}
                    className="p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:shadow-xl transition-all text-left flex flex-col group items-center text-center"
                  >
                      <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Play size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Làm Bài Tập</h3>
                      <p className="text-gray-500 mt-2 text-sm font-medium">Giải các mật thư đố vui để rèn luyện tư duy logic.</p>
                  </button>
              </div>
          </div>
      );
  }

  // 2. Learning/Tool Mode
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <button onClick={() => setMode('menu')} className="text-sm font-bold text-gray-600 hover:text-black flex items-center gap-2">
             <ArrowRight className="rotate-180" size={18} /> Menu Mật Thư
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-bold uppercase tracking-wider text-sm">
             <Key size={16} /> Cipher Tools
          </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Tool Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
              <button 
                onClick={() => setToolTab('caesar')}
                className={`flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                    toolTab === 'caesar' 
                    ? 'text-purple-700 border-purple-600 bg-white' 
                    : 'text-gray-500 border-transparent hover:bg-gray-100'
                }`}
              >
                  <RefreshCw size={18} /> Caesar
              </button>
              <button 
                onClick={() => setToolTab('pigpen')}
                className={`flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                    toolTab === 'pigpen' 
                    ? 'text-purple-700 border-purple-600 bg-white' 
                    : 'text-gray-500 border-transparent hover:bg-gray-100'
                }`}
              >
                  <Grid size={18} /> Chuồng Bò
              </button>
              <button 
                onClick={() => setToolTab('substitution')}
                className={`flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                    toolTab === 'substitution' 
                    ? 'text-purple-700 border-purple-600 bg-white' 
                    : 'text-gray-500 border-transparent hover:bg-gray-100'
                }`}
              >
                  <Hash size={18} /> Thay Thế Số
              </button>
              <button 
                onClick={() => setToolTab('reverse')}
                className={`flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                    toolTab === 'reverse' 
                    ? 'text-purple-700 border-purple-600 bg-white' 
                    : 'text-gray-500 border-transparent hover:bg-gray-100'
                }`}
              >
                  <RefreshCw size={18} className="rotate-90" /> Đảo Ngược
              </button>
          </div>

          <div className="p-8 space-y-8">
              {/* Input Area */}
              <div>
                  <label className="block text-base font-bold text-gray-900 mb-2">Bản tin gốc (Plain Text):</label>
                  <textarea 
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-0 outline-none text-lg"
                      rows={3}
                      placeholder="Nhập nội dung cần mã hóa (Tiếng Việt không dấu)..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                  ></textarea>
              </div>

              {/* Specific Controls */}
              {toolTab === 'caesar' && (
                  <div className="flex items-center gap-4 bg-purple-50 p-4 rounded-xl border border-purple-100">
                      <span className="font-bold text-purple-900">Khóa K (Độ dời):</span>
                      <input 
                        type="range" min="1" max="25" 
                        value={shift} 
                        onChange={(e) => setShift(Number(e.target.value))}
                        className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <span className="font-mono font-bold text-xl w-10 text-center bg-white py-1 rounded border border-purple-200">{shift}</span>
                  </div>
              )}

              {/* Output Area */}
              <div>
                  <label className="block text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Unlock size={18} className="text-green-600" /> Kết quả (Result):
                  </label>
                  
                  {toolTab === 'pigpen' ? (
                      <div className="bg-gray-50 p-6 rounded-xl min-h-[150px] border-2 border-gray-100 flex flex-wrap items-center justify-center gap-2">
                          {inputText ? (
                              inputText.split('').map((char, idx) => (
                                  <PigpenSymbol key={idx} char={char} />
                              ))
                          ) : (
                              <span className="text-gray-400 italic">Nhập văn bản để xem ký hiệu chuồng bò...</span>
                          )}
                      </div>
                  ) : (
                      <div className="bg-gray-900 p-6 rounded-xl min-h-[100px] flex items-center justify-center text-center relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                              <Key size={64} className="text-white" />
                          </div>
                          <p className="text-2xl font-mono font-bold text-green-400 break-all tracking-wider uppercase">
                              {getResult()}
                          </p>
                      </div>
                  )}
              </div>

              {/* Explanation Box */}
              <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-gray-700 mb-1 flex items-center gap-2"><GraduationCap size={16}/> Nguyên lý:</h4>
                  {toolTab === 'caesar' && "Hệ thống Caesar (Dời chỗ) thay thế mỗi ký tự bằng ký tự đứng sau nó K vị trí trong bảng chữ cái."}
                  {toolTab === 'substitution' && "Hệ thống thay thế đơn giản: A=1, B=2, C=3... Z=26. Dấu gạch nối (-) ngăn cách các chữ cái."}
                  {toolTab === 'reverse' && "Hệ thống viết ngược toàn bộ bản tin hoặc viết ngược từng từ."}
                  {toolTab === 'pigpen' && "Mật thư Chuồng Bò (Pigpen) sử dụng các khung hình học (có chấm hoặc không) để thay thế cho chữ cái. A-I (khung 1 #), J-R (khung 2 # có chấm), S-V (chữ X), W-Z (chữ X có chấm)."}
              </div>
          </div>
      </div>
    </div>
  );
};

export default CipherLesson;
