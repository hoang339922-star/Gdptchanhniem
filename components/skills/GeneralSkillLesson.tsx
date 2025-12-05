
import React, { useState } from 'react';
import { ArrowRight, Book, Play, GraduationCap, Info } from 'lucide-react';
import { SkillTopic } from '../../types';
import { TOPIC_CONFIG } from '../../lib/skillData';

interface GeneralSkillLessonProps {
  topic: SkillTopic;
  onBack: () => void;
  onStartQuiz: () => void;
}

const LESSON_CONTENT: Record<string, { title: string; subtitle: string; sections: { heading: string; content: string; image?: string; video?: string }[] }> = {
    'PhatPhap': {
        title: 'Phật Pháp Căn Bản',
        subtitle: 'Giáo lý nhập môn cho Đoàn sinh',
        sections: [
            {
                heading: '1. Lịch sử Đức Phật Thích Ca',
                content: 'Đức Phật Thích Ca Mâu Ni tên thật là Tất Đạt Đa, thái tử con vua Tịnh Phạn và hoàng hậu Maya. Ngài sinh ra tại vườn Lâm Tỳ Ni (Lumbini). Sau khi thấy 4 cảnh khổ (Sinh, Lão, Bệnh, Tử), Ngài quyết chí xuất gia tìm đạo. Sau 6 năm khổ hạnh và 49 ngày thiền định dưới cội Bồ Đề, Ngài đã chứng ngộ chân lý và thành Phật.',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/The_Great_Buddha_of_Kamakura.jpg/640px-The_Great_Buddha_of_Kamakura.jpg'
            },
            {
                heading: '2. Tam Quy & Ngũ Giới',
                content: `**Tam Quy:** Quay về nương tựa Phật (Người dẫn đường), Pháp (Lời dạy), Tăng (Đoàn thể tu tập).\n\n**Ngũ Giới:**\n1. Không sát sanh (Tôn trọng sự sống)\n2. Không trộm cắp (Tôn trọng tài sản)\n3. Không tà dâm (Tôn trọng hạnh phúc)\n4. Không nói dối (Tôn trọng sự thật)\n5. Không uống rượu (Bảo vệ trí tuệ)`,
            },
            {
                heading: '3. Video: Cuộc đời Đức Phật (Hoạt hình)',
                content: 'Tóm tắt cuộc đời Đức Phật qua phim hoạt hình ngắn.',
                video: 'https://www.youtube.com/embed/EDwV8EnD9Cw' // Example video ID
            }
        ]
    },
    'KienThucGDPT': {
        title: 'Kiến Thức GĐPT',
        subtitle: 'Tổ chức, Ý nghĩa huy hiệu và Nội quy',
        sections: [
            {
                heading: '1. Ý nghĩa Huy Hiệu Hoa Sen',
                content: 'Huy hiệu GĐPT là hình hoa sen trắng 8 cánh trên nền xanh lá mạ.\n- **5 cánh trên:** Tượng trưng cho 5 hạnh (Tinh tấn, Hỷ xả, Thanh tịnh, Trí tuệ, Từ bi).\n- **3 cánh dưới:** Tượng trưng cho Tam Bảo (Phật, Pháp, Tăng).\n- **Màu trắng:** Sự tinh khiết.\n- **Màu xanh nền:** Tuổi trẻ và hy vọng.',
                image: 'https://gdptvietnam.org/wp-content/uploads/2013/05/Huy-hieu-GDPT.jpg'
            },
            {
                heading: '2. Châm ngôn & Khẩu hiệu',
                content: '- **Châm ngôn:** Bi - Trí - Dũng.\n- **Khẩu hiệu:**\n  + Oanh Vũ: Ngoan\n  + Thiếu: Dũng\n  + Thanh: Tinh Tấn\n  + Huynh trưởng: Tinh Tấn',
            },
            {
                heading: '3. Mục đích GĐPT',
                content: 'Đào luyện Thanh - Thiếu - Đồng niên tin Phật thành Phật tử chân chính, góp phần xây dựng xã hội theo tinh thần Phật giáo.',
            }
        ]
    }
};

const GeneralSkillLesson: React.FC<GeneralSkillLessonProps> = ({ topic, onBack, onStartQuiz }) => {
  const [mode, setMode] = useState<'menu' | 'learn'>('menu');
  const content = LESSON_CONTENT[topic];
  const Config = TOPIC_CONFIG[topic];
  const Icon = Config?.icon || Book;

  // Fallback if no content defined
  if (!content) {
      return (
          <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-gray-500 mb-4">Nội dung đang được cập nhật.</p>
              <button onClick={onBack} className="text-primary-600 underline">Quay lại</button>
          </div>
      );
  }

  // 1. Menu Selection Mode
  if (mode === 'menu') {
      return (
          <div className="max-w-3xl mx-auto space-y-8 py-10 animate-fade-in bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <button onClick={onBack} className="text-sm font-bold text-gray-600 hover:text-black flex items-center gap-2">
                 <ArrowRight className="rotate-180" size={20} /> Quay lại Menu Chính
              </button>
              
              <div className="text-center">
                  <div className={`w-24 h-24 bg-white border-4 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md ${Config?.color ? Config.color.replace('text-', 'border-').replace('600', '100') : 'border-gray-100'}`}>
                      <Icon size={48} className={Config?.color || 'text-gray-600'} />
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 mb-2 uppercase">{content.title}</h2>
                  <p className="text-gray-600 font-medium">{content.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setMode('learn')}
                    className="p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all text-left flex flex-col group items-center text-center"
                  >
                      <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <GraduationCap size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Học Lý Thuyết</h3>
                      <p className="text-gray-500 mt-2 text-sm font-medium">Tìm hiểu kiến thức qua văn bản, hình ảnh minh họa và video.</p>
                  </button>

                  <button 
                    onClick={onStartQuiz}
                    className="p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:shadow-xl transition-all text-left flex flex-col group items-center text-center"
                  >
                      <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Play size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Làm Bài Tập</h3>
                      <p className="text-gray-500 mt-2 text-sm font-medium">Kiểm tra kiến thức đã học qua các câu hỏi trắc nghiệm.</p>
                  </button>
              </div>
          </div>
      );
  }

  // 2. Learning Mode
  return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <button onClick={() => setMode('menu')} className="text-sm font-bold text-gray-600 hover:text-black flex items-center gap-2">
                 <ArrowRight className="rotate-180" size={18} /> Menu Bài Học
              </button>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold uppercase tracking-wider text-sm ${Config?.bg || 'bg-gray-100'} ${Config?.color?.replace('text-', 'text-') || 'text-gray-700'}`}>
                 <Icon size={16} /> {topic}
              </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 space-y-8">
              <div className="border-b pb-6">
                  <h1 className="text-3xl font-black text-gray-900 mb-2">{content.title}</h1>
                  <p className="text-lg text-gray-500">{content.subtitle}</p>
              </div>

              {content.sections.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                          {section.heading}
                      </h3>
                      
                      <div className="prose max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                          {section.content}
                      </div>

                      {section.image && (
                          <div className="my-4 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                              <img src={section.image} alt={section.heading} className="w-full h-auto object-cover max-h-[400px]" />
                          </div>
                      )}

                      {section.video && (
                          <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg my-4">
                              <iframe 
                                width="100%" 
                                height="100%" 
                                src={section.video} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                              ></iframe>
                          </div>
                      )}
                  </div>
              ))}

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-start gap-4 mt-8">
                  <Info className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                      <h4 className="font-bold text-blue-800 mb-1">Ghi nhớ</h4>
                      <p className="text-blue-700 text-sm">
                          Hãy đọc kỹ nội dung trên trước khi bắt đầu làm bài kiểm tra. Bạn cần đạt trên 50% số điểm để hoàn thành bài học này.
                      </p>
                  </div>
              </div>
          </div>

          <div className="flex justify-end">
              <button 
                onClick={onStartQuiz}
                className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-primary-700 transition flex items-center gap-2"
              >
                  Bắt đầu làm bài tập <ArrowRight size={20} />
              </button>
          </div>
      </div>
  );
};

export default GeneralSkillLesson;
