
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Download, Eye, Edit, Lock, X, Save, User, MapPin, Phone, Calendar, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { MOCK_DOAN_SINH } from '../lib/mockData';
import { Doan, UserRole, DoanSinh } from '../types';
import { useAuthStore } from '../store';

const Members = () => {
  const { user, canAccessDoan, canAccessMember } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Convert MOCK_DOAN_SINH to local state to allow adding new members
  const [membersList, setMembersList] = useState<DoanSinh[]>(MOCK_DOAN_SINH);
  
  const isDoanSinh = user?.role === UserRole.DOAN_SINH;
  const isHuynhTruong = user?.role === UserRole.HUYNH_TRUONG;
  const isAdmin = user?.role === UserRole.GIA_TRUONG || user?.role === UserRole.ADMIN_ROOT;

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Add Member State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState<Partial<DoanSinh>>({
    gender: 'Nam',
    status: 'active',
    bac_hoc: 'Mở Mắt', // Default
    doan: isHuynhTruong && user.doan ? user.doan : Doan.OANH_VU_NAM
  });

  // Mặc định filter theo Đoàn của user nếu user bị giới hạn quyền
  const [filterDoan, setFilterDoan] = useState<string>('all');

  useEffect(() => {
    if ((isHuynhTruong || isDoanSinh) && user.doan) {
      setFilterDoan(user.doan);
    }
  }, [user, isHuynhTruong, isDoanSinh]);

  // Reset pagination when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDoan]);

  // Logic lọc danh sách
  const filteredMembers = membersList.filter(member => {
    // 1. Check quyền truy cập từng thành viên
    if (!canAccessMember(member.id, member.doan)) return false;

    // 2. Lọc theo search
    const matchesSearch = 
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.phap_danh.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 3. Lọc theo dropdown (nếu chọn)
    const matchesFilter = filterDoan === 'all' || member.doan === filterDoan;

    return matchesSearch && matchesFilter;
  });

  // Logic Phân trang
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.full_name) return;

    const addedMember: DoanSinh = {
        id: `new_${Date.now()}`,
        full_name: newMember.full_name || '',
        phap_danh: newMember.phap_danh || '',
        birth_date: newMember.birth_date || new Date().toISOString().split('T')[0],
        gender: newMember.gender as 'Nam' | 'Nữ',
        doan: newMember.doan as Doan,
        bac_hoc: newMember.bac_hoc || '',
        join_date: new Date().toISOString().split('T')[0],
        status: 'active',
        parent_name: newMember.parent_name,
        parent_phone: newMember.parent_phone,
        avatar_url: `https://ui-avatars.com/api/?name=${newMember.full_name}&background=random`
    };

    setMembersList([addedMember, ...membersList]);
    setIsAddModalOpen(false);
    setNewMember({ gender: 'Nam', status: 'active', bac_hoc: 'Mở Mắt', doan: isHuynhTruong && user.doan ? user.doan : Doan.OANH_VU_NAM });
  };

  const handleChange = (field: keyof DoanSinh, value: any) => {
      setNewMember(prev => ({ ...prev, [field]: value }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {isDoanSinh ? 'Hồ Sơ Cá Nhân' : 'Danh sách Đoàn Sinh'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isDoanSinh 
              ? 'Thông tin chi tiết về hồ sơ đoàn phả của bạn' 
              : isHuynhTruong 
                ? `Quản lý danh sách đoàn ${user?.doan}`
                : 'Quản lý hồ sơ toàn bộ đoàn sinh'}
          </p>
        </div>
        {!isDoanSinh && (
          <div className="flex gap-2 w-full md:w-auto">
             <button className="hidden md:flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
               <Download size={16} />
               Xuất Excel
             </button>
             <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-600/20"
             >
               <Plus size={16} />
               Thêm mới
             </button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        {!isDoanSinh && (
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text"
                placeholder="Tìm theo tên hoặc pháp danh..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400 hidden md:block" />
              <div className="relative w-full md:w-auto">
                <select 
                  className={`w-full md:w-auto appearance-none px-4 py-2 pr-8 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 ${isHuynhTruong ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed' : ''}`}
                  value={filterDoan}
                  onChange={(e) => !isHuynhTruong && setFilterDoan(e.target.value)}
                  disabled={isHuynhTruong}
                >
                  {!isHuynhTruong && <option value="all">Tất cả các đoàn</option>}
                  {Object.values(Doan).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {isHuynhTruong && <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />}
              </div>
            </div>
          </div>
        )}

        {/* --- MOBILE VIEW: CARD LIST --- */}
        <div className="md:hidden p-4 space-y-4 bg-gray-50 dark:bg-gray-900/20">
            {currentMembers.length > 0 ? (
                currentMembers.map(member => (
                    <div key={member.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-4 relative">
                        <img src={member.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 dark:border-gray-600" />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">{member.full_name}</h3>
                            <p className="text-primary-600 font-medium text-sm mb-1">{member.phap_danh}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">{member.doan}</span>
                                <span className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">{member.bac_hoc}</span>
                            </div>
                            {member.parent_phone && (
                                <a href={`tel:${member.parent_phone}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
                                    <Phone size={14} /> {member.parent_phone}
                                </a>
                            )}
                        </div>
                        {/* Quick Actions Menu */}
                        <div className="absolute top-4 right-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500 py-10">Không tìm thấy dữ liệu.</div>
            )}
        </div>

        {/* --- DESKTOP VIEW: TABLE --- */}
        <div className="hidden md:block overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/30 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Họ tên / Pháp danh</th>
                <th className="px-6 py-4">Đoàn</th>
                <th className="px-6 py-4">Bậc học</th>
                <th className="px-6 py-4">Ngày sinh</th>
                <th className="px-6 py-4">Phụ huynh</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {currentMembers.length > 0 ? (
                currentMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={member.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{member.full_name}</div>
                          <div className="text-xs text-primary-600 dark:text-primary-400 font-medium">{member.phap_danh}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        {member.doan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">{member.bac_hoc}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(member.birth_date).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div>{member.parent_name}</div>
                      <div className="text-xs">{member.parent_phone}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status === 'active' ? 'Đang sinh hoạt' : 'Nghỉ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`flex items-center justify-end gap-2 ${isDoanSinh ? '' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-primary-600" title="Xem chi tiết"><Eye size={18} /></button>
                        {!isDoanSinh && <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500"><Edit size={18} /></button>}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Không tìm thấy dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!isDoanSinh && filteredMembers.length > 0 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 dark:bg-gray-900/30">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị <span className="font-medium text-gray-900 dark:text-white">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredMembers.length)}</span> / <span className="font-medium text-gray-900 dark:text-white">{filteredMembers.length}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm font-medium">
                  {currentPage} / {totalPages}
                </div>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
           <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-primary-600 text-white">
                  <div>
                    <h3 className="text-xl font-bold">Thêm Đoàn Sinh Mới</h3>
                    <p className="text-primary-100 text-sm">Nhập thông tin hồ sơ đoàn phả</p>
                  </div>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-white/80 hover:text-white bg-white/10 p-2 rounded-full"><X size={20}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                 <form id="add-member-form" onSubmit={handleAddMember} className="space-y-6">
                    {/* 1. Thông tin cá nhân */}
                    <div>
                        <h4 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-4 border-b dark:border-gray-700 pb-2">1. Thông tin cá nhân</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Họ và tên (*)</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        required 
                                        type="text" 
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" 
                                        value={newMember.full_name || ''}
                                        onChange={(e) => handleChange('full_name', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pháp danh</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" 
                                    value={newMember.phap_danh || ''}
                                    onChange={(e) => handleChange('phap_danh', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ngày sinh</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="date" 
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 text-gray-500" 
                                        value={newMember.birth_date || ''}
                                        onChange={(e) => handleChange('birth_date', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giới tính</label>
                                <select 
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                                    value={newMember.gender}
                                    onChange={(e) => handleChange('gender', e.target.value)}
                                >
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 2. Thông tin sinh hoạt */}
                    <div>
                        <h4 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-4 border-b dark:border-gray-700 pb-2">2. Thông tin sinh hoạt</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Đoàn</label>
                                <select 
                                    disabled={isHuynhTruong} // Huynh trưởng chỉ được thêm vào đoàn mình
                                    className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 ${isHuynhTruong ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    value={newMember.doan}
                                    onChange={(e) => handleChange('doan', e.target.value)}
                                >
                                    {Object.values(Doan).map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bậc học hiện tại</label>
                                <select 
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                                    value={newMember.bac_hoc}
                                    onChange={(e) => handleChange('bac_hoc', e.target.value)}
                                >
                                    <option value="Mở Mắt">Mở Mắt (Oanh Vũ)</option>
                                    <option value="Cánh Mềm">Cánh Mềm (Oanh Vũ)</option>
                                    <option value="Chân Cứng">Chân Cứng (Oanh Vũ)</option>
                                    <option value="Tung Bay">Tung Bay (Oanh Vũ)</option>
                                    <option value="Hướng Thiện">Hướng Thiện (Thiếu)</option>
                                    <option value="Sơ Thiện">Sơ Thiện (Thiếu)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 3. Thông tin phụ huynh */}
                    <div>
                        <h4 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-4 border-b dark:border-gray-700 pb-2">3. Thông tin phụ huynh</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Họ tên Phụ huynh</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" 
                                        value={newMember.parent_name || ''}
                                        onChange={(e) => handleChange('parent_name', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SĐT Phụ huynh</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="tel" 
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" 
                                        value={newMember.parent_phone || ''}
                                        onChange={(e) => handleChange('parent_phone', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                 </form>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                  <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 rounded-lg transition"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit"
                    form="add-member-form"
                    className="px-5 py-2.5 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition flex items-center gap-2"
                  >
                    <Save size={18} /> Lưu Hồ Sơ
                  </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Members;
