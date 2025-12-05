
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Heart, Calendar, ChevronLeft, ChevronRight, 
  CheckSquare, PlusCircle, MinusCircle, User, CheckCircle, 
  ThumbsUp, AlertTriangle, Shield, Clock, Filter, Search,
  Award, Zap, TrendingUp
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { MOCK_DOAN_SINH } from '../lib/mockData';
import { UserRole } from '../types';
import { useAuthStore } from '../store';

// Định nghĩa danh sách việc hằng ngày
const DAILY_CHECKLIST = [
    // VIỆC THIỆN (Positive)
    { id: 'g1', text: "Lễ Phật / Tụng Kinh tại gia", point: 2, type: 'good' },
    { id: 'g2', text: "Vâng lời cha mẹ / Giúp việc nhà", point: 1, type: 'good' },
    { id: 'g3', text: "Đi học / Sinh hoạt đúng giờ", point: 1, type: 'good' },
    { id: 'g4', text: "Hoàn thành bài tập về nhà", point: 1, type: 'good' },
    { id: 'g5', text: "Giúp đỡ người khác / Bố thí", point: 2, type: 'good' },
    { id: 'g6', text: "Ăn chay (Ngày rằm/mùng 1)", point: 2, type: 'good' },
    { id: 'g7', text: "Nói lời ái ngữ / Hòa nhã", point: 1, type: 'good' },
    { id: 'g8', text: "Mặc đồng phục đúng quy định", point: 1, type: 'good' },
    { id: 'g9', text: "Trung thực nhận lỗi khi sai", point: 2, type: 'good' },
    { id: 'g10', text: "Bảo vệ của công / Môi trường", point: 1, type: 'good' },
    { id: 'g11', text: "Đoàn kết, thương yêu bạn bè", point: 1, type: 'good' },
    { id: 'g12', text: "Thuộc bài Phật Pháp", point: 2, type: 'good' },

    // VIỆC CẦN KHẮC PHỤC (Negative)
    { id: 'b1', text: "Nói tục / Chửi thề", point: -2, type: 'bad' },
    { id: 'b2', text: "Nói dối người lớn", point: -2, type: 'bad' },
    { id: 'b3', text: "Cãi lời cha mẹ / Huynh trưởng", point: -2, type: 'bad' },
    { id: 'b4', text: "Lười biếng / Bỏ bê việc học", point: -1, type: 'bad' },
    { id: 'b5', text: "Xung đột / Đánh nhau", point: -5, type: 'bad' },
    { id: 'b6', text: "Đi trễ không lý do", point: -1, type: 'bad' },
    { id: 'b7', text: "Đồng phục không chỉnh tề", point: -1, type: 'bad' },
    { id: 'b8', text: "Thiếu vật dụng sinh hoạt (Sổ, còi...)", point: -1, type: 'bad' },
    { id: 'b9', text: "Mất trật tự trong giờ lễ", point: -2, type: 'bad' },
    { id: 'b10', text: "Sử dụng điện thoại trong giờ học", point: -1, type: 'bad' },
];

const GoodDeeds = () => {
  const { user } = useAuthStore();
  
  // --- STATE ---
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewTargetId, setViewTargetId] = useState<string>(user?.id || '');

  // Filter State for History List
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');

  // Helper to get past date string
  const getPastDate = (days: number) => {
      const d = new Date();
      d.setDate(d.getDate() - days);
      return d.toISOString().split('T')[0];
  };

  // Mock Data Structure: { 'userId': { 'YYYY-MM-DD': ['g1', 'b2'] } }
  // Added more historical data for chart demonstration
  const [deedLogs, setDeedLogs] = useState<Record<string, Record<string, string[]>>>({
      [user?.id || '']: {
          [getPastDate(4)]: ['g1', 'g2', 'g3', 'g12'],
          [getPastDate(3)]: ['g2', 'g4', 'b6'],
          [getPastDate(2)]: ['g1', 'g5', 'g7', 'g8'],
          [getPastDate(1)]: ['g1', 'g2', 'g3'],
          [new Date().toISOString().split('T')[0]]: ['g1', 'b2']
      },
      '1': { 
          [getPastDate(2)]: ['g1', 'g2', 'b5'],
          [getPastDate(1)]: ['g1', 'g2'],
          [new Date().toISOString().split('T')[0]]: ['g1', 'g2', 'b1']
      }
  });

  // Verification Status: { 'userId': { 'YYYY-MM-DD': true/false } }
  const [verificationLogs, setVerificationLogs] = useState<Record<string, Record<string, boolean>>>({
      '1': { [getPastDate(1)]: true } 
  });

  const [dailyNotes, setDailyNotes] = useState<Record<string, Record<string, string>>>({});

  const isDoanSinh = user?.role === UserRole.DOAN_SINH;
  const isManager = user?.role === UserRole.HUYNH_TRUONG || user?.role === UserRole.GIA_TRUONG || user?.role === UserRole.ADMIN_ROOT;

  // Set default view target when component mounts
  useEffect(() => {
      if (user) setViewTargetId(user.id);
  }, [user]);

  // --- LOGIC: PERMISSIONS ---
  const viewableMembers = useMemo(() => {
      if (isDoanSinh) return []; 
      if (user?.role === UserRole.ADMIN_ROOT || user?.role === UserRole.GIA_TRUONG) return MOCK_DOAN_SINH;
      // Huynh trưởng chỉ xem đoàn sinh trong đoàn mình
      return MOCK_DOAN_SINH.filter(m => m.doan === user?.doan);
  }, [user, isDoanSinh]);

  const currentDeedsList = deedLogs[viewTargetId]?.[selectedDate] || [];
  const isVerified = verificationLogs[viewTargetId]?.[selectedDate] || false;
  
  const dailyScore = useMemo(() => {
      return currentDeedsList.reduce((acc, deedId) => {
          const item = DAILY_CHECKLIST.find(i => i.id === deedId);
          return acc + (item ? item.point : 0);
      }, 0);
  }, [currentDeedsList]);

  // --- CHART DATA GENERATION ---
  const chartData = useMemo(() => {
      const userLogs = deedLogs[viewTargetId] || {};
      // Get last 7 days including today
      const dates = Array.from({length: 7}, (_, i) => getPastDate(6 - i));
      
      return dates.map(date => {
          const deedIds = userLogs[date] || [];
          let goodScore = 0;
          let badScore = 0;
          
          deedIds.forEach(id => {
              const item = DAILY_CHECKLIST.find(i => i.id === id);
              if (item?.type === 'good') goodScore += item.point;
              if (item?.type === 'bad') badScore += Math.abs(item.point); // Use absolute for visualization
          });

          return {
              name: new Date(date).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'}),
              dateFull: date,
              'Tích cực': goodScore,
              'Tiêu cực': badScore,
              amt: goodScore + badScore // For domain calculation if needed
          };
      });
  }, [deedLogs, viewTargetId]);

  // --- HANDLERS ---

  const handleDateChange = (days: number) => {
      const date = new Date(selectedDate);
      date.setDate(date.getDate() + days);
      setSelectedDate(date.toISOString().split('T')[0]);
  };

  const toggleDeed = (deedId: string) => {
      // Nếu đã xác nhận thì không cho sửa (trừ khi là quản lý muốn sửa lại)
      if (isVerified && isDoanSinh) return; 

      const userDeeds = deedLogs[viewTargetId] || {};
      const dateDeeds = userDeeds[selectedDate] || [];
      
      let newDateDeeds;
      if (dateDeeds.includes(deedId)) {
          newDateDeeds = dateDeeds.filter(id => id !== deedId);
      } else {
          newDateDeeds = [...dateDeeds, deedId];
      }

      setDeedLogs({
          ...deedLogs,
          [viewTargetId]: {
              ...userDeeds,
              [selectedDate]: newDateDeeds
          }
      });
  };

  const toggleVerification = () => {
      if (!isManager) return;
      const userVerifications = verificationLogs[viewTargetId] || {};
      setVerificationLogs({
          ...verificationLogs,
          [viewTargetId]: {
              ...userVerifications,
              [selectedDate]: !isVerified
          }
      });
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (isVerified && isDoanSinh) return;
      
      const userNotes = dailyNotes[viewTargetId] || {};
      setDailyNotes({
          ...dailyNotes,
          [viewTargetId]: {
              ...userNotes,
              [selectedDate]: e.target.value
          }
      });
  };

  // --- HISTORY LIST LOGIC ---
  const historyList = useMemo(() => {
      const userLogDates = Object.keys(deedLogs[viewTargetId] || {}).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      
      return userLogDates.map(date => {
          const deeds = deedLogs[viewTargetId][date];
          const verified = verificationLogs[viewTargetId]?.[date] || false;
          const points = deeds.reduce((acc, id) => {
              const item = DAILY_CHECKLIST.find(i => i.id === id);
              return acc + (item ? item.point : 0);
          }, 0);

          return { date, deeds, verified, points };
      }).filter(item => {
          if (filterStatus === 'all') return true;
          if (filterStatus === 'verified') return item.verified;
          if (filterStatus === 'pending') return !item.verified;
          return true;
      });
  }, [deedLogs, verificationLogs, viewTargetId, filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
             Sổ Tay Việc Thiện
          </h2>
          <p className="text-gray-500 text-sm mt-1">
             Tự soi mình mỗi ngày để rèn luyện thân tâm.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Left: Summary & Selector & Chart */}
          <div className="lg:col-span-1 space-y-6">
              {/* Selector for Managers */}
              {!isDoanSinh && (
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <User size={16} /> Xem sổ của đoàn sinh:
                      </label>
                      <select 
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={viewTargetId}
                        onChange={(e) => setViewTargetId(e.target.value)}
                      >
                          {user && <option value={user.id}>-- Sổ của tôi (Huynh trưởng) --</option>}
                          {viewableMembers.map(m => (
                              <option key={m.id} value={m.id}>{m.full_name} ({m.phap_danh})</option>
                          ))}
                      </select>
                      {user?.role === UserRole.HUYNH_TRUONG && (
                        <p className="text-xs text-gray-500 mt-2 italic flex items-center gap-1">
                            <Shield size={12}/> Đang xem danh sách đoàn {user.doan}
                        </p>
                      )}
                  </div>
              )}

              {/* Status Verification Card */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase">Trạng thái ngày {new Date(selectedDate).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})}</h3>
                  
                  <div className={`flex items-center gap-3 p-3 rounded-lg border mb-4 ${
                      isVerified 
                      ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
                      : 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400'
                  }`}>
                      {isVerified ? <CheckCircle size={24} /> : <Clock size={24} />}
                      <div>
                          <div className="font-bold">{isVerified ? 'Đã xác nhận' : 'Chờ xác nhận'}</div>
                          <div className="text-xs opacity-80">{isVerified ? 'Huynh trưởng đã duyệt sổ' : 'Chưa có xác nhận của HT'}</div>
                      </div>
                  </div>

                  {isManager && !isDoanSinh && (
                      <button 
                        onClick={toggleVerification}
                        className={`w-full py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                            isVerified 
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                      >
                          {isVerified ? 'Hủy xác nhận' : 'Ký xác nhận ngày này'}
                      </button>
                  )}
              </div>

              {/* Daily Score Summary */}
              <div className={`bg-gradient-to-br ${dailyScore >= 0 ? 'from-green-500 to-emerald-600' : 'from-red-500 to-orange-600'} text-white p-6 rounded-xl shadow-lg relative overflow-hidden transition-colors duration-500`}>
                  <Heart className="absolute -bottom-6 -right-6 w-40 h-40 opacity-20" />
                  <h3 className="text-lg font-semibold mb-1">Điểm Hạnh Kiểm</h3>
                  <div className="mt-4 flex items-end gap-2">
                      <div className="text-5xl font-bold">{dailyScore > 0 ? `+${dailyScore}` : dailyScore}</div>
                      <div className="text-white/80 text-sm mb-2">điểm hôm nay</div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/20 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                          <span><PlusCircle size={14} className="inline mr-1"/> Việc thiện:</span>
                          <span className="font-bold">{currentDeedsList.filter(id => DAILY_CHECKLIST.find(i => i.id === id)?.type === 'good').length}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                          <span><MinusCircle size={14} className="inline mr-1"/> Cần khắc phục:</span>
                          <span className="font-bold">{currentDeedsList.filter(id => DAILY_CHECKLIST.find(i => i.id === id)?.type === 'bad').length}</span>
                      </div>
                  </div>
              </div>

              {/* TREND CHART */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                      <TrendingUp size={16} className="text-primary-600" />
                      Xu hướng 7 ngày qua
                  </h3>
                  <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                              <defs>
                                  <linearGradient id="colorGood" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorBad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                              <XAxis dataKey="name" tick={{fontSize: 10, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                              <YAxis tick={{fontSize: 10, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                              <Tooltip contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                              <Area type="monotone" dataKey="Tích cực" stroke="#22c55e" fillOpacity={1} fill="url(#colorGood)" />
                              <Area type="monotone" dataKey="Tiêu cực" stroke="#ef4444" fillOpacity={1} fill="url(#colorBad)" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>

          {/* Right: Daily Checklist & History */}
          <div className="lg:col-span-2 space-y-6">
              
              {/* Main Checklist */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[600px]">
                  {/* Date Navigation */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
                      <button onClick={() => handleDateChange(-1)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition">
                          <ChevronLeft size={20} />
                      </button>
                      <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-white text-lg">
                          <Calendar size={20} className="text-primary-600"/>
                          {new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <button 
                        onClick={() => handleDateChange(1)} 
                        disabled={selectedDate >= new Date().toISOString().split('T')[0]}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                          <ChevronRight size={20} />
                      </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* COLUMN 1: GOOD DEEDS */}
                          <div>
                              <div className="sticky top-0 bg-white dark:bg-gray-800 pb-3 z-10 border-b border-gray-100 dark:border-gray-700 mb-4">
                                  <h4 className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                                      <ThumbsUp size={18} /> Việc Thiện (Tích cực)
                                  </h4>
                              </div>
                              <div className="space-y-3 pb-4">
                                  {DAILY_CHECKLIST.filter(i => i.type === 'good').map((item) => {
                                      const isChecked = currentDeedsList.includes(item.id);
                                      return (
                                          <div 
                                            key={item.id}
                                            onClick={() => toggleDeed(item.id)}
                                            className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-sm ${
                                                isChecked 
                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                                                : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                            } ${isVerified && isDoanSinh ? 'opacity-70 cursor-not-allowed' : ''}`}
                                          >
                                              <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center mr-3 transition-colors flex-shrink-0 ${
                                                  isChecked ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-transparent'
                                              }`}>
                                                  <CheckSquare size={14} />
                                              </div>
                                              <div className="flex-1">
                                                  <span className={`font-medium block text-sm ${isChecked ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                      {item.text}
                                                  </span>
                                              </div>
                                              <span className="text-xs font-bold text-green-600 ml-2">+{item.point}</span>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>

                          {/* COLUMN 2: BAD DEEDS */}
                          <div>
                               <div className="sticky top-0 bg-white dark:bg-gray-800 pb-3 z-10 border-b border-gray-100 dark:border-gray-700 mb-4">
                                  <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                                      <AlertTriangle size={18} /> Cần Khắc Phục
                                  </h4>
                               </div>
                              <div className="space-y-3 pb-4">
                                  {DAILY_CHECKLIST.filter(i => i.type === 'bad').map((item) => {
                                      const isChecked = currentDeedsList.includes(item.id);
                                      return (
                                          <div 
                                            key={item.id}
                                            onClick={() => toggleDeed(item.id)}
                                            className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-sm ${
                                                isChecked 
                                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                                                : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                            } ${isVerified && isDoanSinh ? 'opacity-70 cursor-not-allowed' : ''}`}
                                          >
                                              <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center mr-3 transition-colors flex-shrink-0 ${
                                                  isChecked ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-transparent'
                                              }`}>
                                                  <CheckSquare size={14} />
                                              </div>
                                              <div className="flex-1">
                                                  <span className={`font-medium block text-sm ${isChecked ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                      {item.text}
                                                  </span>
                                              </div>
                                              <span className="text-xs font-bold text-red-600 ml-2">{item.point}</span>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nhật ký tự ghi / Lời khuyên của Huynh trưởng</label>
                          <textarea 
                             rows={3}
                             disabled={isVerified && isDoanSinh}
                             placeholder={isDoanSinh ? "Hôm nay em đã làm được việc gì khác..." : "Ghi chú hoặc lời khuyên cho đoàn sinh..."}
                             className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none resize-none disabled:bg-gray-50 disabled:text-gray-500"
                             value={dailyNotes[viewTargetId]?.[selectedDate] || ''}
                             onChange={handleNoteChange}
                          ></textarea>
                          <div className="mt-2 text-right">
                              <span className="text-xs text-green-600 font-medium flex items-center justify-end gap-1">
                                  <CheckCircle size={12} /> Đã lưu tự động
                              </span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* History List with Status Filter */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                          <Clock size={18} /> Lịch sử ghi nhận
                      </h3>
                      
                      {/* FILTER DROPDOWN */}
                      <div className="flex items-center gap-2">
                          <Filter size={16} className="text-gray-400" />
                          <select 
                             className="text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 outline-none"
                             value={filterStatus}
                             onChange={(e) => setFilterStatus(e.target.value as any)}
                          >
                              <option value="all">Tất cả</option>
                              <option value="verified">Đã xác nhận</option>
                              <option value="pending">Chờ xác nhận</option>
                          </select>
                      </div>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                      {historyList.length > 0 ? (
                          <div className="divide-y divide-gray-100 dark:divide-gray-700">
                              {historyList.map((item) => (
                                  <div 
                                    key={item.date} 
                                    onClick={() => setSelectedDate(item.date)}
                                    className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${selectedDate === item.date ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                                  >
                                      <div className="flex items-center gap-3">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                              item.points >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                          }`}>
                                              {item.points > 0 ? `+${item.points}` : item.points}
                                          </div>
                                          <div>
                                              <div className="font-medium text-gray-900 dark:text-white text-sm">
                                                  {new Date(item.date).toLocaleDateString('vi-VN')}
                                              </div>
                                              <div className="text-xs text-gray-500">
                                                  {item.deeds.length} mục ghi nhận
                                              </div>
                                          </div>
                                      </div>
                                      
                                      <div className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                                          item.verified 
                                          ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                          : 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                      }`}>
                                          {item.verified ? <CheckCircle size={12} /> : <Clock size={12} />}
                                          {item.verified ? 'Đã duyệt' : 'Chờ duyệt'}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="p-8 text-center text-gray-400 text-sm">
                              Chưa có lịch sử ghi nhận nào phù hợp.
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default GoodDeeds;
