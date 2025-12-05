
import React, { useState, useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign, Download, Plus, X, Lock, Building, Users, CheckSquare, Square, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { MOCK_TRANSACTIONS, MOCK_DOAN_SINH } from '../lib/mockData';
import { FinancialTransaction, UserRole, Doan } from '../types';
import { useAuthStore } from '../store';

const Finance = () => {
  const { user, canAccessDoan } = useAuthStore();
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(MOCK_TRANSACTIONS);
  
  // Filter state
  const [viewScope, setViewScope] = useState<'all' | 'general' | 'doan'>('all');
  
  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkCollectModalOpen, setIsBulkCollectModalOpen] = useState(false); // New Modal for Bulk

  // Single Transaction Form
  const [newTransaction, setNewTransaction] = useState<Partial<FinancialTransaction>>({
    type: 'income',
    date: new Date().toISOString().split('T')[0],
    category: 'Đóng góp',
    status: 'approved',
    scope: 'general',
    target_doan: user?.doan
  });

  // Bulk Collection Form State
  const [bulkConfig, setBulkConfig] = useState({
      amount: 10000,
      date: new Date().toISOString().split('T')[0],
      targetDoan: user?.doan || Doan.OANH_VU_NAM,
      description: 'Đóng quỹ đoàn hàng tuần'
  });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const isAdminOrGiaTruong = user?.role === UserRole.ADMIN_ROOT || user?.role === UserRole.GIA_TRUONG;
  const isHuynhTruong = user?.role === UserRole.HUYNH_TRUONG;

  // --- LOGIC: Filter visible transactions ---
  // STRICT PERMISSION CHECK:
  // - Admin/GiaTruong: See all (General + All Doan)
  // - Huynh Truong: See ONLY "Doan" scope AND matching target_doan. NO General access by default unless authorized.
  // - Doan Sinh: See nothing (handled in rendering)
  const visibleTransactions = useMemo(() => {
    if (user?.role === UserRole.DOAN_SINH) return [];

    return transactions.filter(t => {
      // 1. Check Scope & Doan Permission
      if (isAdminOrGiaTruong) {
          // Admin sees everything
          if (viewScope === 'all') return true;
          return t.scope === viewScope;
      }

      if (isHuynhTruong) {
          // Leader only sees their own Doan funds
          if (t.scope === 'doan' && t.target_doan === user.doan) {
              return true;
          }
          // Strict: Leaders usually DON'T see General fund unless specified. 
          // For this app, let's assume they DO NOT see general fund details, only their unit's.
          return false;
      }

      return false;
    });
  }, [transactions, viewScope, user, isAdminOrGiaTruong, isHuynhTruong]);

  const totalIncome = visibleTransactions.filter(t => t.type === 'income' && t.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = visibleTransactions.filter(t => t.type === 'expense' && t.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const dataPie = [
    { name: 'Thu', value: totalIncome },
    { name: 'Chi', value: totalExpense },
  ];
  const COLORS = ['#00B050', '#C00000'];

  // --- BULK LOGIC ---
  const membersForBulk = useMemo(() => {
      // Check if user is allowed to access target Doan
      if (!canAccessDoan(bulkConfig.targetDoan)) return [];

      // Get members of the selected Doan
      return MOCK_DOAN_SINH.filter(m => m.doan === bulkConfig.targetDoan && m.status === 'active');
  }, [bulkConfig.targetDoan, canAccessDoan]);

  // Auto-select all members when Doan changes or modal opens
  React.useEffect(() => {
      if (isBulkCollectModalOpen) {
          setSelectedMembers(membersForBulk.map(m => m.id));
      }
  }, [membersForBulk, isBulkCollectModalOpen]);

  const toggleMemberSelection = (id: string) => {
      setSelectedMembers(prev => 
          prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
      );
  };

  const toggleSelectAll = () => {
      if (selectedMembers.length === membersForBulk.length) {
          setSelectedMembers([]);
      } else {
          setSelectedMembers(membersForBulk.map(m => m.id));
      }
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedMembers.length === 0) return;

      const newTransactions: FinancialTransaction[] = selectedMembers.map(memberId => {
          const member = membersForBulk.find(m => m.id === memberId);
          return {
              id: `trans_bulk_${Date.now()}_${memberId}`,
              date: bulkConfig.date,
              amount: bulkConfig.amount,
              type: 'income',
              scope: 'doan',
              target_doan: bulkConfig.targetDoan,
              category: 'Quỹ đoàn',
              description: `${bulkConfig.description} - ${member?.full_name}`,
              performer: user?.full_name || 'System',
              status: 'approved'
          };
      });

      setTransactions([...newTransactions, ...transactions]);
      setIsBulkCollectModalOpen(false);
      alert(`Đã tạo thành công ${newTransactions.length} phiếu thu!`);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.amount || !newTransaction.description) return;
    
    // Strict check for Leaders creating transactions
    if (isHuynhTruong && newTransaction.scope === 'general') {
        alert("Huynh trưởng không có quyền tạo giao dịch Quỹ Gia Đình.");
        return;
    }
    if (isHuynhTruong && newTransaction.scope === 'doan' && newTransaction.target_doan !== user.doan) {
        alert("Bạn không có quyền tạo giao dịch cho Đoàn khác.");
        return;
    }

    const transaction: FinancialTransaction = {
      id: `trans_${Date.now()}`,
      date: newTransaction.date || new Date().toISOString(),
      amount: Number(newTransaction.amount),
      type: newTransaction.type as 'income' | 'expense',
      scope: newTransaction.scope as 'general' | 'doan',
      target_doan: newTransaction.scope === 'doan' ? newTransaction.target_doan : undefined,
      category: newTransaction.category || 'Khác',
      description: newTransaction.description || '',
      performer: user?.full_name || 'Admin',
      status: 'approved'
    };

    setTransactions([transaction, ...transactions]);
    setIsAddModalOpen(false);
    
    setNewTransaction({
        type: 'income',
        date: new Date().toISOString().split('T')[0],
        category: 'Đóng góp',
        status: 'approved',
        amount: 0,
        description: '',
        scope: isHuynhTruong ? 'doan' : 'general',
        target_doan: user?.doan
    });
  };

  const allowedDoanOptions = useMemo(() => {
      return Object.values(Doan).filter(d => canAccessDoan(d));
  }, [canAccessDoan]);

  // If user is Doan Sinh, show restricted view
  if (user?.role === UserRole.DOAN_SINH) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                  <Lock size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quyền Truy Cập Hạn Chế</h3>
              <p className="text-gray-500 mt-2 max-w-md">
                  Thông tin tài chính chỉ dành cho Ban Quản Trị và Huynh Trưởng. Vui lòng liên hệ Huynh trưởng đoàn của bạn nếu cần thông tin chi tiết.
              </p>
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Quản Lý Tài Chính</h2>
          <p className="text-gray-500 text-sm mt-1">
              {isHuynhTruong ? `Quỹ Đoàn ${user.doan}` : 'Theo dõi thu chi Quỹ Gia Đình và Quỹ Đoàn.'}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap w-full md:w-auto">
           
           {/* Scope Filter - Only show if Admin */}
           {isAdminOrGiaTruong && (
               <div className="bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 flex text-sm font-medium">
                 <button 
                    onClick={() => setViewScope('all')}
                    className={`px-3 py-1.5 rounded transition-colors ${viewScope === 'all' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                 >
                    Tất cả
                 </button>
                 <button 
                    onClick={() => setViewScope('general')}
                    className={`px-3 py-1.5 rounded transition-colors ${viewScope === 'general' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                 >
                    Quỹ Gia Đình
                 </button>
                 <button 
                    onClick={() => setViewScope('doan')}
                    className={`px-3 py-1.5 rounded transition-colors ${viewScope === 'doan' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                 >
                    Quỹ Đoàn
                 </button>
               </div>
           )}
           
           {/* Bulk Collect Button */}
           <button 
             onClick={() => setIsBulkCollectModalOpen(true)}
             className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition shadow-lg shadow-green-600/20"
           >
             <Users size={16} /> <span className="hidden sm:inline">Thu Quỹ Nhanh</span><span className="sm:hidden">Thu Nhanh</span>
           </button>

           <button 
             onClick={() => setIsAddModalOpen(true)}
             className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-600/20"
           >
             <Plus size={16} /> Thu/Chi Lẻ
           </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex items-center justify-between mb-4">
               <span className="text-gray-500 text-sm font-medium">
                   {isHuynhTruong ? 'Tổng Quỹ Đoàn' : (viewScope === 'general' ? 'Tổng Quỹ Gia Đình' : 'Tổng Quỹ Hiển Thị')}
               </span>
               <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Wallet size={20} /></div>
           </div>
           <div className="text-2xl font-bold text-gray-900 dark:text-white">{balance.toLocaleString('vi-VN')} ₫</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex items-center justify-between mb-4">
               <span className="text-gray-500 text-sm font-medium">Tổng Thu</span>
               <div className="p-2 bg-green-100 text-green-600 rounded-lg"><TrendingUp size={20} /></div>
           </div>
           <div className="text-2xl font-bold text-green-600">+{totalIncome.toLocaleString('vi-VN')} ₫</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex items-center justify-between mb-4">
               <span className="text-gray-500 text-sm font-medium">Tổng Chi</span>
               <div className="p-2 bg-red-100 text-red-600 rounded-lg"><TrendingDown size={20} /></div>
           </div>
           <div className="text-2xl font-bold text-red-600">-{totalExpense.toLocaleString('vi-VN')} ₫</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Table / Cards */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 dark:text-white">Giao dịch gần đây</h3>
                <button className="text-sm text-primary-600 hover:underline">Xem tất cả</button>
            </div>
            
            {/* MOBILE: CARD VIEW */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
                {visibleTransactions.map((t) => (
                    <div key={t.id} className="p-4 flex items-start justify-between bg-white dark:bg-gray-800">
                        <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-900 dark:text-white line-clamp-1">{t.description}</span>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded uppercase tracking-wide">{t.category}</span>
                                <span className="flex items-center gap-1"><Calendar size={10}/> {new Date(t.date).toLocaleDateString('vi-VN', {day:'2-digit', month:'2-digit'})}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                {t.scope === 'general' ? 'Gia Đình' : t.target_doan}
                            </div>
                        </div>
                        <div className={`text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('vi-VN')}
                        </div>
                    </div>
                ))}
                {visibleTransactions.length === 0 && (
                    <div className="p-8 text-center text-gray-500 text-sm">Chưa có giao dịch nào.</div>
                )}
            </div>

            {/* DESKTOP: TABLE VIEW */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700/30 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Mô tả</th>
                            <th className="px-6 py-3">Quỹ</th>
                            <th className="px-6 py-3">Ngày</th>
                            <th className="px-6 py-3 text-right">Số tiền</th>
                            <th className="px-6 py-3 text-center">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {visibleTransactions.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 dark:text-white line-clamp-1" title={t.description}>{t.description}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide">
                                            {t.category}
                                        </span>
                                        • {t.performer}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                    {t.scope === 'general' ? (
                                        <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs font-medium w-fit">
                                            <Building size={12} /> Gia Đình
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium w-fit">
                                            <Lock size={12} /> {t.target_doan}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{new Date(t.date).toLocaleDateString('vi-VN')}</td>
                                <td className={`px-6 py-4 text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('vi-VN')}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        t.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                        t.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {t.status === 'approved' ? 'Đã duyệt' : t.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {visibleTransactions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Chưa có giao dịch nào trong mục này.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-6">Cơ cấu thu chi</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={dataPie}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {dataPie.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <RechartsTooltip formatter={(value: number) => `${value.toLocaleString('vi-VN')} ₫`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
                Biểu đồ thể hiện tỷ lệ thu chi của {isHuynhTruong ? `Quỹ Đoàn ${user.doan}` : (viewScope === 'general' ? 'Quỹ Gia Đình' : 'Tất cả các quỹ')}.
            </div>
        </div>
      </div>

       {/* Add Transaction Modal */}
       {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
           <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tạo Giao Dịch Mới</h3>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                  <form onSubmit={handleAddTransaction} className="space-y-4">
                      
                      {/* Scope Selection - Only for Admin */}
                      {isAdminOrGiaTruong && (
                          <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Loại quỹ</label>
                              <div className="grid grid-cols-2 gap-3">
                                  <button
                                    type="button"
                                    onClick={() => setNewTransaction({...newTransaction, scope: 'general'})}
                                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                        newTransaction.scope === 'general' 
                                        ? 'bg-purple-50 border-purple-200 text-purple-700 ring-1 ring-purple-500' 
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                  >
                                     <Building size={16} /> Quỹ Gia Đình
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setNewTransaction({...newTransaction, scope: 'doan'})}
                                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                        newTransaction.scope === 'doan' 
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-500' 
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                  >
                                     <Lock size={16} /> Quỹ Đoàn
                                  </button>
                              </div>
                          </div>
                      )}

                      {/* Doan Selection */}
                      {newTransaction.scope === 'doan' && (
                          <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Đoàn</label>
                              <select 
                                value={newTransaction.target_doan}
                                onChange={(e) => setNewTransaction({...newTransaction, target_doan: e.target.value as Doan})}
                                disabled={isHuynhTruong} // Leader can't change Doan
                                className={`w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 ${isHuynhTruong ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                              >
                                  {isAdminOrGiaTruong ? (
                                      Object.values(Doan).map(d => <option key={d} value={d}>{d}</option>)
                                  ) : (
                                      <option value={user?.doan}>{user?.doan}</option>
                                  )}
                              </select>
                          </div>
                      )}

                      <div className="flex gap-4 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <button 
                            type="button"
                            onClick={() => setNewTransaction({...newTransaction, type: 'income'})}
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${newTransaction.type === 'income' ? 'bg-white dark:bg-gray-600 text-green-600 shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}
                          >
                              Thu (Income)
                          </button>
                          <button 
                             type="button"
                             onClick={() => setNewTransaction({...newTransaction, type: 'expense'})}
                             className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${newTransaction.type === 'expense' ? 'bg-white dark:bg-gray-600 text-red-600 shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}
                          >
                              Chi (Expense)
                          </button>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số tiền (VNĐ)</label>
                          <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                              <input 
                                type="number" 
                                required
                                min="0"
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="0"
                                onChange={(e) => setNewTransaction({...newTransaction, amount: Number(e.target.value)})}
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ngày giao dịch</label>
                          <input 
                            type="date" 
                            required
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                            value={newTransaction.date}
                            onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                          />
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Danh mục</label>
                          <select 
                             className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                             value={newTransaction.category}
                             onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                          >
                              <option value="Đóng góp">Đóng góp</option>
                              <option value="Quỹ đoàn">Quỹ đoàn</option>
                              <option value="Hoạt động">Hoạt động</option>
                              <option value="Trại">Trại</option>
                              <option value="Mua sắm">Mua sắm</option>
                              <option value="Khác">Khác</option>
                          </select>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mô tả</label>
                          <textarea 
                             className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                             rows={2}
                             required
                             placeholder="Nội dung chi tiết..."
                             onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                          ></textarea>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition"
                      >
                          Lưu Giao Dịch
                      </button>
                  </form>
              </div>
           </div>
        </div>
       )}

       {/* BULK COLLECT MODAL */}
       {isBulkCollectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
           <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-green-600 text-white">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2"><Users size={20}/> Thu Quỹ Hàng Loạt</h3>
                    <p className="text-green-100 text-sm">Tạo nhanh phiếu thu cho các đoàn sinh</p>
                  </div>
                  <button onClick={() => setIsBulkCollectModalOpen(false)} className="text-white/80 hover:text-white bg-white/10 p-2 rounded-full"><X size={20}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                  <form id="bulk-form" onSubmit={handleBulkSubmit} className="space-y-6">
                      {/* Configuration */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Đoàn</label>
                              <select 
                                className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${isHuynhTruong ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                value={bulkConfig.targetDoan}
                                onChange={(e) => setBulkConfig({...bulkConfig, targetDoan: e.target.value as Doan})}
                                disabled={isHuynhTruong}
                              >
                                  {allowedDoanOptions.map(d => (
                                      <option key={d} value={d}>{d}</option>
                                  ))}
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số tiền mỗi em</label>
                              <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                  <input 
                                    type="number"
                                    className="w-full pl-9 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white font-bold text-green-600"
                                    value={bulkConfig.amount}
                                    onChange={(e) => setBulkConfig({...bulkConfig, amount: Number(e.target.value)})}
                                  />
                              </div>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ngày thu</label>
                              <input 
                                type="date"
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={bulkConfig.date}
                                onChange={(e) => setBulkConfig({...bulkConfig, date: e.target.value})}
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ghi chú chung</label>
                              <input 
                                type="text"
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={bulkConfig.description}
                                onChange={(e) => setBulkConfig({...bulkConfig, description: e.target.value})}
                              />
                          </div>
                      </div>

                      {/* Member List Selection */}
                      <div className="border rounded-xl border-gray-200 dark:border-gray-700 overflow-hidden">
                          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                              <span className="font-semibold text-sm">Danh sách đoàn sinh ({selectedMembers.length}/{membersForBulk.length})</span>
                              <button 
                                type="button" 
                                onClick={toggleSelectAll}
                                className="text-xs text-primary-600 hover:underline font-medium"
                              >
                                  {selectedMembers.length === membersForBulk.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                              </button>
                          </div>
                          <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                              {membersForBulk.length > 0 ? (
                                  membersForBulk.map(member => (
                                      <div 
                                        key={member.id}
                                        onClick={() => toggleMemberSelection(member.id)}
                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                            selectedMembers.includes(member.id) 
                                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
                                        }`}
                                      >
                                          <div className={selectedMembers.includes(member.id) ? 'text-green-600' : 'text-gray-400'}>
                                              {selectedMembers.includes(member.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                                          </div>
                                          <div>
                                              <div className="font-medium text-sm text-gray-900 dark:text-white">{member.full_name}</div>
                                              <div className="text-xs text-gray-500">{member.phap_danh}</div>
                                          </div>
                                      </div>
                                  ))
                              ) : (
                                  <div className="p-4 text-center text-gray-500 text-sm">Không có đoàn sinh nào trong đoàn này.</div>
                              )}
                          </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                          <span className="text-sm font-medium">Tổng thu dự kiến:</span>
                          <span className="text-xl font-bold text-green-600">{(selectedMembers.length * bulkConfig.amount).toLocaleString('vi-VN')} ₫</span>
                      </div>
                  </form>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                  <button 
                    onClick={() => setIsBulkCollectModalOpen(false)}
                    className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 rounded-lg transition"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit"
                    form="bulk-form"
                    className="px-5 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg shadow-green-600/20 transition flex items-center gap-2"
                  >
                    <Wallet size={18} /> Xác Nhận Thu
                  </button>
              </div>
           </div>
        </div>
       )}
    </div>
  );
};

export default Finance;
