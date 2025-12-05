
import React, { useState } from 'react';
import { Tent, Search, Filter, AlertCircle, CheckCircle, Package, Plus, X, Save, Image as ImageIcon, MoreVertical } from 'lucide-react';
import { MOCK_INVENTORY } from '../lib/mockData';
import { InventoryItem } from '../types';

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    status: 'good',
    quantity: 1,
    category: 'Khác',
    last_check: new Date().toISOString().split('T')[0]
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;

    const item: InventoryItem = {
      id: `inv_${Date.now()}`,
      name: newItem.name,
      category: newItem.category || 'Khác',
      quantity: Number(newItem.quantity) || 1,
      status: newItem.status as 'good' | 'damaged' | 'lost',
      last_check: newItem.last_check || new Date().toISOString().split('T')[0],
      image_url: `https://picsum.photos/100/100?random=${Date.now()}` // Mock image
    };

    setInventory([item, ...inventory]);
    setIsAddModalOpen(false);
    setNewItem({ status: 'good', quantity: 1, category: 'Khác', last_check: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Quản Lý Khí Mãnh</h2>
          <p className="text-gray-500 text-sm mt-1">Kiểm kê vật dụng, lều trại, thiết bị sinh hoạt.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setIsAddModalOpen(true)}
             className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-600/20 flex items-center gap-2"
           >
             <Plus size={16} /> Nhập kho
           </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-2"><Package size={20} /></div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Tổng loại</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{inventory.length}</p>
            </div>
         </div>
         <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="p-3 bg-green-100 text-green-600 rounded-full mb-2"><CheckCircle size={20} /></div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Tốt</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{inventory.filter(i => i.status === 'good').reduce((acc, curr) => acc + curr.quantity, 0)}</p>
            </div>
         </div>
         <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full mb-2"><Tent size={20} /></div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Tổng số</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{inventory.reduce((acc, curr) => acc + curr.quantity, 0)}</p>
            </div>
         </div>
         <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="p-3 bg-red-100 text-red-600 rounded-full mb-2"><AlertCircle size={20} /></div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Hư hỏng</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{inventory.filter(i => i.status !== 'good').reduce((acc, curr) => acc + curr.quantity, 0)}</p>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex gap-4">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Tìm kiếm vật dụng..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <Filter size={16} /> Lọc
            </button>
        </div>
        
        {/* MOBILE VIEW: CARD LIST */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50">
            {inventory.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 relative">
                    <img src={item.image_url} alt="" className="w-20 h-20 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-gray-900 dark:text-white truncate pr-6">{item.name}</h3>
                            <button className="text-gray-400"><MoreVertical size={16}/></button>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                        
                        <div className="flex items-center gap-2 text-sm mb-1">
                            <span className="font-medium text-gray-700 dark:text-gray-300">SL: {item.quantity}</span>
                            <span className="text-gray-300">|</span>
                            <span className={`text-xs font-bold uppercase ${
                                item.status === 'good' ? 'text-green-600' :
                                item.status === 'damaged' ? 'text-red-600' : 'text-gray-500'
                            }`}>
                                {item.status === 'good' ? 'Tốt' : item.status === 'damaged' ? 'Hỏng' : 'Mất'}
                            </span>
                        </div>
                        <p className="text-[10px] text-gray-400">Cập nhật: {new Date(item.last_check).toLocaleDateString('vi-VN')}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* DESKTOP VIEW: TABLE */}
        <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/30 text-gray-500 font-medium">
                    <tr>
                        <th className="px-6 py-4">Tên vật dụng</th>
                        <th className="px-6 py-4">Danh mục</th>
                        <th className="px-6 py-4 text-center">Số lượng</th>
                        <th className="px-6 py-4">Tình trạng</th>
                        <th className="px-6 py-4">Kiểm tra lần cuối</th>
                        <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {inventory.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-6 py-4 flex items-center gap-3">
                                <img src={item.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{item.category}</td>
                            <td className="px-6 py-4 text-center font-medium">{item.quantity}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    item.status === 'good' ? 'bg-green-100 text-green-700' :
                                    item.status === 'damaged' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {item.status === 'good' ? 'Tốt' : item.status === 'damaged' ? 'Hư hỏng' : 'Thất lạc'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{new Date(item.last_check).toLocaleDateString('vi-VN')}</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-primary-600 hover:text-primary-700 font-medium text-xs">Chi tiết</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

       {/* Add Inventory Modal */}
       {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
           <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nhập Kho Vật Dụng</h3>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
              </div>
              <form onSubmit={handleAddItem} className="p-6 space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên vật dụng</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số lượng</label>
                          <input 
                            type="number" 
                            min="1"
                            required
                            value={newItem.quantity}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                            onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Danh mục</label>
                          <select 
                             className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                             value={newItem.category}
                             onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                          >
                             <option value="Trại">Trại</option>
                             <option value="Kỹ năng">Kỹ năng</option>
                             <option value="Nghi thức">Nghi thức</option>
                             <option value="Hậu cần">Hậu cần</option>
                             <option value="Khác">Khác</option>
                          </select>
                      </div>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tình trạng</label>
                      <select 
                         className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                         value={newItem.status}
                         onChange={(e) => setNewItem({...newItem, status: e.target.value as any})}
                      >
                         <option value="good">Tốt</option>
                         <option value="damaged">Hư hỏng</option>
                         <option value="lost">Thất lạc</option>
                      </select>
                  </div>
                  
                   <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ngày kiểm tra</label>
                      <input 
                        type="date" 
                        required
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                        value={newItem.last_check}
                        onChange={(e) => setNewItem({...newItem, last_check: e.target.value})}
                      />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-2"
                  >
                      <Save size={18} /> Lưu Kho
                  </button>
              </form>
           </div>
        </div>
       )}
    </div>
  );
};

export default Inventory;
