
import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, HeartPulse, ShieldPlus, Thermometer, Activity, 
  Search, Bone, Bug, Zap, Droplet, Wind, AlertTriangle, 
  Stethoscope, Eye, Footprints, Flame, Anchor, User
} from 'lucide-react';

interface FirstAidLessonProps {
  onBack: () => void;
  onStartQuiz: () => void;
}

const PROCEDURES = [
    // --- CẤP CỨU CƠ BẢN (BASIC LIFE SUPPORT) ---
    {
        id: 'cpr',
        title: '1. Hồi sức tim phổi (CPR)',
        category: 'Cấp cứu cơ bản',
        icon: Activity,
        steps: [
            'Kiểm tra hiện trường an toàn.',
            'Kiểm tra phản ứng: Vỗ vai, gọi lớn "Bạn có sao không?".',
            'Nếu không phản ứng: Gọi cấp cứu 115 hoặc nhờ người hỗ trợ.',
            'Kiểm tra hơi thở trong 5-10 giây (Nhìn lồng ngực, ghé tai nghe).',
            'Nếu ngưng thở: Đặt tay giữa ngực, ép tim sâu 5cm, tốc độ 100-120 lần/phút (30 lần).',
            'Hà hơi thổi ngạt 2 lần (bịt mũi, thổi vào miệng).',
            'Lặp lại chu kỳ 30 ép tim - 2 thổi ngạt liên tục.'
        ]
    },
    {
        id: 'heimlich',
        title: '2. Hóc dị vật (Heimlich)',
        category: 'Cấp cứu cơ bản',
        icon: Wind,
        steps: [
            'Hỏi nạn nhân: "Bạn bị hóc phải không?". Nếu họ không nói được, gật đầu -> Cần giúp ngay.',
            'Đứng sau lưng nạn nhân, vòng tay ôm eo.',
            'Nắm một tay thành nắm đấm, đặt trên rốn nạn nhân (dưới xương ức).',
            'Tay kia nắm lấy nắm đấm.',
            'Giật mạnh hướng vào trong và lên trên (hình chữ J).',
            'Lặp lại đến khi dị vật bật ra.'
        ]
    },
    {
        id: 'recovery_pos',
        title: '3. Tư thế nằm nghiêng an toàn',
        category: 'Cấp cứu cơ bản',
        icon: User,
        steps: [
            'Dùng cho nạn nhân bất tỉnh nhưng còn thở.',
            'Quỳ bên cạnh nạn nhân.',
            'Đặt tay phía gần bạn lên vuông góc.',
            'Kéo tay xa bạn áp mu bàn tay vào má phía gần bạn.',
            'Gấp chân xa bạn lên (chống đầu gối).',
            'Kéo đầu gối đó về phía bạn để lật nạn nhân nằm nghiêng.',
            'Ngửa nhẹ đầu để đường thở thông thoáng.'
        ]
    },
    {
        id: 'shock',
        title: '4. Sơ cứu Sốc (Choáng)',
        category: 'Cấp cứu cơ bản',
        icon: Activity,
        steps: [
            'Dấu hiệu: Da tái lạnh, vã mồ hôi, mạch nhanh, thở nhanh.',
            'Đặt nạn nhân nằm ngửa ở nơi thoáng mát.',
            'Kê cao chân khoảng 20-30cm (nếu không chấn thương đầu/cổ/chân).',
            'Nới lỏng quần áo.',
            'Ủ ấm nạn nhân.',
            'Không cho ăn uống gì.',
            'Gọi cấp cứu ngay.'
        ]
    },

    // --- CHẤN THƯƠNG PHẦN MỀM & XƯƠNG KHỚP ---
    {
        id: 'bleeding',
        title: '5. Cầm máu vết thương hở',
        category: 'Chấn thương',
        icon: Droplet,
        steps: [
            'Rửa tay sạch hoặc đeo găng tay.',
            'Dùng gạc/vải sạch ép trực tiếp lên vết thương.',
            'Giữ chặt 10-15 phút, không mở ra xem.',
            'Nếu máu thấm qua, đặt thêm lớp gạc mới chồng lên (KHÔNG gỡ lớp cũ).',
            'Băng bó cố định sau khi máu ngừng chảy.',
            'Kê cao phần bị thương cao hơn tim (nếu được).'
        ]
    },
    {
        id: 'nosebleed',
        title: '6. Chảy máu cam',
        category: 'Chấn thương',
        icon: Droplet,
        steps: [
            'Ngồi thẳng, hơi cúi đầu về phía trước (KHÔNG ngửa cổ ra sau).',
            'Dùng ngón cái và trỏ bóp chặt hai cánh mũi (phần mềm).',
            'Thở bằng miệng.',
            'Giữ yên trong 10-15 phút.',
            'Nếu vẫn chảy sau 20 phút -> Đến cơ sở y tế.'
        ]
    },
    {
        id: 'sprain',
        title: '7. Bong gân (R.I.C.E)',
        category: 'Chấn thương',
        icon: Footprints,
        steps: [
            'R (Rest): Nghỉ ngơi, hạn chế cử động.',
            'I (Ice): Chườm đá lạnh (bọc trong khăn) 20 phút mỗi lần.',
            'C (Compression): Băng ép nhẹ bằng băng thun.',
            'E (Elevation): Kê cao chi bị thương.',
            'Tuyệt đối KHÔNG xoa dầu nóng.'
        ]
    },
    {
        id: 'fracture',
        title: '8. Gãy xương',
        category: 'Chấn thương',
        icon: Bone,
        steps: [
            'Dấu hiệu: Đau dữ dội, biến dạng, sưng nề, mất vận động.',
            'KHÔNG nắn chỉnh ổ gãy.',
            'Cố định tạm thời bằng nẹp (gỗ, bìa cứng) trên và dưới ổ gãy 1 khớp.',
            'Nếu gãy hở (thấy xương): Băng kín vết thương trước khi nẹp.',
            'Chườm lạnh giảm đau sưng.',
            'Chuyển viện nhẹ nhàng.'
        ]
    },
    {
        id: 'dislocation',
        title: '9. Trật khớp',
        category: 'Chấn thương',
        icon: Bone,
        steps: [
            'Dấu hiệu: Khớp biến dạng, hõm khớp rỗng, không cử động được.',
            'Giữ nguyên tư thế sai lệch đó (KHÔNG cố nắn lại).',
            'Chèn gạc/vải mềm xung quanh khớp.',
            'Cố định khớp ở tư thế đó bằng nẹp hoặc băng treo.',
            'Chườm lạnh.',
            'Đến bệnh viện ngay.'
        ]
    },
    {
        id: 'head_injury',
        title: '10. Chấn thương đầu',
        category: 'Chấn thương',
        icon: AlertTriangle,
        steps: [
            'Nếu có vết thương hở: Băng nhẹ, không ấn mạnh.',
            'Nếu nạn nhân tỉnh: Theo dõi nôn ói, lơ mơ, đau đầu tăng dần.',
            'Nếu bất tỉnh: Coi như có chấn thương cổ -> Cố định cổ.',
            'Không di chuyển trừ khi hiện trường nguy hiểm.',
            'Gọi 115 ngay.'
        ]
    },
    {
        id: 'eye_injury',
        title: '11. Dị vật/Hóa chất vào mắt',
        category: 'Chấn thương',
        icon: Eye,
        steps: [
            'Hóa chất: Rửa mắt liên tục dưới vòi nước sạch 15-20 phút (mở to mắt).',
            'Dị vật (bụi): Chớp mắt trong nước sạch hoặc dùng tăm bông khều nhẹ (nếu thấy).',
            'Dị vật cắm sâu: KHÔNG rút ra. Úp ly nhựa bảo vệ mắt, băng mắt còn lại để tránh đảo mắt.',
            'Đến bệnh viện chuyên khoa.'
        ]
    },

    // --- TAI NẠN MÔI TRƯỜNG & ĐỘNG VẬT ---
    {
        id: 'burn',
        title: '12. Bỏng nhiệt',
        category: 'Môi trường',
        icon: Flame,
        steps: [
            'Cách ly khỏi nguồn nhiệt.',
            'Ngâm/Xả nước mát sạch lên vết bỏng 20 phút (không dùng nước đá trực tiếp).',
            'Tháo bỏ đồ trang sức/quần áo vùng bỏng (trừ khi dính chặt vào da).',
            'Che phủ bằng gạc vô trùng.',
            'KHÔNG bôi kem đánh răng, mỡ trăn, nước mắm.'
        ]
    },
    {
        id: 'drowning',
        title: '13. Đuối nước',
        category: 'Môi trường',
        icon: Droplet,
        steps: [
            'Nhanh chóng đưa nạn nhân lên bờ (an toàn cho người cứu).',
            'Kiểm tra thở ngay lập tức.',
            'Nếu ngưng thở: CPR ngay (Hà hơi thổi ngạt ưu tiên).',
            'KHÔNG dốc ngược nạn nhân để "xóc nước" (làm mất thời gian vàng).',
            'Ủ ấm sau khi nạn nhân tỉnh.',
            'Luôn đưa đi viện kiểm tra phổi sau đó.'
        ]
    },
    {
        id: 'heatstroke',
        title: '14. Say nắng (Sốc nhiệt)',
        category: 'Môi trường',
        icon: Thermometer,
        steps: [
            'Dấu hiệu: Da nóng đỏ, khô (không mồ hôi), thân nhiệt >40 độ, mê sảng.',
            'Đưa vào chỗ mát ngay.',
            'Làm mát tích cực: Chườm nước mát vào nách, bẹn, cổ. Phun nước, quạt.',
            'Cho uống nước từng ngụm nhỏ (nếu tỉnh).',
            'Đây là cấp cứu khẩn cấp -> Gọi 115.'
        ]
    },
    {
        id: 'snake',
        title: '15. Rắn cắn',
        category: 'Động vật',
        icon: Bug,
        steps: [
            'Trấn an nạn nhân, hạn chế vận động (vận động làm nọc lan nhanh).',
            'Để vết cắn thấp hơn tim.',
            'Rửa sạch vết thương bằng nước và xà phòng.',
            'Băng ép nhẹ bản rộng từ vết cắn lên phía trên (đối với nhóm rắn lục thì không băng ép).',
            'KHÔNG rạch, hút nọc, đắp lá.',
            'Chuyển đến bệnh viện nhanh nhất.'
        ]
    },
    {
        id: 'insect',
        title: '16. Ong đốt / Côn trùng cắn',
        category: 'Động vật',
        icon: Bug,
        steps: [
            'Lấy vòi chích ra (nếu có) bằng cách khều nhẹ (không bóp túi nọc).',
            'Rửa sạch bằng xà phòng.',
            'Chườm lạnh để giảm đau và sưng.',
            'Theo dõi dấu hiệu dị ứng (khó thở, sưng phù mặt) -> Đi viện ngay.'
        ]
    },
    {
        id: 'dog_bite',
        title: '17. Chó/Mèo cắn',
        category: 'Động vật',
        icon: AlertTriangle,
        steps: [
            'Rửa vết thương dưới vòi nước chảy 15 phút với xà phòng.',
            'Sát trùng bằng cồn 70 độ hoặc Iodine.',
            'Băng nhẹ vết thương.',
            'Đến trạm y tế tiêm phòng dại/uốn ván.',
            'Theo dõi con vật trong 10-15 ngày.'
        ]
    },
    {
        id: 'leech',
        title: '18. Sơ cứu vắt/đỉa cắn',
        category: 'Động vật',
        icon: Bug,
        steps: [
            'Không giật mạnh (sẽ làm răng vắt ở lại gây nhiễm trùng).',
            'Dùng ngón tay di nhẹ hoặc bôi muối/vôi/cồn vào miệng vắt để nó tự nhả.',
            'Rửa sạch vết thương.',
            'Băng chặt để cầm máu (vắt tiết chất chống đông máu nên sẽ chảy máu lâu).'
        ]
    },

    // --- BỆNH LÝ & TAI NẠN KHÁC ---
    {
        id: 'faint',
        title: '19. Ngất xỉu',
        category: 'Bệnh lý',
        icon: User,
        steps: [
            'Đặt nằm ngửa đầu thấp, kê chân cao.',
            'Nới lỏng quần áo.',
            'Giải tán đám đông để thoáng khí.',
            'Khi tỉnh: Không cho ngồi dậy ngay.',
            'Kiểm tra chấn thương do té ngã.'
        ]
    },
    {
        id: 'seizure',
        title: '20. Co giật (Động kinh)',
        category: 'Bệnh lý',
        icon: Activity,
        steps: [
            'Không cố giữ tay chân nạn nhân.',
            'Không nhét bất cứ vật gì vào miệng.',
            'Kê vật mềm dưới đầu để tránh va đập.',
            'Nới lỏng quần áo cổ.',
            'Chờ cơn co giật qua đi, đặt nằm nghiêng an toàn.',
            'Ghi nhận thời gian co giật.'
        ]
    },
    {
        id: 'food_poison',
        title: '21. Ngộ độc thực phẩm',
        category: 'Bệnh lý',
        icon: AlertTriangle,
        steps: [
            'Nếu buồn nôn: Cho nôn hết ra.',
            'Uống Oresol hoặc nước cháo muối để bù nước.',
            'Giữ mẫu thực phẩm hoặc chất nôn để xét nghiệm.',
            'Nếu đau bụng dữ dội, đi ngoài ra máu hoặc sốt cao -> Đi viện.'
        ]
    },
    {
        id: 'electric',
        title: '22. Điện giật',
        category: 'Tai nạn',
        icon: Zap,
        steps: [
            'Tuyệt đối KHÔNG chạm vào nạn nhân khi chưa ngắt điện.',
            'Ngắt cầu dao điện hoặc dùng vật cách điện (gỗ khô, nhựa) gạt dây điện ra.',
            'Kiểm tra hơi thở và tim mạch.',
            'Tiến hành CPR nếu ngừng tim.',
            'Sơ cứu vết bỏng điện (thường ở tay và chân).'
        ]
    },
    {
        id: 'hypothermia',
        title: '23. Hạ thân nhiệt',
        category: 'Môi trường',
        icon: Thermometer,
        steps: [
            'Đưa vào nơi kín gió, ấm áp.',
            'Thay quần áo khô.',
            'Ủ ấm bằng chăn, ôm ấp (da kề da).',
            'Cho uống nước ấm, ngọt (nếu tỉnh).',
            'Không chườm nóng trực tiếp quá nhanh.'
        ]
    },
    {
        id: 'asthma',
        title: '24. Cơn hen suyễn',
        category: 'Bệnh lý',
        icon: Wind,
        steps: [
            'Trấn an nạn nhân, cho ngồi nghỉ (hơi cúi người).',
            'Giúp nạn nhân dùng thuốc xịt cắt cơn (thường mang theo).',
            'Nới lỏng quần áo.',
            'Nếu không đỡ sau 2 lần xịt hoặc khó thở tăng -> Gọi cấp cứu.'
        ]
    },
    {
        id: 'cramp',
        title: '25. Chuột rút',
        category: 'Vận động',
        icon: Activity,
        steps: [
            'Ngưng vận động.',
            'Kéo duỗi cơ bị rút ngược lại chiều co (Ví dụ: Rút bắp chân -> Kéo ngược mũi chân về phía đầu gối).',
            'Giữ yên tư thế kéo duỗi đến khi hết đau.',
            'Xoa bóp nhẹ nhàng.',
            'Uống nước bù điện giải.'
        ]
    },
    {
        id: 'blister',
        title: '26. Phồng rộp chân (Đi bộ nhiều)',
        category: 'Vận động',
        icon: Footprints,
        steps: [
            'Nếu chưa vỡ: Đừng chọc vỡ. Dùng băng cá nhân dán đệm xung quanh.',
            'Nếu đã vỡ: Rửa sạch, sát trùng, bôi thuốc mỡ kháng sinh, băng lại.',
            'Giữ khô ráo, thay tất thường xuyên.'
        ]
    },

    // --- KỸ THUẬT DI CHUYỂN & BĂNG BÓ ---
    {
        id: 'transport_1',
        title: '27. Dìu nạn nhân (1 người)',
        category: 'Di chuyển',
        icon: User,
        steps: [
            'Dùng cho nạn nhân tỉnh, chấn thương chân nhẹ.',
            'Đứng bên lành của nạn nhân.',
            'Choàng tay nạn nhân qua cổ mình, nắm lấy cổ tay họ.',
            'Tay kia ôm eo nạn nhân.',
            'Bước đi nhịp nhàng cùng nhau.'
        ]
    },
    {
        id: 'transport_2',
        title: '28. Cõng nạn nhân',
        category: 'Di chuyển',
        icon: User,
        steps: [
            'Dùng cho nạn nhân tỉnh, không chấn thương cột sống/ngực/bụng.',
            'Ngồi xuống quay lưng lại.',
            'Nạn nhân ôm cổ, quặp chân quanh eo.',
            'Đứng dậy, giữ đùi nạn nhân.',
            'Di chuyển.'
        ]
    },
    {
        id: 'transport_3',
        title: '29. Kiệu tay (2 người)',
        category: 'Di chuyển',
        icon: User,
        steps: [
            'Hai người cứu làm kiệu 4 tay (mỗi người nắm cổ tay trái của mình, rồi nắm cổ tay phải người kia).',
            'Nạn nhân ngồi lên tay, hai tay ôm cổ 2 người cứu.',
            'Thích hợp nạn nhân tỉnh, không đi được.'
        ]
    },
    {
        id: 'stretcher',
        title: '30. Làm cáng tải thương',
        category: 'Di chuyển',
        icon: Anchor,
        steps: [
            'Dùng 2 cây gậy dài chắc chắn.',
            'Dùng 2 áo sơ mi/áo khoác: Cài nút, lộn ngược tay áo vào trong, luồn gậy qua tay áo và thân áo.',
            'Hoặc dùng chăn mền/tấm bạt cuộn 2 bên gậy.',
            'Thử độ chắc chắn trước khi đặt nạn nhân lên.'
        ]
    },
    {
        id: 'bandage_head',
        title: '31. Băng đầu (Kiểu mũ)',
        category: 'Băng bó',
        icon: ShieldPlus,
        steps: [
            'Dùng băng tam giác.',
            'Gấp đáy băng khoảng 2cm.',
            'Đặt đáy băng lên trán (ngay trên lông mày).',
            'Đỉnh băng rủ ra sau gáy.',
            'Kéo 2 đuôi băng ra sau, bắt chéo đè lên đỉnh băng ở gáy.',
            'Vòng 2 đuôi về trước trán và buộc lại.',
            'Kéo đỉnh băng ở gáy lên ghim chặt hoặc nhét vào trong.'
        ]
    },
    {
        id: 'bandage_arm',
        title: '32. Băng treo tay',
        category: 'Băng bó',
        icon: ShieldPlus,
        steps: [
            'Dùng cho gãy xương cẳng tay/cánh tay.',
            'Đặt tay bị thương vuông góc trước ngực.',
            'Luồn băng tam giác dưới cánh tay, một đuôi qua vai bên lành, một đuôi qua vai bên đau.',
            'Đỉnh băng nằm ở khuỷu tay.',
            'Buộc 2 đuôi ở phía sau cổ.',
            'Ghim hoặc buộc đỉnh băng ở khuỷu tay lại.'
        ]
    },
    {
        id: 'bandage_spiral',
        title: '33. Băng xoắn ốc',
        category: 'Băng bó',
        icon: ShieldPlus,
        steps: [
            'Dùng băng cuộn.',
            'Neo đầu băng 2 vòng.',
            'Quấn các vòng sau đè lên 1/2 hoặc 2/3 vòng trước.',
            'Cuốn từ dưới lên trên (hướng về tim) để máu lưu thông.',
            'Cố định đuôi băng.'
        ]
    }
];

const FirstAidLesson: React.FC<FirstAidLessonProps> = ({ onBack, onStartQuiz }) => {
  const [activeTab, setActiveTab] = useState(PROCEDURES[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  
  const currentProc = PROCEDURES.find(p => p.id === activeTab) || PROCEDURES[0];
  const Icon = currentProc.icon;

  const filteredProcedures = useMemo(() => {
      return PROCEDURES.filter(p => 
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
          <button onClick={onBack} className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
             <ArrowRight className="rotate-180" size={16} /> Quay lại
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-full font-bold">
             <HeartPulse size={20} /> CẨM NANG CỨU THƯƠNG
          </div>
          <button onClick={onStartQuiz} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition shadow-lg">
             Vào thi ngay
          </button>
      </div>

      <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Menu */}
          <div className="md:col-span-1 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Tìm bài học..." 
                        className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border-none rounded-lg focus:ring-2 focus:ring-pink-500 outline-none dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {filteredProcedures.length > 0 ? (
                      filteredProcedures.map(proc => (
                        <button
                            key={proc.id}
                            onClick={() => setActiveTab(proc.id)}
                            className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${
                                activeTab === proc.id 
                                ? 'bg-pink-600 text-white shadow-md' 
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            <proc.icon size={18} className="flex-shrink-0" />
                            <div className="overflow-hidden">
                                <p className="font-medium text-sm truncate">{proc.title}</p>
                                <p className={`text-xs truncate ${activeTab === proc.id ? 'text-pink-200' : 'text-gray-400'}`}>{proc.category}</p>
                            </div>
                        </button>
                      ))
                  ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">Không tìm thấy bài học nào.</div>
                  )}
              </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-y-auto">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="p-4 bg-pink-100 text-pink-600 rounded-full shadow-inner">
                      <Icon size={40} />
                  </div>
                  <div>
                      <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded uppercase tracking-wide">{currentProc.category}</span>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{currentProc.title}</h2>
                  </div>
              </div>

              <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                      <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                          <Stethoscope size={20} className="text-pink-600"/> Quy trình xử lý:
                      </h3>
                      <div className="space-y-4">
                          {currentProc.steps.map((step, idx) => (
                              <div key={idx} className="flex gap-4">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold shadow-sm text-sm">
                                      {idx + 1}
                                  </div>
                                  <p className="pt-1 text-gray-700 dark:text-gray-200 text-lg leading-relaxed">{step}</p>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className="flex gap-4">
                      <div className="flex-1 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-sm text-yellow-800 dark:text-yellow-200 italic flex items-start gap-3">
                          <AlertTriangle className="flex-shrink-0 mt-0.5" size={18} />
                          <p>Lưu ý: Luôn gọi 115 hoặc chuyển đến cơ sở y tế gần nhất nếu tình trạng nghiêm trọng. An toàn của người cấp cứu là ưu tiên hàng đầu.</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default FirstAidLesson;
