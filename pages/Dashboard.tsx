import React, { useMemo, useState } from 'react';
import { 
  Users, UserCheck, Wallet, Calendar, 
  TrendingUp, AlertTriangle, CheckCircle, Award, BookOpen,
  X, Save, Plus
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';
import { MOCK_DOAN_SINH, MOCK_TRANSACTIONS, MOCK_EVENTS, MOCK_ACHIEVEMENTS } from '../lib/mockData';
import { useAuthStore } from '../store';
import { UserRole, Event } from '../types';

const StatCard = ({ title, value, icon: Icon, trend, color, subValue }: any) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {subValue && (
      <div className="mt-4 flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          trend === 'up' ? 'bg-green-100 text-green-700' : 
          trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{subValue}
        </span>
        <span className="text-xs text-gray-400">cập nhật mới</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const { user, canAccessDoan, canAccessMember } = useAuthStore();
  const isDoanSinh = user?.role === UserRole.DOAN_SINH;
  const isHuynhTruong = user?.role === UserRole.HUYNH_TRUONG;

  // Local state for Events (to support adding new ones from Dashboard)
  const [localEvents, setLocalEvents] = useState<Event[]>(MOCK_EVENTS);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    type: 'Sinh hoạt',
    participants_count: 0,
    status: 'upcoming',
    date: new Date().toISOString().split('T')[0]
  });

  // --- LOGIC CHO NGƯỜI QUẢN LÝ (Admin, Huynh Trưởng) ---
  const { filteredMembers, filteredFunds } = useMemo(() => {
    const members = MOCK_DOAN_SINH.filter(m => canAccessDoan(m.doan));
    // Nếu là đoàn sinh thì không xem quỹ (trả về mảng rỗng) hoặc quỹ cá nhân nếu có
    const funds = isDoanSinh ? [] : MOCK_TRANSACTIONS; 
    return { filteredMembers: members, filteredFunds: funds };
  }, [user, canAccessDoan, isDoanSinh]);

  // --- LOGIC CHO ĐOÀN SINH (Cá nhân) ---
  const personalStats = useMemo(() => {
     if (!isDoanSinh || !user) return null;
     
     const myAchievements = MOCK_ACHIEVEMENTS.filter(a => a.doan_sinh_id === user.id);
     const totalPoints = myAchievements.reduce((acc, curr) => acc + curr.points, 0);
     const myEvents = localEvents.filter(e => e.status === 'upcoming'); // Đoàn sinh thấy sự kiện chung
     
     return {
         totalPoints,
         upcomingEventsCount: myEvents.length,
         attendanceRate: 95 // Hardcoded for demo
     };
  }, [user, isDoanSinh, localEvents]);

  const totalMembers = filteredMembers.length;
  const totalFunds = filteredFunds.reduce((acc, curr) => 
    curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0
  );

  const attendanceData = [
    { name: 'Tuần 1', rate: 85 },
    { name: 'Tuần 2', rate: 88 },
    { name: 'Tuần 3', rate: 92 },
    { name: 'Tuần 4', rate: 87 },
  ];

  // Calculate Doan distribution based on visible members
  const doanDistribution = useMemo(() => {
     const counts: Record<string, number> = {};
     filteredMembers.forEach(m => {
       counts[m.doan] = (counts[m.doan] || 0) + 1;
     });
     return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [filteredMembers]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;

    const createdEvent: Event = {
      ...newEvent,
      id: `evt_dash_${Date.now()}`,
      participants_count: 0,
    } as Event;

    setLocalEvents([createdEvent, ...localEvents]);
    setIsEventModalOpen(false);
    setNewEvent({
      type: 'Sinh hoạt',
      participants_count: 0,
      status: 'upcoming',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tổng quan</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Xin chào {user?.full_name} ({isDoanSinh ? `Đoàn sinh ${user.doan}` : isHuynhTruong ? `HT ${user?.doan}` : 'Ban Quản Trị'})
          </p>
        </div>
        {!isDoanSinh && (
          <div className="flex gap-2">
            <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              Xuất báo cáo
            </button>
            <button 
              onClick={() => setIsEventModalOpen(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-600/20 flex items-center gap-2"
            >
              <Plus size={16} /> Tạo sự kiện mới
            </button>
          </div>
        )}
      </div>

      {isDoanSinh ? (
        // --- DASHBOARD VIEW FOR DOAN SINH ---
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard 
            title="Điểm chuyên cần" 
            value={`${personalStats?.attendanceRate}%`} 
            icon={UserCheck} 
            trend="up" 
            subValue="Giữ vững"
            color="bg-green-500"
          />
           <StatCard 
            title="Điểm thi đua" 
            value={personalStats?.totalPoints} 
            icon={Award} 
            trend={personalStats?.totalPoints || 0 > 0 ? "up" : "down"} 
            subValue="điểm"
            color="bg-yellow-500"
          />
           <StatCard 
            title="Sự kiện sắp tới" 
            value={personalStats?.upcomingEventsCount} 
            icon={Calendar} 
            subValue="sự kiện"
            color="bg-blue-500"
          />
           <StatCard 
            title="Bài học hoàn thành" 
            value="8/12" 
            icon={BookOpen} 
            trend="up"
            subValue="tiến độ tốt"
            color="bg-purple-500"
          />
        </div>
      ) : (
        // --- DASHBOARD VIEW FOR MANAGEMENT ---
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title={isHuynhTruong ? `Đoàn sinh ${user?.doan}` : "Tổng Đoàn Sinh"}
            value={totalMembers} 
            icon={Users} 
            trend="up" 
            subValue="2"
            color="bg-blue-500"
          />
          <StatCard 
            title="Tỷ lệ chuyên cần" 
            value="87%" 
            icon={UserCheck} 
            trend="up" 
            subValue="2%"
            color="bg-green-500"
          />
          <StatCard 
            title="Quỹ đoàn" 
            value={`${(totalFunds/1000000).toFixed(1)}M`} 
            icon={Wallet} 
            trend="down" 
            subValue="1.2M"
            color="bg-purple-500"
          />
          <StatCard 
            title="Sự kiện sắp tới" 
            value={localEvents.filter(e => e.status === 'upcoming').length} 
            icon={Calendar} 
            trend="up" 
            subValue="1"
            color="bg-orange-500"
          />
        </div>
      )}

      {/* Charts Section - Only for Management */}
      {!isDoanSinh && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white">Xu hướng điểm danh tháng 10</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#395270" 
                    strokeWidth={3} 
                    dot={{r: 4, fill: '#395270', strokeWidth: 2, stroke: '#fff'}}
                    activeDot={{r: 6}}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white">Phân bố đoàn sinh</h3>
            {doanDistribution.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={doanDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                    <Bar dataKey="count" fill="#FFC000" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                 Không có dữ liệu hiển thị
              </div>
            )}
          </div>
        </div>
      )}

      {/* Events & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Sự kiện sắp tới</h3>
            <a href="#/events" className="text-sm text-primary-600 hover:text-primary-700">Xem tất cả</a>
          </div>
          <div className="space-y-4">
            {localEvents.filter(e => e.status === 'upcoming').slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleString('vi-VN', { month: 'short' })}</span>
                  <span className="text-lg font-bold">{new Date(event.date).getDate()}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{event.location} • {event.participants_count} tham gia</p>
                </div>
              </div>
            ))}
            {localEvents.filter(e => e.status === 'upcoming').length === 0 && (
                 <p className="text-center text-gray-500 py-4">Chưa có sự kiện nào.</p>
            )}
          </div>
        </div>

        {!isDoanSinh && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Cảnh báo cần chú ý</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-yellow-100 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/50">
                <AlertTriangle className="text-yellow-600 w-5 h-5 flex-shrink-0" />
                <div className="text-sm text-gray-800 dark:text-gray-200">
                  <span className="font-semibold">Điểm danh thấp:</span> Đoàn Thiếu Nam tuần này vắng 5 em.
                </div>
              </div>
               <div className="flex items-center gap-3 p-3 rounded-lg border border-red-100 bg-red-50 dark:bg-red-900/20 dark:border-red-900/50">
                <Wallet className="text-red-600 w-5 h-5 flex-shrink-0" />
                <div className="text-sm text-gray-800 dark:text-gray-200">
                  <span className="font-semibold">Quỹ đoàn:</span> Chi phí trại vượt ngân sách dự kiến 10%.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tạo Sự Kiện Mới</h3>
              <button 
                onClick={() => setIsEventModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên sự kiện</label>
                <input 
                  type="text" 
                  value={newEvent.title || ''} 
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white outline-none"
                  required
                  placeholder="Nhập tên sự kiện..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ngày tổ chức</label>
                    <input 
                      type="date" 
                      value={newEvent.date || ''} 
                      onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white outline-none"
                      required
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loại hình</label>
                    <select
                      value={newEvent.type || ''} 
                      onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white outline-none"
                    >
                      <option value="Sinh hoạt">Sinh hoạt</option>
                      <option value="Trại">Trại</option>
                      <option value="Lễ">Lễ</option>
                      <option value="Họp">Họp</option>
                    </select>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Địa điểm</label>
                <input 
                  type="text" 
                  value={newEvent.location || ''} 
                  onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white outline-none"
                  required
                  placeholder="Nhập địa điểm..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition flex items-center gap-2"
                >
                  <Save size={18} /> Lưu sự kiện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;