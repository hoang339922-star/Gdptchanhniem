
import React, { useState, useMemo } from 'react';
import { 
  Award, Star, ThumbsUp, ThumbsDown, Filter, AlertCircle, 
  CheckCircle, Plus, X, Search, Trophy, Medal, Flag,
  Clock, Save, Shield
} from 'lucide-react';
import { MOCK_ACHIEVEMENTS, MOCK_DOAN_SINH, MOCK_EVENTS } from '../lib/mockData';
import { Achievement, UserRole, DoanSinh } from '../types';
import { useAuthStore } from '../store';

const Achievements = () => {
  const { user, canAccessMember } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs'>('dashboard');
  const [achievements, setAchievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'bonus' | 'penalty'>('all');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'pending'>('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Partial<Achievement>>({
    type: 'bonus',
    category: 'Hoạt động',
    points: 5,
    date: new Date().toISOString().split('T')[0],
    is_verified: false
  });

  const isDoanSinh = user?.role === UserRole.DOAN_SINH;
  const isManager = user?.role === UserRole.HUYNH_TRUONG || user?.role === UserRole.GIA_TRUONG || user?.role === UserRole.ADMIN_ROOT;

  // --- LOGIC: PERMISSIONS & DATA FILTERING ---
  
  // Lọc danh sách đoàn sinh mà user hiện tại có quyền xem
  const visibleMembers = useMemo(() => {
      return MOCK_DOAN_SINH.filter(m => canAccessMember(m.id, m.doan));
  }, [user, canAccessMember]);

  // Lọc danh sách thành tích dựa trên quyền hạn
  const accessibleAchievements = useMemo(() => {
    return achievements.filter(a => {
      if (isDoanSinh) return a.doan_sinh_id === user?.id;
      
      // Kiểm tra xem user có quyền truy cập vào đoàn sinh sở hữu thành tích này không
      const member = MOCK_DOAN_SINH.find(m => m.id === a.doan_sinh_id);
      if (!member) return false; 
      
      return canAccessMember(member.id, member.doan);
    });
  }, [achievements, isDoanSinh, user, canAccessMember]);

  const filteredLogs = useMemo(() => {
    return accessibleAchievements.filter(item => {
      const matchesSearch = item.doan_sinh_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.reason.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesVerify = filterVerified === 'all' || 
                            (filterVerified === 'verified' ? item.is_verified : !item.is_verified);
      return matchesSearch && matchesType && matchesVerify;
    });
  }, [accessibleAchievements, searchTerm, filterType, filterVerified]);

  const leaderboard = useMemo(() => {
    const pointsMap: Record<string, { member: DoanSinh, points: number, bonuses: number, penalties: number }> = {};
    
    // Khởi tạo map chỉ với những đoàn sinh visible
    visibleMembers.forEach(m => {
        pointsMap[m.id] = { member: m, points: 0, bonuses: 0, penalties: 0 };
    });

    // Cộng điểm từ danh sách thành tích accessible
    accessibleAchievements.forEach(a => {
        if (pointsMap[a.doan_sinh_id]) {
            pointsMap[a.doan_sinh_id].points += a.points;
            if (a.type === 'bonus') pointsMap[a.doan_sinh_id].bonuses += 1;
            else pointsMap[a.doan_sinh_id].penalties += 1;
        }
    });

    return Object.values(pointsMap)
        .sort((a, b) => b.points - a.points)
        .slice(0, 10); 
  }, [accessibleAchievements, visibleMembers]);


  // --- ACHIEVEMENT HANDLERS ---
  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchievement.doan_sinh_id || !newAchievement.reason) return;

    const member = MOCK_DOAN_SINH.find(m => m.id === newAchievement.doan_sinh_id);
    const event = MOCK_EVENTS.find(ev => ev.id === newAchievement.event_id);

    const newItem: Achievement = {
        id: `ach_${Date.now()}`,
        doan_sinh_id: newAchievement.doan_sinh_id,
        doan_sinh_name: member?.full_name || 'Unknown',
        type: newAchievement.type as 'bonus' | 'penalty',
        category: newAchievement.category as any,
        points: Number(newAchievement.points) * (newAchievement.type === 'penalty' ? -1 : 1),
        reason: newAchievement.reason || '',
        date: newAchievement.date || new Date().toISOString(),
        event_id: newAchievement.event_id,
        event_title: event?.title,
        is_verified: false
    };

    setAchievements([newItem, ...achievements]);
    setIsAddModalOpen(false);
    setNewAchievement({
        type: 'bonus',
        category: 'Hoạt động',
        points: 5,
        date: new Date().toISOString().split('T')[0],
        is_verified: false
    });
  };

  const toggleVerification = (id: string) => {
      setAchievements(prev => prev.map(a => 
          a.id === id ? { ...a, is_verified: !a.is_verified, verified_at: !a.is_verified ? new Date().toISOString() : undefined } : a
      ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
             Sổ Hạnh Kiểm & Khen Thưởng
          </h2>
          <p className="text-gray-500 text-sm mt-1">
             Ghi nhận rèn luyện, khen thưởng và kỷ luật.
          </p>
        </div>
        {isManager && (
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-600/20 flex items-center gap-2"
            >
                <Plus size={16} /> Ghi sổ
            </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <nav className="-mb-px flex gap-6 min-w-max">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === 'dashboard' 
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                  <Trophy size={18} /> Tổng quan & Xếp hạng
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === 'logs' 
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                  <Filter size={18} /> Sổ ghi chép
              </button>
          </nav>
      </div>

      {/* TAB CONTENT: DASHBOARD & LEADERBOARD */}
      {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
              {isDoanSinh ? (
                  /* PERSONAL SUMMARY FOR DOAN SINH */
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                        <Award className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20" />
                        <h3 className="text-lg font-semibold mb-1">Điểm Tích Lũy</h3>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-xl">
                                <Star fill="white" className="text-transparent" size={24} />
                            </div>
                            <div>
                                <div className="font-bold text-3xl">
                                    {accessibleAchievements.reduce((acc, curr) => acc + curr.points, 0)}
                                </div>
                                <div className="text-sm opacity-90">điểm hạnh đức</div>
                            </div>
                        </div>
                     </div>
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                         <h3 className="text-gray-500 text-sm font-medium mb-4">Thống kê hoạt động</h3>
                         <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                 <div className="flex items-center gap-2 text-green-600">
                                     <ThumbsUp size={18} /> <span>Điểm cộng</span>
                                 </div>
                                 <span className="font-bold text-lg">{accessibleAchievements.filter(a => a.type === 'bonus').length}</span>
                             </div>
                             <div className="flex justify-between items-center">
                                 <div className="flex items-center gap-2 text-red-600">
                                     <ThumbsDown size={18} /> <span>Điểm trừ</span>
                                 </div>
                                 <span className="font-bold text-lg">{accessibleAchievements.filter(a => a.type === 'penalty').length}</span>
                             </div>
                             <div className="h-px bg-gray-100 dark:bg-gray-700"></div>
                             <div className="flex justify-between items-center">
                                 <div className="flex items-center gap-2 text-blue-600">
                                     <Shield size={18} /> <span>Đã xác thực</span>
                                 </div>
                                 <span className="font-bold text-lg">{accessibleAchievements.filter(a => a.is_verified).length}</span>
                             </div>
                         </div>
                     </div>
                  </div>
              ) : (
                  /* LEADERBOARD FOR MANAGERS */
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Top 1 */}
                        {leaderboard[0] && (
                            <div className="md:order-2 bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-900/20 dark:to-gray-800 border-2 border-yellow-400 p-6 rounded-2xl shadow-xl flex flex-col items-center transform md:-translate-y-4 relative">
                                <div className="absolute -top-6">
                                    <Trophy size={48} className="text-yellow-500 fill-yellow-400 drop-shadow-lg" />
                                </div>
                                <div className="mt-6 mb-3 relative">
                                    <img src={leaderboard[0].member.avatar_url} className="w-20 h-20 rounded-full border-4 border-yellow-400 object-cover" />
                                    <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white">1</div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{leaderboard[0].member.full_name}</h3>
                                <p className="text-sm text-gray-500 mb-2">{leaderboard[0].member.doan}</p>
                                <div className="px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full font-bold text-lg">
                                    {leaderboard[0].points} điểm
                                </div>
                            </div>
                        )}
                        {/* Top 2 */}
                        {leaderboard[1] && (
                             <div className="md:order-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-sm flex flex-col items-center mt-4">
                                <div className="mb-3 relative">
                                    <img src={leaderboard[1].member.avatar_url} className="w-16 h-16 rounded-full border-4 border-gray-300 object-cover" />
                                    <div className="absolute -bottom-2 -right-2 bg-gray-400 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold border-2 border-white">2</div>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{leaderboard[1].member.full_name}</h3>
                                <p className="text-sm text-gray-500 mb-2">{leaderboard[1].member.doan}</p>
                                <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-bold">
                                    {leaderboard[1].points} điểm
                                </div>
                            </div>
                        )}
                        {/* Top 3 */}
                        {leaderboard[2] && (
                             <div className="md:order-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-sm flex flex-col items-center mt-4">
                                <div className="mb-3 relative">
                                    <img src={leaderboard[2].member.avatar_url} className="w-16 h-16 rounded-full border-4 border-orange-300 object-cover" />
                                    <div className="absolute -bottom-2 -right-2 bg-orange-400 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold border-2 border-white">3</div>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{leaderboard[2].member.full_name}</h3>
                                <p className="text-sm text-gray-500 mb-2">{leaderboard[2].member.doan}</p>
                                <div className="px-3 py-1 bg-orange-50 text-orange-800 rounded-full font-bold">
                                    {leaderboard[2].points} điểm
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Rest of the list */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                         <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300">
                             Bảng Xếp Hạng Chi Tiết ({visibleMembers.length} đoàn sinh)
                         </div>
                         <div className="divide-y divide-gray-100 dark:divide-gray-700">
                             {leaderboard.slice(3).map((item, idx) => (
                                 <div key={item.member.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                     <div className="w-8 text-center font-bold text-gray-400">#{idx + 4}</div>
                                     <img src={item.member.avatar_url} className="w-10 h-10 rounded-full object-cover" />
                                     <div className="flex-1">
                                         <div className="font-medium text-gray-900 dark:text-white">{item.member.full_name}</div>
                                         <div className="text-xs text-gray-500">{item.member.doan}</div>
                                     </div>
                                     <div className="flex gap-4 text-sm">
                                         <span className="text-green-600 flex items-center gap-1"><ThumbsUp size={14}/> {item.bonuses}</span>
                                         <span className="text-red-600 flex items-center gap-1"><ThumbsDown size={14}/> {item.penalties}</span>
                                     </div>
                                     <div className="w-20 text-right font-bold text-primary-600">{item.points} đ</div>
                                 </div>
                             ))}
                             {leaderboard.length <= 3 && (
                                 <div className="p-8 text-center text-gray-500">Chưa có đủ dữ liệu xếp hạng.</div>
                             )}
                         </div>
                    </div>
                  </>
              )}
          </div>
      )}

      {/* TAB CONTENT: LOGS */}
      {activeTab === 'logs' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in">
              {/* Toolbar */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text"
                        placeholder="Tìm kiếm theo tên, lý do..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    <select 
                        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-sm outline-none"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                    >
                        <option value="all">Tất cả loại điểm</option>
                        <option value="bonus">Điểm cộng</option>
                        <option value="penalty">Điểm trừ</option>
                    </select>
                    <select 
                        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-sm outline-none"
                        value={filterVerified}
                        onChange={(e) => setFilterVerified(e.target.value as any)}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="verified">Đã xác thực</option>
                        <option value="pending">Chờ xác thực</option>
                    </select>
                </div>
              </div>

              {/* List */}
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredLogs.length > 0 ? (
                      filteredLogs.map(item => (
                          <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center">
                              {/* Date & Type Icon */}
                              <div className="flex items-center gap-3 md:w-48">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      item.type === 'bonus' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                  }`}>
                                      {item.type === 'bonus' ? <Star size={18} /> : <AlertCircle size={18} />}
                                  </div>
                                  <div>
                                      <div className="text-sm font-medium text-gray-900 dark:text-white">{new Date(item.date).toLocaleDateString('vi-VN')}</div>
                                      <div className="text-xs text-gray-500">{item.category}</div>
                                  </div>
                              </div>

                              {/* Content */}
                              <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                      <h4 className="font-semibold text-gray-900 dark:text-white">{item.doan_sinh_name}</h4>
                                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                          item.type === 'bonus' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                      }`}>
                                          {item.points > 0 ? '+' : ''}{item.points}
                                      </span>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{item.reason}</p>
                                  {item.event_title && (
                                      <div className="flex items-center gap-1 text-xs text-primary-600 mt-1">
                                          <Flag size={12} /> Sự kiện: {item.event_title}
                                      </div>
                                  )}
                              </div>

                              {/* Verification Status */}
                              <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-4 min-w-[160px]">
                                   {item.is_verified ? (
                                       <div className="flex items-center gap-1.5 text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded border border-green-100">
                                           <CheckCircle size={14} /> PH đã xác nhận
                                       </div>
                                   ) : (
                                       <div className="flex items-center gap-1.5 text-orange-600 text-xs font-medium bg-orange-50 px-2 py-1 rounded border border-orange-100">
                                           <Clock size={14} /> Chờ xác nhận
                                       </div>
                                   )}
                                   
                                   {/* Simulate Parent Verification Action (Only visible for Manager or Parent role) */}
                                   {(isManager) && (
                                       <button 
                                          onClick={() => toggleVerification(item.id)}
                                          className={`text-xs underline ${item.is_verified ? 'text-gray-400' : 'text-primary-600'}`}
                                          title="Mô phỏng phụ huynh xác nhận"
                                       >
                                           {item.is_verified ? 'Hủy xác nhận' : 'Xác nhận ngay'}
                                       </button>
                                   )}
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="p-12 text-center text-gray-500">Không tìm thấy bản ghi nào phù hợp.</div>
                  )}
              </div>
          </div>
      )}

      {/* ADD ACHIEVEMENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
           <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-primary-600 text-white">
                  <h3 className="text-xl font-bold flex items-center gap-2"><Medal size={20}/> Ghi Sổ Hạnh Đức</h3>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-white/80 hover:text-white"><X size={20}/></button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[80vh]">
                  <form onSubmit={handleAddAchievement} className="space-y-4">
                      {/* Member Select */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Đoàn sinh (*)</label>
                          <select 
                            required
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={newAchievement.doan_sinh_id}
                            onChange={(e) => setNewAchievement({...newAchievement, doan_sinh_id: e.target.value})}
                          >
                              <option value="">-- Chọn đoàn sinh --</option>
                              {visibleMembers.map(m => (
                                  <option key={m.id} value={m.id}>{m.full_name} ({m.doan})</option>
                              ))}
                          </select>
                      </div>

                      {/* Event Link (Optional) */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Liên kết sự kiện (Tùy chọn)</label>
                          <select 
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={newAchievement.event_id}
                            onChange={(e) => setNewAchievement({...newAchievement, event_id: e.target.value})}
                          >
                              <option value="">-- Không có sự kiện --</option>
                              {MOCK_EVENTS.filter(ev => ev.status !== 'upcoming').map(ev => (
                                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                              ))}
                          </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loại</label>
                              <div className="flex gap-2">
                                  <button 
                                    type="button"
                                    onClick={() => setNewAchievement({...newAchievement, type: 'bonus', points: Math.abs(Number(newAchievement.points))})}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium border ${newAchievement.type === 'bonus' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-200 text-gray-500'}`}
                                  >
                                      Khen thưởng
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => setNewAchievement({...newAchievement, type: 'penalty', points: -Math.abs(Number(newAchievement.points))})}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium border ${newAchievement.type === 'penalty' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-200 text-gray-500'}`}
                                  >
                                      Kỷ luật
                                  </button>
                              </div>
                          </div>
                          <div>
                               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Điểm số</label>
                               <input 
                                    type="number"
                                    min="1"
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={Math.abs(Number(newAchievement.points))}
                                    onChange={(e) => setNewAchievement({...newAchievement, points: Number(e.target.value)})}
                               />
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hạng mục</label>
                          <select 
                             className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                             value={newAchievement.category}
                             onChange={(e) => setNewAchievement({...newAchievement, category: e.target.value as any})}
                          >
                              <option value="Chuyên cần">Chuyên cần</option>
                              <option value="Học tập">Học tập</option>
                              <option value="Hoạt động">Hoạt động</option>
                              <option value="Kỷ luật">Kỷ luật</option>
                              <option value="Khác">Khác</option>
                          </select>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lý do / Nội dung (*)</label>
                          <textarea 
                             required
                             rows={3}
                             className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                             placeholder="Nhập lý do chi tiết..."
                             value={newAchievement.reason}
                             onChange={(e) => setNewAchievement({...newAchievement, reason: e.target.value})}
                          ></textarea>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ngày ghi nhận</label>
                          <input 
                             type="date"
                             className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                             value={newAchievement.date}
                             onChange={(e) => setNewAchievement({...newAchievement, date: e.target.value})}
                          />
                      </div>

                      <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 mt-6">
                         <button 
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 rounded-lg transition"
                          >
                            Hủy bỏ
                          </button>
                          <button 
                            type="submit"
                            className="px-5 py-2.5 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition flex items-center gap-2"
                          >
                            <Save size={18} /> Lưu Ghi Nhận
                          </button>
                      </div>
                  </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;
