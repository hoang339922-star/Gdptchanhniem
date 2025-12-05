
import React, { useState } from 'react';
import { useAuthStore, MOCK_USERS_DB } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ShieldCheck, UserCheck, Users, Smile, Sprout } from 'lucide-react';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = (userKey: string) => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const user = MOCK_USERS_DB[userKey];
      if (user) {
        login(user);
        navigate('/');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Brand */}
        <div className="md:w-1/2 bg-primary-600 p-8 md:p-12 text-center flex flex-col justify-center items-center text-white relative overflow-hidden">
           {/* Decorative Elements */}
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 right-0 w-48 h-48 bg-white rounded-full blur-3xl"></div>
           </div>

           <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-primary-100 p-4 relative z-10">
             <img 
               src="https://ui-avatars.com/api/?name=GĐPT&background=166534&color=fff&rounded=true&bold=true&size=128"
               alt="GĐPT Logo"
               className="w-full h-full object-contain"
             />
           </div>
           <h2 className="text-3xl font-bold mb-2 relative z-10">GĐPT Chánh Niệm</h2>
           <p className="text-primary-100 mb-8 max-w-sm relative z-10">Hệ thống quản lý hành chính, nhân sự và tu học toàn diện.</p>
           <div className="text-sm opacity-75 relative z-10">Phiên bản Demo v1.0</div>
        </div>

        {/* Right Side: Role Selection */}
        <div className="md:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Đăng Nhập</h3>
          <p className="text-gray-500 mb-8">Vui lòng chọn vai trò để trải nghiệm phân quyền:</p>

          <div className="space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-primary-600">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p>Đang truy cập hệ thống...</p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleLogin('admin')}
                  className="w-full p-3 rounded-xl border-2 border-gray-100 hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center gap-4 group text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Gia Trưởng / Admin</h4>
                    <p className="text-xs text-gray-500">Quyền truy cập toàn bộ hệ thống</p>
                  </div>
                </button>

                <button
                  onClick={() => handleLogin('ov_nam')}
                  className="w-full p-3 rounded-xl border-2 border-gray-100 hover:border-yellow-500 hover:bg-yellow-50 transition-all flex items-center gap-4 group text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">HT Oanh Vũ Nam</h4>
                    <p className="text-xs text-gray-500">Quản lý đoàn Oanh Vũ Nam</p>
                  </div>
                </button>

                <button
                  onClick={() => handleLogin('doan_sinh')}
                  className="w-full p-3 rounded-xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 transition-all flex items-center gap-4 group text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <Smile size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Oanh Vũ (An)</h4>
                    <p className="text-xs text-gray-500">Bậc Mở Mắt</p>
                  </div>
                </button>

                <button
                  onClick={() => handleLogin('thieu_sinh')}
                  className="w-full p-3 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-4 group text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Sprout size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Thiếu Sinh (Cường)</h4>
                    <p className="text-xs text-gray-500">Bậc Hướng Thiện</p>
                  </div>
                </button>
              </>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <span className="text-gray-500 text-sm">Chưa có tài khoản? </span>
            <Link to="/register" className="text-primary-600 font-bold hover:underline text-sm">Đăng ký làm đoàn viên</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
