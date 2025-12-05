import React from 'react';
import { Save, Bell, Lock, User, Globe, Database } from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Cài Đặt Hệ Thống</h2>
          <p className="text-gray-500 text-sm mt-1">Quản lý tài khoản và cấu hình ứng dụng.</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition flex items-center gap-2">
           <Save size={16} /> Lưu thay đổi
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
         <div className="flex flex-col md:flex-row min-h-[500px]">
             {/* Sidebar Navigation */}
             <div className="w-full md:w-64 border-r border-gray-100 dark:border-gray-700 p-4 space-y-1">
                 <button className="w-full text-left px-4 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium flex items-center gap-3">
                     <User size={18} /> Hồ sơ cá nhân
                 </button>
                 <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium flex items-center gap-3 transition-colors">
                     <Bell size={18} /> Thông báo
                 </button>
                 <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium flex items-center gap-3 transition-colors">
                     <Lock size={18} /> Bảo mật
                 </button>
                 <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium flex items-center gap-3 transition-colors">
                     <Globe size={18} /> Ngôn ngữ & Khu vực
                 </button>
                  <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium flex items-center gap-3 transition-colors">
                     <Database size={18} /> Sao lưu dữ liệu
                 </button>
             </div>

             {/* Content Area */}
             <div className="flex-1 p-6 md:p-8 space-y-6">
                 <div>
                     <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Thông tin chung</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Họ và tên</label>
                             <input type="text" defaultValue="Nguyễn Văn Tâm" className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-primary-500" />
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pháp danh</label>
                             <input type="text" defaultValue="Tâm Minh" className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-primary-500" />
                         </div>
                         <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                             <input type="email" defaultValue="giatruong@gdpt.vn" className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50" disabled />
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số điện thoại</label>
                             <input type="text" defaultValue="+84 909 123 456" className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-primary-500" />
                         </div>
                     </div>
                 </div>

                 <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Giao diện</h3>
                      <div className="flex items-center justify-between py-2">
                          <div>
                              <div className="font-medium text-gray-800 dark:text-gray-200">Chế độ tối (Dark Mode)</div>
                              <div className="text-sm text-gray-500">Giảm mỏi mắt khi sử dụng ban đêm</div>
                          </div>
                          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                              <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:right-0 checked:border-primary-600"/>
                              <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer checked:bg-primary-600"></label>
                          </div>
                      </div>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default Settings;