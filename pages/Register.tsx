
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Lock, Phone, MapPin, 
  Calendar, Briefcase, Heart, ArrowRight, CheckCircle, Loader2 
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phapDanh: '',
    birthDate: '',
    gender: 'Nam',
    phone: '',
    address: '',
    occupation: '',
    parentName: '',
    parentPhone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);

    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      alert("Đăng ký thành công! Vui lòng chờ Ban Quản Trị duyệt hồ sơ.");
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Brand & Info */}
        <div className="md:w-5/12 bg-primary-600 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="relative z-10">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg p-3">
               <img 
                 src="https://ui-avatars.com/api/?name=GĐPT&background=166534&color=fff&rounded=true&bold=true&size=128"
                 alt="GĐPT Logo"
                 className="w-full h-full object-contain"
               />
             </div>
             <h2 className="text-3xl font-bold mb-4">Đăng Ký Thành Viên</h2>
             <p className="text-primary-100 mb-6 text-lg">
               Tham gia vào gia đình GĐPT Chánh Niệm để cùng tu học và rèn luyện.
             </p>
             
             <div className="space-y-4 mt-8">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-white/20 rounded-lg"><CheckCircle size={20} /></div>
                 <span>Quản lý hồ sơ Đoàn Phả điện tử</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-white/20 rounded-lg"><CheckCircle size={20} /></div>
                 <span>Theo dõi lộ trình tu học cá nhân</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-white/20 rounded-lg"><CheckCircle size={20} /></div>
                 <span>Cập nhật thông tin sinh hoạt nhanh chóng</span>
               </div>
             </div>
           </div>

           {/* Decorative Background Circles */}
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
           <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
           
           <div className="relative z-10 mt-12 text-sm text-primary-200">
             © 2023 GĐPT Chánh Niệm. All rights reserved.
           </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="md:w-7/12 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Thông tin hồ sơ</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Account Info */}
            <div>
              <h4 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-4 border-b pb-2">1. Thông tin tài khoản</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="email" 
                    name="email"
                    placeholder="Email đăng nhập (*)" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="password" 
                    name="password"
                    placeholder="Mật khẩu (*)" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="password" 
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu (*)" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Personal Info (Doan Pha) */}
            <div>
              <h4 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-4 border-b pb-2">2. Thông tin Đoàn Phả</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="text" 
                    name="fullName"
                    placeholder="Họ và tên (*)" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative">
                  <Heart className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="text" 
                    name="phapDanh"
                    placeholder="Pháp danh" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    value={formData.phapDanh}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="date" 
                    name="birthDate"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-gray-500"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="relative">
                   <select 
                      name="gender"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all bg-white"
                      value={formData.gender}
                      onChange={handleChange}
                   >
                     <option value="Nam">Nam</option>
                     <option value="Nữ">Nữ</option>
                   </select>
                </div>

                <div className="relative md:col-span-2">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="text" 
                    name="address"
                    placeholder="Địa chỉ thường trú (*)" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="tel" 
                    name="phone"
                    placeholder="Số điện thoại cá nhân (*)" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    name="occupation"
                    placeholder="Nghề nghiệp / Học vấn" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    value={formData.occupation}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Guardian Info */}
            <div>
              <h4 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-4 border-b pb-2">3. Thông tin phụ huynh / Bảo lãnh</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    name="parentName"
                    placeholder="Họ tên Phụ huynh" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    value={formData.parentName}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="tel" 
                    name="parentPhone"
                    placeholder="SĐT Phụ huynh" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    value={formData.parentPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    Đăng Ký Hồ Sơ <ArrowRight size={20} />
                  </>
                )}
              </button>
              <div className="mt-4 text-center">
                <span className="text-gray-500">Đã có tài khoản? </span>
                <Link to="/login" className="text-primary-600 font-bold hover:underline">Đăng nhập ngay</Link>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
