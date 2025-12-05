import React, { useState } from 'react';
import { Shield, Users, Edit, Save, X, Search, Filter, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuthStore, MOCK_USERS_DB } from '../store';
import { UserRole, Doan, User, Nganh } from '../types';

// Convert MOCK_USERS_DB object to array and add some dummy data for demonstration
const INITIAL_USERS = [
  ...Object.values(MOCK_USERS_DB),
  {
    id: 'user_5',
    email: 'huynhtruong_moi@gdpt.vn',
    full_name: 'Phạm Văn Mới',
    phap_danh: 'Tâm Kiến',
    role: UserRole.HUYNH_TRUONG,
    doan: Doan.THIEU_NAM,
    avatar_url: 'https://ui-avatars.com/api/?name=Tam+Kien&background=random',
  },
  {
    id: 'user_6',
    email: 'doansinh_test@gdpt.vn',
    full_name: 'Lê Thị Test',
    phap_danh: 'Diệu Test',
    role: UserRole.DOAN_SINH,
    doan: Doan.OANH_VU_NU,
    avatar_url: 'https://ui-avatars.com/api/?name=Dieu+Test&background=random',
  }
];

const Admin = () => {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Permission Check
  if (user?.role !== UserRole.ADMIN_ROOT && user?.role !== UserRole.GIA_TRUONG) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="bg-red-100 p-4 rounded-full mb-4">
            <Shield size={48} className="text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Truy cập bị từ chối</h2>
        <p className="text-gray-500 mt-2">Bạn không có quyền truy cập vào trang quản trị hệ thống.</p>
      </div>
    );
  }

  const handleEdit = (targetUser: User) => {
    setEditingUser({ ...targetUser });
  };

  const handleSave = () => {
    if (!editingUser) return;
    setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.phap_danh && u.phap_danh.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Quản Trị Hệ Thống</h2>
          <p className="text-gray-500 text-sm mt-1">Phân quyền Huynh trưởng, quản lý tài khoản và cấu trúc tổ chức.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-sm">Tổng tài khoản</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</h3>
                </div>
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users size={24}/></div>
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-sm">Huynh Trưởng</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {users.filter(u => u.role === UserRole.HUYNH_TRUONG || u.role === UserRole.GIA_TRUONG || u.role === UserRole.LIEN_DOAN_TRUONG).length}
                    </h3>
                </div>
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><Shield size={24}/></div>
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-sm">Cần phê duyệt</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">0</h3>
                </div>
                <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle size={24}/></div>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center">
            <h3 className="font-semibold text-gray-800 dark:text-white">Danh sách nhân sự</h3>
            <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm..." 
                    className="w-full md:w-64 pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-primary-500/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/30 text-gray-500 font-medium">
                    <tr>
                        <th className="px-6 py-4">Nhân sự</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Vai trò (Role)</th>
                        <th className="px-6 py-4">Đoàn phụ trách</th>
                        <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={u.avatar_url || `https://ui-avatars.com/api/?name=${u.full_name}`} alt="" className="w-9 h-9 rounded-full" />
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{u.full_name}</div>
                                        <div className="text-xs text-primary-600 dark:text-primary-400">{u.phap_danh}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{u.email}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                                    u.role === UserRole.GIA_TRUONG ? 'bg-purple-100 text-purple-700' :
                                    u.role === UserRole.HUYNH_TRUONG ? 'bg-blue-100 text-blue-700' :
                                    u.role === UserRole.DOAN_SINH ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {u.role === UserRole.GIA_TRUONG ? 'Gia Trưởng' : 
                                     u.role === UserRole.HUYNH_TRUONG ? 'Huynh Trưởng' : 
                                     u.role === UserRole.DOAN_SINH ? 'Đoàn Sinh' : u.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                                {u.doan || <span className="text-gray-300 italic">Không có</span>}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => handleEdit(u)}
                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 hover:text-primary-600 transition"
                                >
                                    <Edit size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
           <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Phân Quyền Nhân Sự</h3>
                  <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 mb-4 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                      <img src={editingUser.avatar_url} className="w-12 h-12 rounded-full"/>
                      <div>
                          <div className="font-bold text-gray-900 dark:text-white">{editingUser.full_name}</div>
                          <div className="text-sm text-gray-500">{editingUser.phap_danh}</div>
                      </div>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vai trò</label>
                      <select 
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({...editingUser, role: e.target.value as UserRole})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white outline-none"
                      >
                          <option value={UserRole.DOAN_SINH}>Đoàn Sinh</option>
                          <option value={UserRole.HUYNH_TRUONG}>Huynh Trưởng</option>
                          <option value={UserRole.GIA_TRUONG}>Gia Trưởng</option>
                          <option value={UserRole.THU_KY}>Thư Ký</option>
                      </select>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phụ trách Đoàn (Nếu là HT)</label>
                      <select 
                        value={editingUser.doan || ''}
                        onChange={(e) => setEditingUser({...editingUser, doan: e.target.value as Doan})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white outline-none"
                      >
                          <option value="">-- Không phân công --</option>
                          {Object.values(Doan).map(d => (
                              <option key={d} value={d}>{d}</option>
                          ))}
                      </select>
                  </div>
                  
                  {editingUser.role === UserRole.HUYNH_TRUONG && !editingUser.doan && (
                      <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                          <AlertTriangle size={16} />
                          Lưu ý: Huynh trưởng chưa được phân đoàn.
                      </div>
                  )}

                  <button 
                    onClick={handleSave}
                    className="w-full mt-4 bg-primary-600 text-white font-bold py-2 rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-2"
                  >
                      <Save size={18} /> Lưu Thay Đổi
                  </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;