
import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Users, Clock, ArrowRight, Check, Loader2, AlertCircle, CheckCircle, Edit, X, Save, Plus, Wand2 } from 'lucide-react';
import { MOCK_EVENTS } from '../lib/mockData';
import { useAuthStore } from '../store';
import { Event, UserRole } from '../types';

const Events = () => {
  const { user, registeredEventIds, registerEvent } = useAuthStore();
  
  // Local state to handle UI updates
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Edit/Add State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<Event>>({});
  const [isNewMode, setIsNewMode] = useState(false);

  const isManager = user?.role && user.role !== UserRole.DOAN_SINH && user.role !== UserRole.PHU_HUYNH;

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  const handleRegister = (event: Event) => {
    if (!user) return;
    
    setRegisteringId(event.id);

    setTimeout(() => {
      registerEvent(event.id);
      setEvents(prevEvents => 
        prevEvents.map(e => 
          e.id === event.id 
            ? { ...e, participants_count: e.participants_count + 1 } 
            : e
        )
      );
      setRegisteringId(null);
      setToast({ 
        message: `Đăng ký thành công sự kiện: ${event.title}`, 
        type: 'success' 
      });
    }, 1000);
  };

  const handleOpenAddModal = () => {
    setEditingEvent({
      type: 'Sinh hoạt',
      participants_count: 0,
      status: 'upcoming',
      date: new Date().toISOString().split('T')[0],
      location: 'Sân Chùa (08:00 - 11:30)',
      description: 'Sinh hoạt định kỳ hàng tuần.'
    });
    setIsNewMode(true);
    setIsEditModalOpen(true);
  };

  const handleAutoGenerateSchedule = () => {
      const confirm = window.confirm("Hệ thống sẽ tự động tạo lịch sinh hoạt cho tất cả các ngày Chủ Nhật còn lại trong tháng này và tháng sau (08:00-11:30). Bạn có chắc chắn không?");
      if (!confirm) return;

      const newEvents: Event[] = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset giờ về 0 để so sánh chính xác ngày hiện tại

      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      
      // Tính toán cho tháng hiện tại (0) và tháng kế tiếp (1)
      for (let m = 0; m <= 1; m++) {
          const targetMonth = currentMonth + m;
          const year = currentYear + Math.floor(targetMonth / 12);
          const monthIndex = targetMonth % 12;
          
          // Bắt đầu từ ngày 1 của tháng
          const date = new Date(year, monthIndex, 1);
          
          while (date.getMonth() === monthIndex) {
              // 0 là Chủ Nhật. Chỉ tạo nếu ngày đó >= hôm nay
              if (date.getDay() === 0 && date >= today) { 
                  // Format YYYY-MM-DD thủ công để tránh lỗi múi giờ
                  const yearStr = date.getFullYear();
                  const monthStr = String(date.getMonth() + 1).padStart(2, '0');
                  const dayStr = String(date.getDate()).padStart(2, '0');
                  const dateString = `${yearStr}-${monthStr}-${dayStr}`;
                  
                  // Kiểm tra xem đã có sự kiện Sinh hoạt vào ngày này chưa
                  const exists = events.some(e => e.date === dateString && e.type === 'Sinh hoạt');
                  
                  if (!exists) {
                      newEvents.push({
                          id: `auto_evt_${date.getTime()}`,
                          title: `Sinh hoạt Chủ Nhật - Tuần ${Math.ceil(date.getDate() / 7)}/${monthIndex + 1}`,
                          date: dateString,
                          type: 'Sinh hoạt',
                          location: 'Sân Chùa (08:00 - 11:30)',
                          participants_count: 0,
                          status: 'upcoming',
                          description: 'Chương trình sinh hoạt tu học định kỳ: Phật pháp, Hoạt động thanh niên, Trò chơi lớn.'
                      });
                  }
              }
              date.setDate(date.getDate() + 1);
          }
      }

      if (newEvents.length > 0) {
          // Thêm các sự kiện mới vào danh sách hiện tại
          // Sắp xếp lại theo thời gian để hiển thị đúng
          const updatedEvents = [...newEvents, ...events].sort((a, b) => 
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          setEvents(updatedEvents);
          setToast({ message: `Đã tạo tự động ${newEvents.length} lịch sinh hoạt!`, type: 'success' });
      } else {
          setToast({ message: 'Không có ngày Chủ Nhật nào cần tạo thêm lịch (đã tồn tại hoặc hết hạn).', type: 'error' });
      }
  };

  const handleOpenEditModal = (event: Event) => {
    setEditingEvent({ ...event });
    setIsNewMode(false);
    setIsEditModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent.title) return;

    if (isNewMode) {
      // Create new
      const newEvent: Event = {
        ...editingEvent,
        id: `evt_${Date.now()}`,
        participants_count: 0,
      } as Event;
      setEvents([newEvent, ...events]);
      setToast({ message: 'Tạo sự kiện mới thành công!', type: 'success' });
    } else {
      // Update existing
      setEvents(prevEvents => 
        prevEvents.map(ev => ev.id === editingEvent.id ? { ...ev, ...editingEvent } as Event : ev)
      );
      setToast({ message: 'Cập nhật thông tin sự kiện thành công!', type: 'success' });
    }
    
    setIsEditModalOpen(false);
  };

  const isRegistered = (id: string) => registeredEventIds.includes(id);

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Sự Kiện & Lịch Hoạt Động</h2>
          <p className="text-gray-500 text-sm mt-1">Quản lý các sự kiện, trại, lễ và lịch sinh hoạt.</p>
        </div>
        {isManager && (
          <div className="flex gap-2">
             <button 
                onClick={handleAutoGenerateSchedule}
                className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition"
                title="Tự động tạo lịch Chủ Nhật hàng tuần"
             >
               <Wand2 size={16} /> Tạo lịch tự động
             </button>
             <button 
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-600/20"
             >
               <Plus size={16} /> Tạo thủ công
             </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <CalendarDays className="text-primary-600" size={20} /> Sự kiện sắp tới
          </h3>
          
          {events.filter(e => e.status === 'upcoming').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event) => (
            <div key={event.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow group relative">
              
              {/* Edit Button for Managers */}
              {isManager && (
                <button 
                  onClick={() => handleOpenEditModal(event)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  title="Chỉnh sửa sự kiện"
                >
                  <Edit size={18} />
                </button>
              )}

              <div className="flex-shrink-0 flex md:flex-col items-center justify-center bg-primary-50 dark:bg-primary-900/20 w-full md:w-24 h-24 rounded-xl text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900">
                <span className="text-3xl font-bold">{new Date(event.date).getDate()}</span>
                <span className="text-sm font-medium uppercase">{new Date(event.date).toLocaleString('vi-VN', { month: 'short' })}</span>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                     <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${
                       event.type === 'Trại' ? 'bg-green-100 text-green-700' :
                       event.type === 'Lễ' ? 'bg-yellow-100 text-yellow-700' :
                       'bg-gray-100 text-gray-700'
                     }`}>
                       {event.type}
                     </span>
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{event.title}</h3>
                  </div>
                  <button className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-primary-600 mr-8">
                    Chi tiết <ArrowRight size={16} />
                  </button>
                </div>
                
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
                
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{event.location.includes('08:00') ? '08:00 - 11:30' : '08:00 - 17:00'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{event.location.split('(')[0].split('-')[0].trim()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span className={isRegistered(event.id) ? "text-primary-600 font-bold" : ""}>
                        {event.participants_count} người tham gia
                      </span>
                    </div>
                  </div>

                  {/* Registration Button */}
                  <div>
                    {isRegistered(event.id) ? (
                       <button disabled className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                         <Check size={16} /> Đã đăng ký
                       </button>
                    ) : (
                       <button 
                        onClick={() => handleRegister(event)}
                        disabled={registeringId === event.id}
                        className="flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-primary-600 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-gray-600 hover:border-primary-200 px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-70 disabled:cursor-wait"
                       >
                         {registeringId === event.id ? (
                           <>
                             <Loader2 size={16} className="animate-spin" /> Đang xử lý...
                           </>
                         ) : (
                           <>
                             Đăng ký tham gia
                           </>
                         )}
                       </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {events.filter(e => e.status === 'upcoming').length === 0 && (
             <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">Không có sự kiện nào sắp tới.</p>
                {isManager && (
                    <button onClick={handleAutoGenerateSchedule} className="mt-2 text-primary-600 font-medium hover:underline">Tạo lịch tự động ngay</button>
                )}
             </div>
          )}
        </div>

        {/* Mini Calendar / Past Events */}
        <div className="space-y-6">
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Lịch tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}</h3>
             <div className="grid grid-cols-7 gap-1 text-center text-sm">
               {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
                 <div key={d} className="py-2 text-gray-400 font-medium">{d}</div>
               ))}
               {Array.from({length: 30}, (_, i) => i + 1).map(d => {
                  const currentMonth = new Date().getMonth();
                  const hasEvent = events.some(e => {
                      const evtDate = new Date(e.date);
                      return evtDate.getDate() === d && evtDate.getMonth() === currentMonth && e.status === 'upcoming';
                  });
                  return (
                    <div key={d} className={`py-2 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        hasEvent ? 'bg-primary-100 text-primary-700 font-bold' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {d}
                    </div>
                  );
               })}
             </div>
           </div>

           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Sự kiện đã qua</h3>
             <div className="space-y-4">
                {events.filter(e => e.status === 'completed').map(event => (
                  <div key={event.id} className="flex gap-3 items-start opacity-75">
                    <div className="w-2 h-2 mt-2 rounded-full bg-gray-400"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                      <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString('vi-VN')} • {event.location}</p>
                    </div>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>

      {/* Edit/Add Event Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {isNewMode ? 'Tạo Sự Kiện Mới' : 'Chỉnh Sửa Sự Kiện'}
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên sự kiện</label>
                <input 
                  type="text" 
                  value={editingEvent.title || ''} 
                  onChange={e => setEditingEvent({...editingEvent, title: e.target.value})}
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
                      value={editingEvent.date || ''} 
                      onChange={e => setEditingEvent({...editingEvent, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white outline-none"
                      required
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loại hình</label>
                    <select
                      value={editingEvent.type || ''} 
                      onChange={e => setEditingEvent({...editingEvent, type: e.target.value as any})}
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
                  value={editingEvent.location || ''} 
                  onChange={e => setEditingEvent({...editingEvent, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white outline-none"
                  required
                  placeholder="Nhập địa điểm..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mô tả chi tiết</label>
                <textarea 
                  value={editingEvent.description || ''} 
                  onChange={e => setEditingEvent({...editingEvent, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white outline-none resize-none"
                  placeholder="Thông tin thêm về sự kiện..."
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition flex items-center gap-2"
                >
                  <Save size={18} /> {isNewMode ? 'Tạo sự kiện' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
          <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-3 animate-slide-up z-50 ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}>
              {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {toast.message}
          </div>
      )}
    </div>
  );
};

export default Events;
