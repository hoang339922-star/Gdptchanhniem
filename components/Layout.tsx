
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../store';
import { 
  LayoutDashboard, Users, UserCheck, BookOpen, 
  Wallet, Tent, Award, Settings, LogOut, Menu, 
  Bell, Moon, Sun, ShieldAlert,
  CalendarDays, Lightbulb, BookHeart, Library, FileBarChart
} from 'lucide-react';
import { UserRole } from '../types';

const SidebarItem = ({ to, icon: Icon, label, onClick }: { to: string; icon: any; label: string; onClick?: () => void }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-primary-600 text-white shadow-md'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`
    }
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const Layout = () => {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar, darkMode, toggleDarkMode } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to close sidebar on mobile when navigating
  const handleNavClick = () => {
      if (window.innerWidth < 768 && sidebarOpen) {
          toggleSidebar();
      }
  };

  if (!user) return null;

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-30 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20 lg:w-64'
        }`}
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-100 dark:border-gray-800">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'md:hidden lg:flex'}`}>
            <img 
              src="https://ui-avatars.com/api/?name=GĐPT&background=166534&color=fff&rounded=true&bold=true" 
              alt="GĐPT Logo" 
              className="w-10 h-10 object-contain drop-shadow-sm"
            />
            <span className="font-bold text-primary-700 dark:text-white truncate text-sm">GĐPT Chánh Niệm</span>
          </div>
          <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden">
            <Menu size={20} className="text-gray-500" />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <SidebarItem to="/" icon={LayoutDashboard} label="Tổng quan" onClick={handleNavClick} />
          <SidebarItem to="/members" icon={Users} label="Đoàn sinh" onClick={handleNavClick} />
          <SidebarItem to="/attendance" icon={UserCheck} label="Điểm danh" onClick={handleNavClick} />
          
          {(user.role !== UserRole.DOAN_SINH && user.role !== UserRole.PHU_HUYNH) && (
             <SidebarItem to="/reports" icon={FileBarChart} label="Báo cáo" onClick={handleNavClick} />
          )}

          <div className="my-4 border-t border-gray-100 dark:border-gray-800"></div>
          
          <SidebarItem to="/resources" icon={Library} label="Tư liệu sinh hoạt" onClick={handleNavClick} />
          <SidebarItem to="/good-deeds" icon={BookHeart} label="Sổ việc thiện" onClick={handleNavClick} />
          <SidebarItem to="/education" icon={BookOpen} label="Tu học" onClick={handleNavClick} />
          <SidebarItem to="/skills" icon={Lightbulb} label="Kỹ năng" onClick={handleNavClick} />
          <SidebarItem to="/finance" icon={Wallet} label="Tài chính" onClick={handleNavClick} />
          <SidebarItem to="/events" icon={CalendarDays} label="Sự kiện" onClick={handleNavClick} />
          <SidebarItem to="/inventory" icon={Tent} label="Khí mãnh" onClick={handleNavClick} />
          <SidebarItem to="/achievements" icon={Award} label="Khen thưởng" onClick={handleNavClick} />
          
          {(user.role === UserRole.ADMIN_ROOT || user.role === UserRole.GIA_TRUONG) && (
            <>
              <div className="my-4 border-t border-gray-100 dark:border-gray-800"></div>
              <SidebarItem to="/admin" icon={ShieldAlert} label="Quản trị" onClick={handleNavClick} />
            </>
          )}
          
          <div className="my-4 border-t border-gray-100 dark:border-gray-800"></div>
          <SidebarItem to="/settings" icon={Settings} label="Cài đặt" onClick={handleNavClick} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white hidden sm:block">
              {/* Dynamic Title could go here */}
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-yellow-400"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
              </button>
            </div>

            <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.full_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.phap_danh} • {user.role}</p>
              </div>
              <div className="relative group cursor-pointer">
                <img 
                  src={user.avatar_url || 'https://ui-avatars.com/api/?name=User'} 
                  alt="Avatar" 
                  className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-700 hidden group-hover:block">
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
                  >
                    <LogOut size={16} className="mr-2" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 scroll-smooth">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
