
import React, { useState, useMemo } from 'react';
import { Calendar, Check, X, Clock, HelpCircle, Save, Filter, History, MapPin, UserCheck, Shield } from 'lucide-react';
import { Doan, UserRole } from '../types';
import { MOCK_DOAN_SINH, MOCK_ATTENDANCE } from '../lib/mockData';
import { useAuthStore } from '../store';

const Attendance = () => {
  const { user, canAccessDoan } = useAuthStore();
  const isDoanSinh = user?.role === UserRole.DOAN_SINH;
  const isHuynhTruong = user?.role === UserRole.HUYNH_TRUONG;
  
  // Initialize with the user's specific Doan or the first available one if Admin
  const [selectedDoan, setSelectedDoan] = useState<Doan>(
    user?.role === UserRole.HUYNH_TRUONG && user.doan 
      ? user.doan 
      : Doan.OANH_VU_NAM
  );

  // Filter available Doans based on permissions
  const availableDoans = useMemo(() => {
      return Object.values(Doan).filter(d => canAccessDoan(d));
  }, [canAccessDoan]);

  // If user is restricted (Huynh Truong), ensure selectedDoan is always their Doan
  React.useEffect(() => {
      if (isHuynhTruong && user?.doan) {
          setSelectedDoan(user.doan);
      }
  }, [isHuynhTruong, user]);

  // --- LOGIC CHO NGƯỜI QUẢN LÝ ---
  const filteredMembers = MOCK_DOAN_SINH.filter(ds => ds.doan === selectedDoan);

  // --- LOGIC CHO ĐOÀN SINH ---
  const myAttendanceHistory = MOCK_ATTENDANCE.filter(att => att.doan_sinh_id === user?.id);

  if (isDoanSinh) {
    return (
      <div className="space-y-6">
         <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Lịch Sử Điểm Danh</h2>
            <p className="text-gray-500 text-sm mt-1">Theo dõi chuyên cần của cá nhân: {user?.full_name}</p>
         </div>

         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
             <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                 <History size={18} className="text-primary-600" />
                 <h3 className="font-semibold text-gray-800 dark:text-white">Nhật ký điểm danh</h3>
             </div>
             <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                     <thead className="bg-gray-50 dark:bg-gray-700/30 text-gray-500 font-medium">
                         <tr>
                             <th className="px-6 py-4">Ngày</th>
                             <th className="px-6 py-4">Trạng thái</th>
                             <th className="px-6 py-4">Ghi chú</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                         {myAttendanceHistory.length > 0 ? (
                            myAttendanceHistory.map(record => (
                                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                                        {new Date(record.date).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                            record.status === 'present' ? 'bg-green-100 text-green-800' :
                                            record.status === 'late' ? 'bg-orange-100 text-orange-800' :
                                            record.status === 'excused' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {record.status === 'present' ? 'Có mặt' : 
                                             record.status === 'late' ? 'Đi trễ' : 
                                             record.status === 'excused' ? 'Có phép' : 'Vắng'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {record.notes || '-'}
                                    </td>
                                </tr>
                            ))
                         ) : (
                             <tr>
                                 <td colSpan={3} className="px-6 py-8 text-center text-gray-500">Bạn chưa có dữ liệu điểm danh nào.</td>
                             </tr>
                         )}
                     </tbody>
                 </table>
             </div>
         </div>
      </div>
    )
  }

  // --- VIEW CHO HUYNH TRƯỞNG & ADMIN ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Điểm danh</h2>
          <p className="text-gray-500 text-sm mt-1">Phiên điểm danh ngày {new Date().toLocaleDateString('vi-VN')}</p>
        </div>
        <div className="flex gap-2 items-center bg-white dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm w-full md:w-auto">
           <button className="flex-1 md:flex-none px-3 py-1.5 text-xs font-semibold bg-primary-600 text-white rounded shadow-sm">Hôm nay</button>
           <button className="flex-1 md:flex-none px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Lịch sử</button>
           <button className="flex-1 md:flex-none px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Báo cáo</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                    {isHuynhTruong ? <Shield size={14} className="text-primary-600"/> : <Filter size={14}/>} 
                    Sỉ số {selectedDoan}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{filteredMembers.length} <span className="text-sm font-normal text-gray-400">đoàn sinh</span></p>
            </div>
            <div className="h-10 w-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-2"></div>
            <div className="flex gap-4">
                <div className="text-center">
                    <p className="text-xs text-green-600 font-bold uppercase">Có mặt</p>
                    <p className="text-lg font-bold text-green-600">0</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-red-600 font-bold uppercase">Vắng</p>
                    <p className="text-lg font-bold text-red-600">0</p>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 dark:bg-gray-900/30">
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
                <h3 className="font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap text-sm uppercase tracking-wide">
                    Danh sách {isHuynhTruong ? '(Đoàn của tôi)' : ''}:
                </h3>
                
                {/* Doan Selector - Locked for Huynh Truong */}
                {availableDoans.length > 1 ? (
                   <div className="flex gap-2 pb-1 md:pb-0">
                     {availableDoans.map(d => (
                       <button
                         key={d}
                         onClick={() => setSelectedDoan(d)}
                         className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                           selectedDoan === d 
                             ? 'bg-white text-primary-700 border-primary-200 shadow-sm dark:bg-primary-900 dark:text-primary-300 dark:border-primary-700' 
                             : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
                         }`}
                       >
                         {d}
                       </button>
                     ))}
                   </div>
                ) : (
                   <span className="px-3 py-1.5 rounded-lg bg-primary-100 text-primary-700 text-xs font-bold border border-primary-200 dark:bg-primary-900 dark:text-primary-300 dark:border-primary-700 flex items-center gap-2">
                     <Shield size={12}/> {selectedDoan}
                   </span>
                )}
            </div>

            <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition shadow-lg shadow-green-600/20 w-full md:w-auto justify-center">
                <Save size={16} /> Lưu kết quả
            </button>
        </div>

        {/* MOBILE VIEW: CARD LIST */}
        <div className="md:hidden">
            {filteredMembers.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredMembers.map(member => (
                        <div key={member.id} className="p-4 bg-white dark:bg-gray-800">
                            <div className="flex items-start gap-3 mb-3">
                                <img src={member.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-white">{member.full_name}</div>
                                    <div className="text-xs text-primary-600 font-medium">{member.phap_danh}</div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                <label className="cursor-pointer flex flex-col items-center gap-1 p-2 rounded-lg border border-green-100 bg-green-50/50 has-[:checked]:bg-green-100 has-[:checked]:border-green-300 transition-all">
                                    <input type="radio" name={`att-mob-${member.id}`} className="w-4 h-4 text-green-600 focus:ring-green-500" defaultChecked />
                                    <span className="text-[10px] font-bold text-green-700 uppercase">Có mặt</span>
                                </label>
                                <label className="cursor-pointer flex flex-col items-center gap-1 p-2 rounded-lg border border-yellow-100 bg-yellow-50/50 has-[:checked]:bg-yellow-100 has-[:checked]:border-yellow-300 transition-all">
                                    <input type="radio" name={`att-mob-${member.id}`} className="w-4 h-4 text-yellow-600 focus:ring-yellow-500" />
                                    <span className="text-[10px] font-bold text-yellow-700 uppercase">Có phép</span>
                                </label>
                                <label className="cursor-pointer flex flex-col items-center gap-1 p-2 rounded-lg border border-orange-100 bg-orange-50/50 has-[:checked]:bg-orange-100 has-[:checked]:border-orange-300 transition-all">
                                    <input type="radio" name={`att-mob-${member.id}`} className="w-4 h-4 text-orange-600 focus:ring-orange-500" />
                                    <span className="text-[10px] font-bold text-orange-700 uppercase">Trễ</span>
                                </label>
                                <label className="cursor-pointer flex flex-col items-center gap-1 p-2 rounded-lg border border-red-100 bg-red-50/50 has-[:checked]:bg-red-100 has-[:checked]:border-red-300 transition-all">
                                    <input type="radio" name={`att-mob-${member.id}`} className="w-4 h-4 text-red-600 focus:ring-red-500" />
                                    <span className="text-[10px] font-bold text-red-700 uppercase">Vắng</span>
                                </label>
                            </div>
                            
                            <input 
                                type="text" 
                                placeholder="Ghi chú (lý do vắng...)" 
                                className="w-full text-sm px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20" 
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8 text-center text-gray-500">Chưa có dữ liệu đoàn sinh.</div>
            )}
        </div>

        {/* DESKTOP VIEW: TABLE */}
        <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/30 text-gray-500 text-xs uppercase font-semibold">
                    <tr>
                        <th className="px-6 py-3">Đoàn sinh</th>
                        <th className="px-6 py-3 text-center w-20">Có mặt</th>
                        <th className="px-6 py-3 text-center w-20">Có phép</th>
                        <th className="px-6 py-3 text-center w-20">Trễ</th>
                        <th className="px-6 py-3 text-center w-20">Vắng</th>
                        <th className="px-6 py-3">Ghi chú</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={member.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{member.full_name}</div>
                                        <div className="text-xs text-gray-500">{member.phap_danh}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <label className="cursor-pointer flex justify-center hover:scale-110 transition-transform">
                                    <input type="radio" name={`att-${member.id}`} className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300" defaultChecked />
                                </label>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <label className="cursor-pointer flex justify-center hover:scale-110 transition-transform">
                                    <input type="radio" name={`att-${member.id}`} className="w-5 h-5 text-yellow-500 focus:ring-yellow-400 border-gray-300" />
                                </label>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <label className="cursor-pointer flex justify-center hover:scale-110 transition-transform">
                                    <input type="radio" name={`att-${member.id}`} className="w-5 h-5 text-orange-500 focus:ring-orange-400 border-gray-300" />
                                </label>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <label className="cursor-pointer flex justify-center hover:scale-110 transition-transform">
                                    <input type="radio" name={`att-${member.id}`} className="w-5 h-5 text-red-600 focus:ring-red-500 border-gray-300" />
                                </label>
                            </td>
                            <td className="px-6 py-4">
                                <input type="text" placeholder="Ghi chú..." className="w-full text-sm border-b border-gray-200 dark:border-gray-700 bg-transparent focus:border-primary-500 focus:outline-none py-1 dark:text-gray-300 transition-colors" />
                            </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          Chưa có dữ liệu đoàn sinh cho đoàn này.
                        </td>
                      </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
