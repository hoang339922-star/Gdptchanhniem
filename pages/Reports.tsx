
import React, { useState, useMemo } from 'react';
import { 
  FileBarChart, Users, AlertTriangle, TrendingUp, Download, 
  Calendar, ArrowRight, Filter, FileText, CheckCircle, Clock, Zap
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { MOCK_DOAN_SINH, MOCK_ATTENDANCE, MOCK_EVENTS, MOCK_TRANSACTIONS } from '../lib/mockData';
import { Doan, Nganh, UserRole } from '../types';
import { useAuthStore } from '../store';
import EmailAutomation from '../components/reports/EmailAutomation';

const Reports = () => {
  const { user, canAccessMember, canAccessDoan } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'age' | 'attendance' | 'general' | 'automation'>('general');

  // Filter members visible to current user
  const visibleMembers = useMemo(() => {
      return MOCK_DOAN_SINH.filter(m => canAccessMember(m.id, m.doan));
  }, [user, canAccessMember]);

  // Filter attendance records for visible members
  const visibleAttendance = useMemo(() => {
      return MOCK_ATTENDANCE.filter(att => 
          visibleMembers.some(m => m.id === att.doan_sinh_id)
      );
  }, [visibleMembers]);

  // Filter transactions visible to current user
  const visibleTransactions = useMemo(() => {
      return MOCK_TRANSACTIONS.filter(t => {
          if (t.scope === 'general') return true; // General stats usually visible
          if (t.scope === 'doan') return canAccessDoan(t.target_doan!);
          return false;
      });
  }, [user, canAccessDoan]);

  // --- LOGIC 1: BÁO CÁO ĐỘ TUỔI LÊN ĐOÀN ---
  const ageTransitionData = useMemo(() => {
      const today = new Date();
      const currentYear = today.getFullYear();

      return visibleMembers.map(ds => {
          const birthYear = new Date(ds.birth_date).getFullYear();
          const age = currentYear - birthYear;
          let recommendation = 'Giữ nguyên';
          let urgent = false;

          // Logic quy định tuổi GĐPT (Tham khảo)
          // Oanh Vũ (6-12) -> Lên Thiếu (13+)
          if ((ds.doan === Doan.OANH_VU_NAM || ds.doan === Doan.OANH_VU_NU) && age >= 13) {
              recommendation = 'Cần lên Thiếu';
              urgent = true;
          }
          // Thiếu (13-18) -> Lên Thanh (19+)
          else if ((ds.doan === Doan.THIEU_NAM || ds.doan === Doan.THIEU_NU) && age >= 19) {
              recommendation = 'Cần lên Thanh (NPT/Nữ PT)';
              urgent = true;
          }
          // Cảnh báo độ tuổi Oanh Vũ quá lớn
          else if ((ds.doan === Doan.OANH_VU_NAM || ds.doan === Doan.OANH_VU_NU) && age >= 12) {
              recommendation = 'Chuẩn bị lên đoàn (12t)';
          }

          return { ...ds, age, recommendation, urgent };
      }).filter(item => item.recommendation !== 'Giữ nguyên');
  }, [visibleMembers]);

  // --- LOGIC 2: BÁO CÁO VẮNG MẶT (CHUYÊN CẦN) ---
  const absenteeismData = useMemo(() => {
      const stats: Record<string, { total: number, absent: number, late: number }> = {};
      
      // Khởi tạo stats cho tất cả đoàn sinh visible
      visibleMembers.forEach(ds => {
          stats[ds.id] = { total: 0, absent: 0, late: 0 };
      });

      // Duyệt qua lịch sử điểm danh visible
      visibleAttendance.forEach(rec => {
          if (stats[rec.doan_sinh_id]) {
              stats[rec.doan_sinh_id].total += 1;
              if (rec.status === 'absent') stats[rec.doan_sinh_id].absent += 1;
              if (rec.status === 'late') stats[rec.doan_sinh_id].late += 1;
          }
      });

      // Lọc ra danh sách báo động (Vắng > 30% hoặc vắng >= 2 buổi)
      return visibleMembers.map(ds => {
          const s = stats[ds.id];
          if (!s || s.total === 0) return null;
          const absentRate = (s.absent / s.total) * 100;
          
          if (absentRate >= 30 || s.absent >= 2) {
              return {
                  ...ds,
                  totalSessions: s.total,
                  absentCount: s.absent,
                  lateCount: s.late,
                  rate: absentRate.toFixed(1)
              };
          }
          return null;
      }).filter(Boolean) as any[]; // Cast để tránh lỗi TS null
  }, [visibleMembers, visibleAttendance]);

  // --- LOGIC 3: TỔNG HỢP ---
  const generalStats = useMemo(() => {
      const totalMembers = visibleMembers.length;
      const activeEvents = MOCK_EVENTS.filter(e => e.status === 'completed').length;
      const totalFunds = visibleTransactions
          .filter(t => t.status === 'approved')
          .reduce((acc, curr) => curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0);
      
      // Biểu đồ phân bổ theo Đoàn (chỉ tính trên visible members)
      const distribution = [
          { name: 'Oanh Vũ', value: visibleMembers.filter(m => m.doan.includes('Oanh Vũ')).length },
          { name: 'Thiếu', value: visibleMembers.filter(m => m.doan.includes('Thiếu')).length },
          { name: 'Thanh (Nam/Nữ PT)', value: visibleMembers.filter(m => m.doan.includes('Phật Tử')).length },
      ];

      return { totalMembers, activeEvents, totalFunds, distribution };
  }, [visibleMembers, visibleTransactions]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // --- RENDERERS ---

  const renderAgeReport = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                          <TrendingUp className="text-blue-600" /> Danh sách đề nghị chuyển đoàn
                      </h3>
                      <p className="text-sm text-gray-500">Dựa trên độ tuổi thực tế so với quy định Nội quy GĐPT.</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100">
                      <Download size={16} /> Xuất danh sách
                  </button>
              </div>

              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 font-medium">
                          <tr>
                              <th className="px-6 py-4">Đoàn sinh</th>
                              <th className="px-6 py-4">Năm sinh / Tuổi</th>
                              <th className="px-6 py-4">Đoàn hiện tại</th>
                              <th className="px-6 py-4">Đề xuất</th>
                              <th className="px-6 py-4 text-center">Trạng thái</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                          {ageTransitionData.map(item => (
                              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                      {item.full_name} <br/>
                                      <span className="text-xs text-gray-500 font-normal">{item.phap_danh}</span>
                                  </td>
                                  <td className="px-6 py-4">
                                      {new Date(item.birth_date).getFullYear()} <span className="text-gray-400">({item.age} tuổi)</span>
                                  </td>
                                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.doan}</td>
                                  <td className="px-6 py-4">
                                      <span className={`font-bold ${item.urgent ? 'text-red-600' : 'text-orange-500'}`}>
                                          {item.recommendation}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                      {item.urgent ? (
                                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                              <AlertTriangle size={12} /> Quá tuổi
                                          </span>
                                      ) : (
                                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                              <Clock size={12} /> Sắp tới
                                          </span>
                                      )}
                                  </td>
                              </tr>
                          ))}
                          {ageTransitionData.length === 0 && (
                              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Không có đề xuất nào cho danh sách hiện tại.</td></tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
  );

  const renderAttendanceReport = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                          <AlertTriangle className="text-red-600" /> Cảnh báo chuyên cần
                      </h3>
                      <p className="text-sm text-gray-500">Danh sách đoàn sinh vắng nhiều trong tháng (Tỷ lệ vắng &gt; 30%).</p>
                  </div>
              </div>

              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 font-medium">
                          <tr>
                              <th className="px-6 py-4">Đoàn sinh</th>
                              <th className="px-6 py-4">Đoàn</th>
                              <th className="px-6 py-4 text-center">Số buổi vắng</th>
                              <th className="px-6 py-4">Tỷ lệ vắng</th>
                              <th className="px-6 py-4">Phụ huynh</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                          {absenteeismData.map((item: any) => (
                              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                      <div className="flex items-center gap-3">
                                          <img src={item.avatar_url} className="w-8 h-8 rounded-full bg-gray-100" />
                                          <div>
                                              <div>{item.full_name}</div>
                                              <div className="text-xs text-gray-500">{item.phap_danh}</div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.doan}</td>
                                  <td className="px-6 py-4 text-center">
                                      <span className="font-bold text-red-600 text-lg">{item.absentCount}</span>
                                      <span className="text-gray-400 text-xs">/{item.totalSessions}</span>
                                  </td>
                                  <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden w-24">
                                              <div className="h-full bg-red-500" style={{ width: `${item.rate}%` }}></div>
                                          </div>
                                          <span className="text-xs font-bold text-red-600">{item.rate}%</span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 text-gray-500">
                                      {item.parent_name} <br/>
                                      <span className="text-xs text-primary-600 hover:underline cursor-pointer">{item.parent_phone}</span>
                                  </td>
                              </tr>
                          ))}
                          {absenteeismData.length === 0 && (
                              <tr><td colSpan={5} className="p-8 text-center text-green-600 font-medium">Tình hình chuyên cần rất tốt! Không có ai vắng nhiều.</td></tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
  );

  const renderGeneralReport = () => (
      <div className="space-y-6 animate-fade-in">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users size={24}/></div>
                      <div>
                          <p className="text-sm text-gray-500">Tổng nhân sự</p>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{generalStats.totalMembers}</h3>
                      </div>
                  </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle size={24}/></div>
                      <div>
                          <p className="text-sm text-gray-500">Sự kiện đã tổ chức</p>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{generalStats.activeEvents}</h3>
                      </div>
                  </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><FileText size={24}/></div>
                      <div>
                          <p className="text-sm text-gray-500">Quỹ tồn (Hiển thị)</p>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{generalStats.totalFunds.toLocaleString('vi-VN')} đ</h3>
                      </div>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribution Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Cơ cấu nhân sự theo Ngành</h3>
                  {generalStats.totalMembers > 0 ? (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={generalStats.distribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {generalStats.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400">Chưa có dữ liệu nhân sự để hiển thị.</div>
                  )}
              </div>

              {/* Quick Actions / Recommendations */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Đề xuất quản trị</h3>
                  <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                          <AlertTriangle className="flex-shrink-0 mt-0.5" size={16}/>
                          <p>Có <strong>{ageTransitionData.filter(i => i.urgent).length}</strong> đoàn sinh trong danh sách của bạn đã quá tuổi quy định tại đoàn hiện tại. Cần xem xét làm lễ lên đoàn.</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-50 text-red-800 rounded-lg text-sm">
                          <TrendingUp className="flex-shrink-0 mt-0.5" size={16}/>
                          <p>Tỷ lệ chuyên cần tháng này có biến động. Đề nghị các Huynh trưởng đoàn thăm hỏi động viên.</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                          <Calendar className="flex-shrink-0 mt-0.5" size={16}/>
                          <p>Sắp tới kỳ thi vượt bậc. Cần lên kế hoạch ôn tập cho <strong>{visibleMembers.length}</strong> đoàn sinh.</p>
                      </div>
                  </div>
                  <button className="w-full mt-6 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition">
                      Tạo báo cáo chi tiết (PDF)
                  </button>
              </div>
          </div>
      </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Báo Cáo & Thống Kê</h2>
          <p className="text-gray-500 text-sm mt-1">Phân tích dữ liệu để hỗ trợ công tác điều hành đơn vị.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-4 border-b border-gray-200 dark:border-gray-700 pb-1">
          <button 
            onClick={() => setActiveTab('general')}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'general' 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
              Tổng quan
          </button>
          <button 
            onClick={() => setActiveTab('age')}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'age' 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
              Độ tuổi & Lên đoàn
          </button>
          <button 
            onClick={() => setActiveTab('attendance')}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'attendance' 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
              Cảnh báo vắng
          </button>
          <button 
            onClick={() => setActiveTab('automation')}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'automation' 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
              <Zap size={14} /> Tự động hóa
          </button>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
          {activeTab === 'general' && renderGeneralReport()}
          {activeTab === 'age' && renderAgeReport()}
          {activeTab === 'attendance' && renderAttendanceReport()}
          {activeTab === 'automation' && <EmailAutomation />}
      </div>
    </div>
  );
};

export default Reports;
