
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, Award, Shield, Bird, Sprout, Feather, Leaf } from 'lucide-react';
import { useAuthStore } from '../store';
import { UserRole } from '../types';

const RANKS = [
    { 
        group: 'Ngành Đồng', 
        // Màu Xanh Lục đặc trưng của Ngành Đồng
        color: 'bg-green-100 border-green-300 text-green-800',
        iconColor: 'text-green-700',
        icon: Bird,
        items: [
            { id: 'mo-mat', label: 'Mở Mắt', icon: Bird, desc: 'Oanh Vũ mới gia nhập' },
            { id: 'canh-mem', label: 'Cánh Mềm', icon: Feather, desc: 'Bắt đầu tập bay' },
            { id: 'chan-cung', label: 'Chân Cứng', icon: Bird, desc: 'Đứng vững trên cành' },
            { id: 'tung-bay', label: 'Tung Bay', icon: Bird, desc: 'Bay lượn bầu trời' }
        ] 
    },
    { 
        group: 'Ngành Thiếu', 
        // Màu Xanh Lam đặc trưng của Ngành Thiếu
        color: 'bg-blue-100 border-blue-300 text-blue-800',
        iconColor: 'text-blue-700',
        icon: Sprout,
        items: [
            { id: 'huong-thien', label: 'Hướng Thiện', icon: Sprout, desc: 'Mầm non hướng thiện' },
            { id: 'so-thien', label: 'Sơ Thiện', icon: Leaf, desc: 'Cây non vươn lên' },
            { id: 'trung-thien', label: 'Trung Thiện', icon: Leaf, desc: 'Cành lá sum suê' },
            { id: 'chanh-thien', label: 'Chánh Thiện', icon: Leaf, desc: 'Vững chãi trưởng thành' }
        ] 
    },
    { 
        group: 'Huynh Trưởng', 
        // Màu Vàng đặc trưng của Huynh Trưởng
        color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        iconColor: 'text-yellow-700',
        icon: Shield,
        items: [
            { id: 'kien', label: 'Bậc Kiên', icon: Shield, desc: 'Kiên trì tu học' },
            { id: 'tri', label: 'Bậc Trì', icon: Shield, desc: 'Gìn giữ lý tưởng' },
            { id: 'dinh', label: 'Bậc Định', icon: Shield, desc: 'Định tâm cống hiến' },
            { id: 'luc', label: 'Bậc Lực', icon: Shield, desc: 'Đầy đủ năng lực' }
        ] 
    },
];

const Education = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const isDoanSinh = user?.role === UserRole.DOAN_SINH;

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 animate-fade-in">
      <div className="text-center space-y-4 py-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-black text-gray-800 dark:text-white uppercase tracking-wide flex items-center justify-center gap-3">
            <BookOpen className="text-primary-600" /> Chương Trình Tu Học
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto px-4">
            {isDoanSinh 
                ? `Chào ${user?.full_name}, đây là chương trình tu học dành cho bậc ${user?.bac_hoc}.` 
                : 'Hệ thống giáo trình tu học GĐPT được phân chia theo từng Bậc học phù hợp với lứa tuổi và trình độ.'
            }
        </p>
      </div>

      <div className="space-y-12">
          {RANKS.map((section) => {
              const SectionIcon = section.icon;
              
              // Lọc danh sách các bậc học dựa trên quyền hạn
              const visibleItems = section.items.filter(rank => {
                  // Nếu là Huynh trưởng/Admin thì thấy hết
                  if (!isDoanSinh) return true;
                  
                  // Nếu là Đoàn sinh, chỉ thấy bậc học hiện tại của mình
                  return rank.label === user?.bac_hoc;
              });

              // Nếu không có bậc nào trong nhóm này phù hợp (ví dụ Oanh Vũ không thấy Ngành Thiếu), ẩn cả nhóm
              if (visibleItems.length === 0) return null;

              return (
                  <div key={section.group} className="relative">
                      {/* Section Header with Line */}
                      <div className="flex items-center gap-4 mb-8">
                          <div className={`p-3 rounded-xl shadow-sm ${section.color}`}>
                              <SectionIcon size={28} />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 dark:text-white uppercase tracking-wide">
                              {section.group}
                          </h3>
                          <div className="h-1 bg-gray-100 dark:bg-gray-700 flex-1 rounded-full"></div>
                      </div>

                      {/* Diamond Grid Layout mimicking the badges */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {visibleItems.map((rank) => {
                              const RankIcon = rank.icon;
                              return (
                                  <button
                                    key={rank.id}
                                    onClick={() => navigate(`/education/${rank.id}`)}
                                    className="group relative flex flex-col items-center text-center"
                                  >
                                      {/* Badge Shape Container */}
                                      <div className={`w-32 h-32 md:w-40 md:h-40 rotate-45 rounded-2xl shadow-md border-4 transition-all duration-300 flex items-center justify-center bg-white dark:bg-gray-800 group-hover:scale-105 group-hover:shadow-xl z-10 overflow-hidden ${section.color.replace('bg-', 'border-').replace('text-', 'border-')}`}>
                                          <div className="-rotate-45 flex flex-col items-center">
                                              <RankIcon size={40} className={`mb-2 ${section.iconColor}`} />
                                              <span className={`font-bold text-sm md:text-base uppercase ${section.iconColor}`}>
                                                  {rank.label}
                                              </span>
                                          </div>
                                      </div>
                                      
                                      {/* Description (Visible on Hover) */}
                                      <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-32 w-48 bg-gray-900 text-white text-xs p-2 rounded-lg shadow-lg z-20 pointer-events-none">
                                          {rank.desc}
                                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                      </div>
                                  </button>
                              );
                          })}
                      </div>
                  </div>
              )
          })}
          
          {isDoanSinh && RANKS.every(section => section.items.every(item => item.label !== user?.bac_hoc)) && (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500">Chưa tìm thấy chương trình tu học phù hợp với bậc "{user?.bac_hoc}".</p>
                  <p className="text-sm text-gray-400 mt-2">Vui lòng liên hệ Huynh trưởng để cập nhật hồ sơ.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default Education;
