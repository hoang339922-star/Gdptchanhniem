
import { DoanSinh, Doan, AttendanceRecord, FinancialTransaction, Event, Course, InventoryItem, Achievement, CheckInRecord, QuizQuestion } from '../types';

export const MOCK_DOAN_SINH: DoanSinh[] = [
  { id: '1', full_name: 'Trần Văn An', phap_danh: 'Minh Tánh', birth_date: '2012-05-12', gender: 'Nam', doan: Doan.OANH_VU_NAM, bac_hoc: 'Mở Mắt', join_date: '2020-01-01', status: 'active', parent_name: 'Trần Văn Ba', parent_phone: '0909123456', avatar_url: 'https://picsum.photos/200?1' },
  { id: '2', full_name: 'Lê Thị Bích', phap_danh: 'Diệu Hoa', birth_date: '2010-08-20', gender: 'Nữ', doan: Doan.OANH_VU_NU, bac_hoc: 'Cánh Mềm', join_date: '2019-06-15', status: 'active', parent_name: 'Lê Văn Bốn', parent_phone: '0918123456', avatar_url: 'https://picsum.photos/200?2' },
  { id: '3', full_name: 'Nguyễn Quốc Cường', phap_danh: 'Quảng Đức', birth_date: '2008-02-10', gender: 'Nam', doan: Doan.THIEU_NAM, bac_hoc: 'Hướng Thiện', join_date: '2018-09-01', status: 'active', parent_name: 'Nguyễn Văn Năm', parent_phone: '0939123456', avatar_url: 'https://picsum.photos/200?3' },
  { id: '4', full_name: 'Phạm Thị Dung', phap_danh: 'Tâm An', birth_date: '2007-11-25', gender: 'Nữ', doan: Doan.THIEU_NU, bac_hoc: 'Sơ Thiện', join_date: '2017-05-20', status: 'active', parent_name: 'Phạm Văn Sáu', parent_phone: '0987123456', avatar_url: 'https://picsum.photos/200?4' },
  { id: '5', full_name: 'Hoàng Văn Em', phap_danh: 'Thiện Chí', birth_date: '2005-01-30', gender: 'Nam', doan: Doan.NAM_PHAT_TU, bac_hoc: 'Bậc Kiên', join_date: '2015-03-10', status: 'active', parent_name: 'Hoàng Văn Bảy', parent_phone: '0977123456', avatar_url: 'https://picsum.photos/200?5' },
  { id: '6', full_name: 'Vũ Thị Gấm', phap_danh: 'Ngọc Hạnh', birth_date: '2013-09-15', gender: 'Nữ', doan: Doan.OANH_VU_NU, bac_hoc: 'Mở Mắt', join_date: '2021-02-01', status: 'active', parent_name: 'Vũ Văn Tám', parent_phone: '0966123456', avatar_url: 'https://picsum.photos/200?6' },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: '1', date: '2023-10-01', doan_sinh_id: '1', doan_sinh_name: 'Trần Văn An', doan: Doan.OANH_VU_NAM, status: 'present' },
  { id: '2', date: '2023-10-01', doan_sinh_id: '2', doan_sinh_name: 'Lê Thị Bích', doan: Doan.OANH_VU_NU, status: 'present' },
  { id: '3', date: '2023-10-01', doan_sinh_id: '3', doan_sinh_name: 'Nguyễn Quốc Cường', doan: Doan.THIEU_NAM, status: 'late', notes: 'Xe hư' },
  { id: '4', date: '2023-10-01', doan_sinh_id: '4', doan_sinh_name: 'Phạm Thị Dung', doan: Doan.THIEU_NU, status: 'absent', notes: 'Bệnh' },
  { id: '5', date: '2023-10-08', doan_sinh_id: '1', doan_sinh_name: 'Trần Văn An', doan: Doan.OANH_VU_NAM, status: 'present' },
  { id: '6', date: '2023-10-08', doan_sinh_id: '2', doan_sinh_name: 'Lê Thị Bích', doan: Doan.OANH_VU_NU, status: 'excused', notes: 'Về quê' },
];

export const MOCK_TRANSACTIONS: FinancialTransaction[] = [
  { id: '1', date: '2023-10-05', amount: 5000000, type: 'income', scope: 'general', category: 'Đóng góp', description: 'Phật tử T.T.T ủng hộ quỹ trại', performer: 'Tâm Minh', status: 'approved' },
  { id: '2', date: '2023-10-10', amount: 1200000, type: 'expense', scope: 'doan', target_doan: Doan.OANH_VU_NAM, category: 'Hoạt động', description: 'Mua vật dụng sinh hoạt Oanh Vũ Nam', performer: 'Thiện Dũng', status: 'approved' },
  { id: '3', date: '2023-10-15', amount: 200000, type: 'income', scope: 'general', category: 'Đoàn quán', description: 'Thu tiền nước tháng 10', performer: 'Quảng Đức', status: 'approved' },
  { id: '4', date: '2023-10-20', amount: 4500000, type: 'expense', scope: 'general', category: 'Trại', description: 'Đặt cọc xe đi trại toàn đơn vị', performer: 'Tâm Minh', status: 'pending' },
  { id: '5', date: '2023-10-25', amount: 500000, type: 'expense', scope: 'doan', target_doan: Doan.THIEU_NU, category: 'Văn phòng phẩm', description: 'In tài liệu tu học Thiếu Nữ', performer: 'Diệu Thảo', status: 'approved' },
];

export const MOCK_EVENTS: Event[] = [
  { id: '1', title: 'Trại Dũng 2023', date: '2023-11-15', location: 'Suối Tiên', type: 'Trại', participants_count: 150, status: 'upcoming', description: 'Trại truyền thống ngành Nam' },
  { id: '2', title: 'Lễ Chu Niên', date: '2023-12-20', location: 'Chùa Chánh Niệm', type: 'Lễ', participants_count: 300, status: 'upcoming', description: 'Kỷ niệm 30 năm thành lập GĐPT' },
  { id: '3', title: 'Họp Huynh Trưởng Tháng 11', date: '2023-11-05', location: 'Văn phòng GĐPT', type: 'Họp', participants_count: 20, status: 'completed', description: 'Họp định kỳ hàng tháng' },
];

// Helper to create generic content for missing lessons
const genericLessonContent = (title: string) => `
<h2 class="text-xl font-bold mb-4 text-primary-700">${title}</h2>
<p class="mb-4">Nội dung bài học đang được cập nhật. Vui lòng tham khảo tài liệu của Huynh trưởng.</p>
<div class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 mt-4">
  <strong>Ghi chú:</strong> Đây là bài học mẫu để minh họa tính năng.
</div>
`;

// Helper để tạo nhanh câu hỏi trắc nghiệm
const generateQuiz = (topic: string, count: number): QuizQuestion[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `q_${topic.replace(/\s/g, '')}_${i}`,
        question: `Câu hỏi số ${i + 1}: Nội dung chính của bài ${topic} là gì?`,
        options: [
            `Đáp án A: Kiến thức cơ bản về ${topic}.`,
            `Đáp án B: Ứng dụng thực tế của ${topic} (Đúng).`,
            `Đáp án C: Lịch sử hình thành ${topic}.`,
            `Đáp án D: Ý nghĩa mở rộng của ${topic}.`
        ],
        correct_answer: 1, // Luôn chọn B làm đáp án đúng cho mock data
        explanation: `Giải thích: Đáp án B đúng vì nó phản ánh trọng tâm thực hành của bài học về ${topic}.`
    }));
};

export const MOCK_COURSES: Course[] = [
  // --- NGÀNH ĐỒNG ---
  { 
    id: 'c_mo_mat', title: 'Bậc Mở Mắt', bac_hoc: 'Mở Mắt', thumbnail_url: 'https://picsum.photos/300/200?random=1',
    lessons: [
      { id: 'l1_mm', title: 'Bài 1: Em đi chùa', type: 'text', content: 'Hướng dẫn các em cách đi đứng, chào hỏi khi đến chùa.', duration: 15, is_completed: false, quiz: generateQuiz('Em đi chùa', 20) },
      { id: 'l2_mm', title: 'Bài 2: Em chào Huynh trưởng', type: 'text', content: genericLessonContent('Cách chào kính trong GĐPT'), duration: 15, is_completed: false, quiz: generateQuiz('Chào kính', 20) },
      { id: 'l3_mm', title: 'Bài 3: Em niệm Phật', type: 'text', content: genericLessonContent('Ý nghĩa câu Nam Mô A Di Đà Phật'), duration: 20, is_completed: false, quiz: generateQuiz('Niệm Phật', 20) }
    ]
  },
  { 
    id: 'c_canh_mem', title: 'Bậc Cánh Mềm', bac_hoc: 'Cánh Mềm', thumbnail_url: 'https://picsum.photos/300/200?random=2', 
    lessons: [
        { id: 'l1_cm', title: 'Bài 1: Sự tích Đức Phật Thích Ca (Sơ lược)', type: 'text', content: genericLessonContent('Đản sinh, Xuất gia, Thành đạo'), duration: 30, is_completed: false, quiz: generateQuiz('Sự tích Phật', 20) },
        { id: 'l2_cm', title: 'Bài 2: Ý nghĩa huy hiệu Hoa Sen', type: 'text', content: genericLessonContent('Màu sắc và hình dáng'), duration: 25, is_completed: false, quiz: generateQuiz('Hoa Sen', 20) }
    ] 
  },
  { 
    id: 'c_chan_cung', title: 'Bậc Chân Cứng', bac_hoc: 'Chân Cứng', thumbnail_url: 'https://picsum.photos/300/200?random=3', 
    lessons: [
        { id: 'l1_cc', title: 'Bài 1: Năm điều luật của Oanh Vũ', type: 'text', content: genericLessonContent('Học thuộc và giải thích 5 điều luật'), duration: 30, is_completed: false, quiz: generateQuiz('Luật Oanh Vũ', 20) }
    ] 
  },
  { 
    id: 'c_tung_bay', title: 'Bậc Tung Bay', bac_hoc: 'Tung Bay', thumbnail_url: 'https://picsum.photos/300/200?random=4', 
    lessons: [
        { id: 'l1_tb', title: 'Bài 1: Lục hòa', type: 'text', content: genericLessonContent('Sáu phép hòa kính'), duration: 40, is_completed: false, quiz: generateQuiz('Lục Hòa', 20) }
    ] 
  },

  // --- NGÀNH THIẾU ---
  { 
    id: 'c_huong_thien', 
    title: 'Bậc Hướng Thiện - Ngành Thiếu', 
    bac_hoc: 'Hướng Thiện', 
    thumbnail_url: 'https://picsum.photos/300/200?random=5', 
    lessons: [
      {
        id: 'ht_01',
        title: 'Bài 1: Tam Quy (Ba Phép Quy Y)',
        type: 'text',
        duration: 45,
        content: `
          <h1 class="text-2xl font-bold mb-4 text-blue-800">Tam Quy - Nền Tảng Của Người Phật Tử</h1>
          
          <h3 class="text-xl font-semibold mb-2 text-gray-800">1. Định nghĩa Quy Y</h3>
          <p class="mb-4"><strong>Quy</strong> là quay về. <strong>Y</strong> là nương tựa. Quy y Tam Bảo là quay về nương tựa vào ba ngôi báu: <strong>Phật, Pháp, Tăng</strong>.</p>
          
          <h3 class="text-xl font-semibold mb-2 text-gray-800">2. Tại sao phải Quy Y?</h3>
          <p class="mb-4">Giống như người đi trong đêm tối cần ngọn đuốc, người qua biển khổ cần thuyền bè. Chúng ta quy y Tam Bảo để được soi sáng, dẫn đường thoát khỏi khổ đau, phiền não, và tìm về bến giác.</p>

          <h3 class="text-xl font-semibold mb-2 text-gray-800">3. Ba Ngôi Báu (Tam Bảo)</h3>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Phật (Buddha):</strong> Đấng giác ngộ hoàn toàn, là người Thầy dẫn đường.</li>
            <li><strong>Pháp (Dharma):</strong> Những lời dạy vàng ngọc của Đức Phật, là phương thuốc chữa bệnh khổ đau.</li>
            <li><strong>Tăng (Sangha):</strong> Đoàn thể những người tu hành thanh tịnh, là người bạn đồng hành tin cậy.</li>
          </ul>

          <h3 class="text-xl font-semibold mb-2 text-gray-800">4. Lợi ích của Quy Y</h3>
          <p class="mb-4">Người đã quy y Tam Bảo sẽ gieo trồng hạt giống giải thoát và không đọa vào ba đường ác (Địa ngục, Ngạ quỷ, Súc sanh) nếu hết lòng tin kính và giữ gìn giới pháp.</p>
          
          <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600 italic">
            "Về nương Phật, người đưa đường chỉ lối cho con trong cuộc đời.<br/>
            Về nương Pháp, con đường của tình thương và sự hiểu biết.<br/>
            Về nương Tăng, đoàn thể của những người nguyện sống cuộc đời tỉnh thức."
          </div>
        `,
        is_completed: false,
        quiz: [
          {
            id: 'q_ht_01_1',
            question: 'Tam Bảo gồm những gì?',
            options: ['Phật, Pháp, Tăng', 'Cha, Mẹ, Thầy', 'Trời, Đất, Người', 'Giới, Định, Tuệ'],
            correct_answer: 0,
            explanation: 'Tam Bảo là ba ngôi báu: Phật (Người dẫn đường), Pháp (Lời dạy), Tăng (Đoàn thể tu tập).'
          },
          {
            id: 'q_ht_01_2',
            question: 'Nghĩa của từ "Quy Y" là gì?',
            options: ['Đi chùa lễ Phật', 'Quay về và nương tựa', 'Học thuộc kinh điển', 'Làm việc thiện'],
            correct_answer: 1,
            explanation: 'Quy là quay về, Y là nương tựa.'
          },
          {
            id: 'q_ht_01_3',
            question: 'Quy y Pháp giúp ta tránh đọa vào đường nào?',
            options: ['Địa ngục', 'Ngạ quỷ (Quỷ đói)', 'Súc sanh', 'A-tu-la'],
            correct_answer: 1,
            explanation: 'Quy y Phật bất đọa địa ngục, Quy y Pháp bất đọa ngạ quỷ, Quy y Tăng bất đọa súc sanh.'
          },
          ...generateQuiz('Tam Quy', 17)
        ]
      },
      {
        id: 'ht_02',
        title: 'Bài 2: Ngũ Giới (Năm Giới Cấm)',
        type: 'text',
        duration: 40,
        content: `
          <h1 class="text-2xl font-bold mb-4 text-green-800">Ngũ Giới - Năm Nguyên Tắc Đạo Đức</h1>
          <p class="mb-4">Giới là hàng rào ngăn cản những điều xấu ác, bảo vệ thân tâm thanh tịnh.</p>
          <div class="space-y-4">
            <div class="flex items-start gap-3"><div class="bg-green-100 text-green-800 font-bold px-3 py-1 rounded">1</div><div><strong>Không sát sanh:</strong> Tôn trọng sự sống.</div></div>
            <div class="flex items-start gap-3"><div class="bg-green-100 text-green-800 font-bold px-3 py-1 rounded">2</div><div><strong>Không trộm cắp:</strong> Tôn trọng tài sản.</div></div>
            <div class="flex items-start gap-3"><div class="bg-green-100 text-green-800 font-bold px-3 py-1 rounded">3</div><div><strong>Không tà dâm:</strong> Tôn trọng hạnh phúc gia đình.</div></div>
            <div class="flex items-start gap-3"><div class="bg-green-100 text-green-800 font-bold px-3 py-1 rounded">4</div><div><strong>Không nói dối:</strong> Tôn trọng sự thật.</div></div>
            <div class="flex items-start gap-3"><div class="bg-green-100 text-green-800 font-bold px-3 py-1 rounded">5</div><div><strong>Không uống rượu:</strong> Bảo vệ trí tuệ.</div></div>
          </div>
        `,
        is_completed: false,
        quiz: [
           {
            id: 'q_ht_02_1',
            question: 'Mục đích chính của việc giữ giới là gì?',
            options: ['Để được khen', 'Để ngăn ngừa điều ác, phát triển điều thiện', 'Để không bị phạt', 'Để lấy thành tích'],
            correct_answer: 1,
            explanation: 'Giới luật giúp ngăn ngừa điều ác, giúp thân tâm an lạc.'
           },
           {
            id: 'q_ht_02_2',
            question: 'Giới thứ nhất khuyên chúng ta điều gì?',
            options: ['Không nói dối', 'Không trộm cắp', 'Không sát sanh', 'Không uống rượu'],
            correct_answer: 2,
            explanation: 'Giới thứ nhất là Không sát sanh, tôn trọng sự sống.'
           },
           ...generateQuiz('Ngũ Giới', 18)
        ]
      },
      {
        id: 'ht_03',
        title: 'Bài 3: Ý Nghĩa Huy Hiệu Hoa Sen',
        type: 'text',
        duration: 30,
        content: genericLessonContent('Huy Hiệu Hoa Sen - Biểu Tượng GĐPT'),
        is_completed: false,
        quiz: [
            {
                id: 'q_ht_03_1',
                question: 'Màu nền của huy hiệu Hoa Sen là màu gì?',
                options: ['Xanh dương', 'Xanh lá mạ', 'Vàng', 'Trắng'],
                correct_answer: 1,
                explanation: 'Nền xanh lá mạ tượng trưng cho màu của tuổi trẻ và hy vọng.'
            },
            ...generateQuiz('Huy Hiệu Hoa Sen', 19)
        ]
      }
    ]
  },
  { 
    id: 'c_so_thien', title: 'Bậc Sơ Thiện', bac_hoc: 'Sơ Thiện', thumbnail_url: 'https://picsum.photos/300/200?random=6', 
    lessons: [
        { id: 'l1_st', title: 'Bài 1: Lịch sử Đức Phật Thích Ca (Giai đoạn Đản sanh)', type: 'text', content: genericLessonContent('Chi tiết về sự kiện Đản sanh'), duration: 40, is_completed: false, quiz: generateQuiz('Phật Đản Sanh', 20) }
    ] 
  },
  { 
    id: 'c_trung_thien', title: 'Bậc Trung Thiện', bac_hoc: 'Trung Thiện', thumbnail_url: 'https://picsum.photos/300/200?random=7', 
    lessons: [
        { id: 'l1_tt', title: 'Bài 1: Lịch sử GĐPT Việt Nam', type: 'text', content: genericLessonContent('Các mốc lịch sử quan trọng'), duration: 45, is_completed: false, quiz: generateQuiz('Lịch sử GĐPT', 20) }
    ] 
  },
  { 
    id: 'c_chanh_thien', title: 'Bậc Chánh Thiện', bac_hoc: 'Chánh Thiện', thumbnail_url: 'https://picsum.photos/300/200?random=8', 
    lessons: [
        { id: 'l1_ct', title: 'Bài 1: Kinh Bát Nhã', type: 'text', content: genericLessonContent('Tìm hiểu ý nghĩa Tâm Kinh'), duration: 60, is_completed: false, quiz: generateQuiz('Bát Nhã Tâm Kinh', 20) }
    ] 
  },

  // --- HUYNH TRƯỞNG ---
  { 
    id: 'c_kien', title: 'Bậc Kiên', bac_hoc: 'Bậc Kiên', thumbnail_url: 'https://picsum.photos/300/200?random=9', 
    lessons: [
        { id: 'l1_bk', title: 'Bài 1: Vai trò Huynh Trưởng', type: 'text', content: genericLessonContent('Sứ mệnh và trách nhiệm'), duration: 60, is_completed: false, quiz: generateQuiz('Vai trò Huynh trưởng', 20) }
    ] 
  },
  { 
    id: 'c_tri', title: 'Bậc Trì', bac_hoc: 'Bậc Trì', thumbnail_url: 'https://picsum.photos/300/200?random=10', 
    lessons: [
        { id: 'l1_bt', title: 'Bài 1: Phương pháp hàng đội tự trị', type: 'text', content: genericLessonContent('Tổ chức và điều hành đội chúng'), duration: 60, is_completed: false, quiz: generateQuiz('Hàng đội tự trị', 20) }
    ] 
  },
  { 
    id: 'c_dinh', title: 'Bậc Định', bac_hoc: 'Bậc Định', thumbnail_url: 'https://picsum.photos/300/200?random=11', 
    lessons: [
        { id: 'l1_bd', title: 'Bài 1: Quản trị hành chánh GĐPT', type: 'text', content: genericLessonContent('Sổ sách và báo cáo'), duration: 60, is_completed: false, quiz: generateQuiz('Hành chánh', 20) }
    ] 
  },
  { 
    id: 'c_luc', title: 'Bậc Lực', bac_hoc: 'Bậc Lực', thumbnail_url: 'https://picsum.photos/300/200?random=12', 
    lessons: [
        { id: 'l1_bl', title: 'Bài 1: Nghiên cứu Phật pháp chuyên sâu', type: 'text', content: genericLessonContent('Giáo lý nâng cao'), duration: 90, is_completed: false, quiz: generateQuiz('Phật pháp nâng cao', 20) }
    ] 
  },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Lều chữ A (Lớn)', category: 'Trại', quantity: 5, status: 'good', last_check: '2023-09-01', image_url: 'https://picsum.photos/100/100?random=5' },
  { id: '2', name: 'Dây dù 10m', category: 'Kỹ năng', quantity: 20, status: 'good', last_check: '2023-10-01', image_url: 'https://picsum.photos/100/100?random=6' },
  { id: '3', name: 'Cờ GĐPT', category: 'Nghi thức', quantity: 2, status: 'damaged', last_check: '2023-10-15', image_url: 'https://picsum.photos/100/100?random=7' },
  { id: '4', name: 'Nồi quân dụng', category: 'Hậu cần', quantity: 3, status: 'good', last_check: '2023-08-20', image_url: 'https://picsum.photos/100/100?random=8' },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: '1', doan_sinh_id: '1', doan_sinh_name: 'Trần Văn An', type: 'bonus', category: 'Hoạt động', points: 10, reason: 'Giúp đỡ bạn trong giờ sinh hoạt', date: '2023-10-22', is_verified: true, verified_at: '2023-10-22T19:00:00' },
  { id: '2', doan_sinh_id: '3', doan_sinh_name: 'Nguyễn Quốc Cường', type: 'penalty', category: 'Kỷ luật', points: -5, reason: 'Nói chuyện riêng trong giờ lễ', date: '2023-10-22', event_id: '2', event_title: 'Lễ Chu Niên', is_verified: false },
  { id: '3', doan_sinh_id: '2', doan_sinh_name: 'Lê Thị Bích', type: 'bonus', category: 'Chuyên cần', points: 5, reason: 'Đi học đúng giờ 4 tuần liên tiếp', date: '2023-10-20', is_verified: true },
];

export const MOCK_CHECKIN_LOGS: CheckInRecord[] = [
  { id: '1', doan_sinh_id: '1', doan_sinh_name: 'Trần Văn An', timestamp: '2023-10-22T07:45:00', type: 'in', method: 'qr', location: 'Cổng Chính', synced: true },
  { id: '2', doan_sinh_id: '2', doan_sinh_name: 'Lê Thị Bích', timestamp: '2023-10-22T07:50:00', type: 'in', method: 'qr', location: 'Cổng Chính', synced: true },
];

export const MOCK_QUIZZES: QuizQuestion[] = [
    // Morse
    { id: 'q_morse_1', topic: 'Morse', question: 'Tín hiệu SOS trong Morse là gì?', options: ['...---...', '---...---', '..-..-..', '--.--.--'], correct_answer: 0, explanation: 'SOS gồm 3 tích (S), 3 tè (O), 3 tích (S).' },
    { id: 'q_morse_2', topic: 'Morse', question: 'Ký tự "A" trong Morse được mã hóa như thế nào?', options: ['.-', '-.', '..', '--'], correct_answer: 0, explanation: 'A là .-' },
    { id: 'q_morse_3', topic: 'Morse', question: 'Tỷ lệ giữa độ dài của một "Tè" (Dash) so với một "Tích" (Dot) là bao nhiêu?', options: ['1:1', '2:1', '3:1', '4:1'], correct_answer: 2, explanation: '1 Tè bằng 3 Tích.' },
    { id: 'q_morse_4', topic: 'Morse', question: 'Khoảng cách giữa các chữ cái trong một từ bằng bao nhiêu đơn vị?', options: ['1 tích', '3 tích', '5 tích', '7 tích'], correct_answer: 1, explanation: 'Khoảng cách giữa các chữ cái là 3 tích (bằng 1 tè).' },
    { id: 'q_morse_5', topic: 'Morse', question: 'Ký tự nào chỉ gồm toàn dấu "Tè"?', options: ['S', 'O', 'M', 'H'], correct_answer: 1, explanation: 'O là --- (3 tè).' },

    // Semaphore
    { id: 'q_sem_1', topic: 'Semaphore', question: 'Chữ A trong Semaphore được đánh như thế nào (so với người nhìn)?', options: ['Tay trái ngang, tay phải xuống', 'Tay trái 45 độ dưới, tay phải 45 độ dưới', 'Tay trái thấp, tay phải cao', 'Chân phải bước ra'], correct_answer: 1, explanation: 'Chữ A (góc 7h30) tay trái và tay phải đều ở vị trí thấp.' },
    { id: 'q_sem_2', topic: 'Semaphore', question: 'Khi muốn báo hiệu "Hết bản tin", ta dùng dấu hiệu gì?', options: ['AR', 'K', 'VA', 'J'], correct_answer: 0, explanation: 'AR là dấu hiệu kết thúc bản tin.' },
    { id: 'q_sem_3', topic: 'Semaphore', question: 'Tư thế nghỉ (Rest) trong Semaphore là gì?', options: ['Hai tay chéo trước ngực', 'Hai tay buông xuôi', 'Hai tay dang ngang', 'Hai tay giơ cao'], correct_answer: 0, explanation: 'Hai tay chéo trước ngực (cờ chéo nhau).' },
    { id: 'q_sem_4', topic: 'Semaphore', question: 'Chữ U trong Semaphore có hình dáng giống chữ cái gì?', options: ['U', 'Y', 'L', 'N'], correct_answer: 0, explanation: 'Chữ U hai tay tạo thành hình chữ U (10h10).' },
    { id: 'q_sem_5', topic: 'Semaphore', question: 'Để xóa chữ vừa đánh sai, ta đánh chữ gì?', options: ['E (8 lần)', 'A (3 lần)', 'I (2 lần)', 'H (5 lần)'], correct_answer: 0, explanation: 'Đánh chữ E liên tục 8 lần để báo xóa.' },

    // Nút Dây
    { id: 'q_knot_1', topic: 'NutDay', question: 'Nút dây dùng để nối hai đầu dây có tiết diện không bằng nhau là nút gì?', options: ['Nút Dẹt', 'Nút Thợ Dệt', 'Nút Thuyền Chài', 'Nút Ghế Đơn'], correct_answer: 1, explanation: 'Nút Thợ Dệt dùng để nối dây to với dây nhỏ.' },
    { id: 'q_knot_2', topic: 'NutDay', question: 'Nút nào dùng để cấp cứu, kéo người từ dưới giếng lên mà không thắt vào bụng?', options: ['Nút Thòng Lòng', 'Nút Ghế Đơn', 'Nút Chịu Đơn', 'Nút Kéo Gỗ'], correct_answer: 1, explanation: 'Nút Ghế Đơn tạo vòng tròn cố định, không bị xiết lại.' },
    { id: 'q_knot_3', topic: 'NutDay', question: 'Nút Dẹt (Reef Knot) thường được dùng để làm gì?', options: ['Neo thuyền', 'Nối chỉ dệt', 'Kết thúc băng cứu thương', 'Kéo gỗ'], correct_answer: 2, explanation: 'Nút Dẹt dùng để nối 2 dây cùng kích thước, mặt nút phẳng nên dùng trong băng bó.' },
    { id: 'q_knot_4', topic: 'NutDay', question: 'Khởi đầu cho hầu hết các nút ráp cây (tháp canh, cổng trại) là nút gì?', options: ['Nút Thuyền Chài', 'Nút Số 8', 'Nút Dẹt', 'Nút Thòng Lòng'], correct_answer: 0, explanation: 'Nút Thuyền Chài dùng để buộc dây vào cọc, khởi đầu nút ráp.' },
    { id: 'q_knot_5', topic: 'NutDay', question: 'Nút Số 8 dùng để làm gì?', options: ['Nối dây', 'Buộc cọc', 'Chặn đầu dây không cho tuột', 'Trang trí'], correct_answer: 2, explanation: 'Nút Số 8 dùng để chặn đầu dây không cho tuột qua ròng rọc.' },

    // Mật Thư
    { id: 'q_cipher_1', topic: 'MatThu', question: 'Trong mật thư thay thế, A=1, B=2,... Z=26. Chữ "GDPT" sẽ là?', options: ['7-4-16-20', '6-3-15-19', '8-5-17-21', '1-2-3-4'], correct_answer: 0, explanation: 'G=7, D=4, P=16, T=20.' },
    { id: 'q_cipher_2', topic: 'MatThu', question: 'Khóa của mật thư Caesar là gì?', options: ['Một từ khóa', 'Độ dời (Shift) của bảng chữ cái', 'Bảng thay thế số', 'Hình vẽ chuồng bò'], correct_answer: 1, explanation: 'Caesar là mật mã dời chỗ, khóa K là số vị trí dời đi.' },
    { id: 'q_cipher_3', topic: 'MatThu', question: 'Mật thư Chuồng Bò (Pigpen) sử dụng các ký hiệu gì?', options: ['Số La Mã', 'Các khung hình học có chấm/không chấm', 'Mã Morse', 'Cờ Semaphore'], correct_answer: 1, explanation: 'Pigpen dùng khung hình học để thay thế chữ cái.' },
    { id: 'q_cipher_4', topic: 'MatThu', question: 'Nếu khóa là "Em anh đi trốn" (M=H), đây là dạng mật thư gì?', options: ['Hóa học', 'Thay thế', 'Ẩn giấu', 'Tọa độ'], correct_answer: 1, explanation: 'M=H nghĩa là chữ M thay bằng chữ H (thay thế/dời chỗ).' },
    { id: 'q_cipher_5', topic: 'MatThu', question: 'Loại mực nào hiện lên khi hơ lửa?', options: ['Nước chanh/Nước gạo', 'Mực bút bi', 'Mực tàu', 'Sơn dầu'], correct_answer: 0, explanation: 'Nước chanh, nước cơm là mực tàng hình, hiện lên khi có nhiệt độ.' },

    // Cứu Thương
    { id: 'q_fa_1', topic: 'CuuThuong', question: 'Nguyên tắc R.I.C.E dùng để sơ cứu chấn thương nào?', options: ['Gãy xương', 'Bong gân', 'Chảy máu', 'Ngất xỉu'], correct_answer: 1, explanation: 'Rest, Ice, Compression, Elevation dùng cho bong gân.' },
    { id: 'q_fa_2', topic: 'CuuThuong', question: 'Khi sơ cứu người bị bỏng, việc đầu tiên cần làm là gì?', options: ['Bôi kem đánh răng', 'Ngâm nước mát 15-20p', 'Bôi mỡ trăn', 'Chọc vỡ nốt phồng'], correct_answer: 1, explanation: 'Làm mát vết bỏng bằng nước sạch là quan trọng nhất.' },
    { id: 'q_fa_3', topic: 'CuuThuong', question: 'Tỷ lệ ép tim và thổi ngạt trong CPR là bao nhiêu?', options: ['15:2', '30:2', '5:1', '10:1'], correct_answer: 1, explanation: 'Chu kỳ chuẩn là 30 lần ép tim, 2 lần thổi ngạt.' },
    { id: 'q_fa_4', topic: 'CuuThuong', question: 'Không nên làm gì khi bị chảy máu cam?', options: ['Bóp cánh mũi', 'Cúi đầu về trước', 'Ngửa đầu ra sau', 'Thở bằng miệng'], correct_answer: 2, explanation: 'Ngửa đầu ra sau làm máu chảy ngược vào họng gây sặc/nôn.' },
    { id: 'q_fa_5', topic: 'CuuThuong', question: 'Dấu hiệu nhận biết gãy xương là gì?', options: ['Đau, sưng, bầm tím', 'Biến dạng chi', 'Mất vận động', 'Tất cả các ý trên'], correct_answer: 3, explanation: 'Gãy xương có đủ các dấu hiệu trên.' },

    // Dấu Đi Đường
    { id: 'q_ts_1', topic: 'DauDiDuong', question: 'Dấu hiệu "Bắt đầu đi" thường được ký hiệu như thế nào?', options: ['Vòng tròn có chấm giữa', 'Mũi tên', 'Hình vuông', 'Dấu X'], correct_answer: 1, explanation: 'Mũi tên chỉ hướng khởi hành.' },
    { id: 'q_ts_2', topic: 'DauDiDuong', question: 'Ba viên đá chồng lên nhau có ý nghĩa gì?', options: ['Đi nhanh', 'Nguy hiểm', 'Có nước', 'Về nhà'], correct_answer: 1, explanation: '3 vật chồng lên nhau (đá) báo hiệu nguy hiểm.' },
    { id: 'q_ts_3', topic: 'DauDiDuong', question: 'Cỏ cột túm đầu nghiêng về bên phải nghĩa là gì?', options: ['Rẽ phải', 'Rẽ trái', 'Đi thẳng', 'Dừng lại'], correct_answer: 0, explanation: 'Ngọn cỏ nghiêng bên nào rẽ bên đó.' },
    { id: 'q_ts_4', topic: 'DauDiDuong', question: 'Dấu hiệu "Nước uống được" vẽ như thế nào?', options: ['Hình sóng nước trong khung', 'Hình đầu lâu', 'Hình ly nước gạch chéo', 'Hình tam giác'], correct_answer: 0, explanation: 'Sóng nước trong khung chữ nhật hoặc tròn.' },
    { id: 'q_ts_5', topic: 'DauDiDuong', question: 'Vòng tròn có một chấm ở giữa nghĩa là gì?', options: ['Đã về nhà / Kết thúc', 'Bắt đầu', 'Chờ đợi', 'Chia tay'], correct_answer: 0, explanation: 'Đây là dấu hiệu "Tôi đã về nhà" hoặc kết thúc trò chơi.' },

    // Phật Pháp
    { id: 'q_pp_1', topic: 'PhatPhap', question: 'Đức Phật Thích Ca đản sanh tại đâu?', options: ['Vườn Lâm Tỳ Ni', 'Cội Bồ Đề', 'Vườn Lộc Uyển', 'Rừng Sala'], correct_answer: 0, explanation: 'Ngài đản sanh tại vườn Lâm Tỳ Ni (Lumbini).' },
    { id: 'q_pp_2', topic: 'PhatPhap', question: 'Ý nghĩa của ngày Thành Đạo là gì?', options: ['Đức Phật ra đời', 'Đức Phật nhập Niết Bàn', 'Đức Phật chứng ngộ chân lý', 'Đức Phật xuất gia'], correct_answer: 2, explanation: 'Thành Đạo là ngày Đức Phật chứng ngộ giải thoát dưới cội Bồ Đề.' },
    { id: 'q_pp_3', topic: 'PhatPhap', question: 'Tam Bảo gồm những gì?', options: ['Phật, Pháp, Tăng', 'Bi, Trí, Dũng', 'Giới, Định, Tuệ', 'Cha, Mẹ, Thầy'], correct_answer: 0, explanation: 'Tam Bảo là Phật, Pháp, Tăng.' },
    { id: 'q_pp_4', topic: 'PhatPhap', question: 'Ngũ giới thứ nhất là gì?', options: ['Không trộm cắp', 'Không sát sanh', 'Không tà dâm', 'Không nói dối'], correct_answer: 1, explanation: 'Giới thứ nhất là Không sát sanh (tôn trọng sự sống).' },
    { id: 'q_pp_5', topic: 'PhatPhap', question: 'Tứ Diệu Đế là gì?', options: ['4 ngọn núi lớn', '4 vị vua trời', '4 sự thật chắc chắn', '4 quyển kinh'], correct_answer: 2, explanation: 'Tứ Diệu Đế là bốn chân lý (sự thật) cao quý mà Đức Phật chứng ngộ.' },

    // Kiến Thức GĐPT
    { id: 'q_gdpt_1', topic: 'KienThucGDPT', question: 'Châm ngôn của GĐPT là gì?', options: ['Bi - Trí - Dũng', 'Hòa - Tin - Vui', 'Tinh tấn', 'Phụng sự'], correct_answer: 0, explanation: 'Châm ngôn của GĐPT là Bi - Trí - Dũng.' },
    { id: 'q_gdpt_2', topic: 'KienThucGDPT', question: 'Huy hiệu Hoa Sen có mấy cánh?', options: ['3 cánh', '5 cánh', '8 cánh', '12 cánh'], correct_answer: 2, explanation: 'Huy hiệu Hoa Sen trắng có 8 cánh (5 cánh trên, 3 cánh dưới).' },
    { id: 'q_gdpt_3', topic: 'KienThucGDPT', question: 'Màu xanh lá mạ của nền huy hiệu tượng trưng cho điều gì?', options: ['Màu của hy vọng và tuổi trẻ', 'Màu của biển cả', 'Màu của đất', 'Màu của giải thoát'], correct_answer: 0, explanation: 'Màu xanh lá mạ là màu của tuổi trẻ đầy hy vọng hướng về tương lai.' },
    { id: 'q_gdpt_4', topic: 'KienThucGDPT', question: 'Khẩu hiệu của ngành Oanh Vũ là gì?', options: ['Tinh Tấn', 'Hòa', 'Ngoan', 'Hy Sinh'], correct_answer: 2, explanation: 'Khẩu hiệu Oanh Vũ là: Ngoan.' },
    { id: 'q_gdpt_5', topic: 'KienThucGDPT', question: 'Bài ca chính thức của GĐPT Việt Nam là bài gì?', options: ['Dây Thân Ái', 'Sen Trắng', 'Trầm Hương Đốt', 'Vui Ánh Đạo'], correct_answer: 1, explanation: 'Bài ca chính thức (Đoàn ca) là bài Sen Trắng.' },
];
