
import React, { useState, useRef, useEffect } from 'react';
import { 
  Book, Music, Gamepad2, FileText, Search, PlayCircle, 
  Download, ChevronRight, Flower2, Mic2, PauseCircle,
  Volume2, Share2, Printer, Plus, X, Save, Link as LinkIcon,
  Youtube, ExternalLink, Trash2, Video, Edit, FolderInput
} from 'lucide-react';
import { useAuthStore } from '../store';
import { UserRole } from '../types';

// Hàm hỗ trợ nhận diện loại media
const getMediaType = (url: string) => {
    if (!url) return { type: 'none' };
    
    // Regex nhận diện YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) return { type: 'youtube', id: ytMatch[1] };

    // Regex nhận diện TikTok (lấy Video ID)
    const tiktokMatch = url.match(/tiktok\.com\/.*\/video\/(\d+)/);
    if (tiktokMatch) return { type: 'tiktok', id: tiktokMatch[1] };
    
    // Nhận diện file âm thanh trực tiếp
    if (url.match(/\.(mp3|wav|ogg|m4a)$/i)) return { type: 'audio' };
    
    // Còn lại là link ngoài
    return { type: 'link' };
};

// Dữ liệu mẫu khởi tạo
const INITIAL_RESOURCES = {
    rituals: [
        { 
            id: 'r1', 
            title: 'Nghi Thức Lễ Phật (Thường dùng)', 
            type: 'text', 
            category: 'Hành Lễ',
            content: `**1. TỊNH PHÁP GIỚI CHÂN NGÔN**\nÁn lam sa ha (3 lần)\n\n**2. TỊNH TAM NGHIỆP CHÂN NGÔN**\nÁn ta phạ bà phạ, thuật đà sa phạ, đát ma ta phạ, bà phạ thuật độ hám. (3 lần)\n\n**3. NGUYỆN HƯƠNG**\nNguyện đem lòng thành kính\nGửi theo đám mây hương\nPhảng phất khắp mười phương\nCúng dường ngôi Tam Bảo.\n\nThề trọn đời giữ đạo\nTheo tự tánh làm lành\nCùng pháp giới chúng sanh\nCầu Phật từ gia hộ:\nTâm Bồ Đề kiên cố\nChí tu học vững bền\nXa bể khổ nguồn mê\nChóng quay về bờ giác.\n\n(Xá rồi cắm hương)\n\n**4. TÁN PHẬT**\nĐấng Pháp Vương vô thượng\nBa cõi chẳng ai bằng\nThầy dạy khắp trời người\nCha lành chung bốn loại.\nQuy y tròn một niệm\nDứt sạch nghiệp ba kỳ\nXưng dương cùng tán thán\nỨc kiếp không cùng tận.\n\n**5. ĐẢNH LỄ (Lạy)**\n- Chí tâm đảnh lễ: Nam Mô Tận Hư Không Biến Pháp Giới Quá Hiện Vị Lai Thập Phương Chư Phật, Tôn Pháp, Hiền Thánh Tăng Thường Trụ Tam Bảo. (1 lạy)\n- Chí tâm đảnh lễ: Nam Mô Ta Bà Giáo Chủ Điều Ngự Bổn Sư Thích Ca Mâu Ni Phật, Đương Lai Hạ Sanh Di Lặc Tôn Phật, Đại Trí Văn Thù Sư Lợi Bồ Tát, Đại Hạnh Phổ Hiền Bồ Tát, Hộ Pháp Chư Tôn Bồ Tát, Linh Sơn Hội Thượng Phật Bồ Tát. (1 lạy)\n- Chí tâm đảnh lễ: Nam Mô Tây Phương Cực Lạc Thế Giới Đại Từ Đại Bi A Di Đà Phật, Đại Bi Quán Thế Âm Bồ Tát, Đại Thế Chí Bồ Tát, Đại Nguyện Địa Tạng Vương Bồ Tát, Thanh Tịnh Đại Hải Chúng Bồ Tát. (1 lạy)`
        },
        { 
            id: 'r2', 
            title: 'Bài Sám Hối', 
            type: 'text',
            category: 'Tụng Niệm', 
            content: `Đệ tử kính lạy\nĐức Phật Thích Ca\nPhật A Di Đà\nThập phương chư Phật\nVô lượng Phật Pháp\nCùng Thánh Hiền Tăng\n\nĐệ tử lâu đời lâu kiếp\nNghiệp chướng nặng nề\nTham giận kiêu căng\nSi mê lầm lạc\nNgày nay nhờ Phật\nBiết sự lỗi lầm\nThành tâm sám hối\nThề tránh điều dữ\nNguyện làm việc lành\nNgửa trông ơn Phật\nTừ bi gia hộ\nThân không tật bệnh\nTâm không phiền não\nHằng ngày an vui\nTu tập phép Phật\nMọi người thân tín\nCũng được tốt lành\nVui sống với nhau\nThắm tình đạo vị\nĐời nay tin Phật\nĐời sau tin Phật\nĐời đời kiếp kiếp\nGiữ gìn giới pháp\nPhát nguyện Bồ Đề\nDứt trừ nghiệp chướng\nChóng hoàn Phật Đạo\nĐộ cả chúng sanh\nĐồng thành chánh giác.`
        },
        { 
            id: 'r3', 
            title: 'Hồi Hướng & Tam Tự Quy', 
            type: 'text', 
            category: 'Kết Thúc',
            content: `**HỒI HƯỚNG**\nNguyện đem công đức này\nHướng về khắp tất cả\nĐệ tử và chúng sanh\nĐều trọn thành Phật đạo.\n\n**TAM TỰ QUY Y**\n- Tự quy y Phật, xin nguyện chúng sanh, thể theo đạo cả, phát lòng vô thượng. (1 lạy)\n- Tự quy y Pháp, xin nguyện chúng sanh, thấu rõ kinh tạng, trí tuệ như biển. (1 lạy)\n- Tự quy y Tăng, xin nguyện chúng sanh, thống lý đại chúng, hết thảy không ngại. (1 lạy)`
        },
        {
            id: 'r4',
            title: 'Bốn Lời Thệ Nguyện Lớn',
            type: 'text',
            category: 'Phát Nguyện',
            content: `Chúng sanh vô biên thệ nguyện độ\nPhiền não vô tận thệ nguyện đoạn\nPháp môn vô lượng thệ nguyện học\nPhật đạo vô thượng thệ nguyện thành.`
        }
    ],
    songs: [
        { 
            id: 's1', 
            title: 'Bài Ca Chính Thức (Sen Trắng)', 
            author: 'Nhạc: Ưng Hội - Lời: Phạm Hữu Bình & Nguyễn Hữu Quán', 
            audioUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
            lyric: `Kìa xem đóa sen trắng thơm,\nNghìn hào quang chiếu sáng trên đầm.\nHương thắm thường bay khắp mọi nơi,\nSắc thanh tịnh mầu.\n\nSen trắng tượng trưng tấm lòng\nTừ bi bác ái bao la.\nSen trắng một dạ sắt son,\nHoàn toàn dâng hiến hy sinh.\n\nGia Đình Phật Tử Việt Nam,\nNguyện lên đài sen ngát hương.\nGia Đình Phật Tử Việt Nam,\nNguyện tỏa hương thơm muôn phương.`
        },
        { 
            id: 's2', 
            title: 'Dây Thân Ái', 
            author: 'Thế Lữ', 
            audioUrl: 'https://zingmp3.vn/bai-hat/Day-Than-Ai-Gia-Dinh-Phat-Tu/ZW6UO0WD.html',
            lyric: `Dây thân ái lan rộng muôn nhà\nTay sắp xa biếu nhau lời chào\nLời nhắn nhủ hai lời thật thà\nNhớ nhớ lấy dung nhan hôm nào\n\n(Điệp khúc)\nVui anh em ta sum vầy\nNơi đây tin yêu chan hòa\nĐêm nay dung nhan sum vầy\nMai đây chia tay lòng nào nguôi.\n\nĐường ta đi tuy rằng xa vời\nTim vẫn ghi những câu thề nguyền\nLòng cương quyết gìn giữ giống nòi\nChí hăng hái bay cao triền miên.`
        },
        { 
            id: 's3', 
            title: 'Trầm Hương Đốt', 
            author: 'Bửu Bác', 
            audioUrl: 'https://cattuong.org/amthanh/nhac_gdpt/Tram_Huong_Dot.mp3', 
            lyric: `Trầm hương đốt, xông ngát mười phương,\nNguyện nguyện kính đức Nghiêm Từ vô lượng.\nCầu cầu xin chứng tâm thành chúng con,\nVận vận khói kết mây lành cúng dường.\n\nĐạo nhiệm mầu đã lan truyền nơi cùng nơi,\nNhờ chân lý chúng sanh đều thoát luân hồi.\nĐồng quy kính quỳ dưới đài sen,\nDâng hoa thơm tinh khiết màu thắm tươi cành.\n\nĐài quang minh sáng huy hoàng trang nghiêm,\nƠn mười phương điều ngự hào quang an lành.\nNhìn đạo uyển chuyển soi khắp cùng quần sanh,\nPhật đạo đồng cùng nhau tu tinh tấn mau viên thành.\n\nNam mô Bổn sư Thích Ca Mâu Ni Phật.\nNam mô Bổn sư Thích Ca Mâu Ni Phật.`
        },
        { 
            id: 's4', 
            title: 'Vui Ánh Đạo', 
            author: 'Nhiều tác giả', 
            audioUrl: '', 
            lyric: `Vui ánh đạo, ngàn phương sáng soi\nMùa vui đạo thiêng, muôn phương sáng ngời\nĐem tin mừng, ngày vui khắp nơi\nVui trong ánh đạo, lòng thêm sáng tươi...`
        }
    ],
    games: [
        { 
            id: 'g1', 
            title: 'Trò chơi: Bão Thổi', 
            type: 'Vòng tròn', 
            desc: `**Chuẩn bị:** Sân bãi rộng, xếp thành vòng tròn.\n**Cách chơi:**\n1. Tất cả đứng thành vòng tròn.\n2. Quản trò đứng giữa hô to: "Bão thổi! Bão thổi!"\n3. Người chơi đáp: "Thổi ai? Thổi ai?"\n4. Quản trò ra lệnh, ví dụ: "Thổi những người mặc áo lam!", hoặc "Thổi những người có đeo kính!".\n5. Những người có đặc điểm đó phải nhanh chóng đổi chỗ cho nhau.\n6. Quản trò sẽ tranh thủ chiếm một chỗ trống.\n7. Người không tìm được chỗ sẽ trở thành Quản trò tiếp theo.`
        },
        { 
            id: 'g2', 
            title: 'Trò chơi: Kết Chùm', 
            type: 'Vận động', 
            desc: `**Chuẩn bị:** Vòng tròn chạy nhẹ nhàng.\n**Cách chơi:**\n1. Người chơi chạy nhẹ nhàng theo vòng tròn, vừa chạy vừa hát.\n2. Quản trò hô bất ngờ: "Kết chùm! Kết chùm!".\n3. Người chơi hỏi: "Kết mấy? Kết mấy?".\n4. Quản trò hô số lượng, ví dụ: "Kết 3!".\n5. Người chơi phải nhanh chóng ôm nhau thành nhóm đúng 3 người.\n6. Nhóm nào thừa hoặc thiếu người sẽ bị loại hoặc chịu phạt (nhảy lò cò).`
        },
        { 
            id: 'g3', 
            title: 'Trò chơi: Truyền Tin Mật Mã', 
            type: 'Trí tuệ', 
            desc: `**Chuẩn bị:** Các bản tin mật thư ngắn (Morse hoặc Semaphore) đã chuẩn bị sẵn trong phong bì.\n**Cách chơi:**\n1. Chia đoàn sinh thành các đội (Đàn/Đội/Chúng).\n2. Đội trưởng nhận mật thư từ quản trò.\n3. Cả đội cùng giải mã và thực hiện yêu cầu trong mật thư (ví dụ: Tìm vật, Hát một bài, Xếp hình...).\n4. Đội nào hoàn thành nhanh và đúng yêu cầu nhất là thắng cuộc.`
        },
    ],
    forms: [
        { id: 'f1', title: 'Đơn xin gia nhập GĐPT', file: 'don-gia-nhap.pdf', desc: 'Mẫu đơn dành cho đoàn sinh mới.' },
        { id: 'f2', title: 'Phiếu báo cáo tháng (Huynh trưởng)', file: 'bao-cao-thang.docx', desc: 'Dành cho HT Đoàn báo cáo tình hình nhân sự.' },
        { id: 'f3', title: 'Nội quy GĐPT Việt Nam', file: 'noi-quy.pdf', desc: 'Văn bản nội quy chính thức.' },
    ]
};

const TAB_CONFIG = {
    rituals: { label: 'Nghi Thức', icon: Book },
    songs: { label: 'Bài Hát', icon: Music },
    games: { label: 'Trò Chơi', icon: Gamepad2 },
    forms: { label: 'Hành Chính', icon: FileText }
};

const Resources = () => {
  const { user } = useAuthStore();
  const isManager = user?.role === UserRole.HUYNH_TRUONG || user?.role === UserRole.GIA_TRUONG || user?.role === UserRole.ADMIN_ROOT;

  const [activeTab, setActiveTab] = useState<'rituals' | 'songs' | 'games' | 'forms'>('rituals');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [resources, setResources] = useState<any>(INITIAL_RESOURCES);
  
  // Add/Edit Resource Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form Data now includes 'targetTab' to choose where to save
  const [formData, setFormData] = useState<any>({
      id: '',
      title: '',
      content: '',
      author: '',
      type: '',
      category: '',
      audioUrl: '',
      file: '',
      targetTab: 'rituals'
  });

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset audio when changing items
  useEffect(() => {
      setIsPlaying(false);
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
      }
  }, [selectedItem]);

  const toggleAudio = () => {
      if (!audioRef.current) return;
      if (isPlaying) {
          audioRef.current.pause();
      } else {
          audioRef.current.play().catch(err => alert("Không thể phát file âm thanh (Link demo có thể đã hết hạn)."));
      }
      setIsPlaying(!isPlaying);
  };

  const getFilteredData = () => {
      const data = resources[activeTab];
      if (!searchTerm) return data;
      return data.filter((item: any) => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.lyric && item.lyric.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  };

  const handlePrint = () => {
      window.print();
  };

  // --- ACTIONS ---

  const handleDelete = (id: string, e?: React.MouseEvent) => {
      // Ngăn chặn sự kiện click để không mở xem chi tiết
      if (e) {
          e.stopPropagation();
          e.preventDefault();
      }
      
      const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tài liệu này vĩnh viễn không?");
      if (confirmDelete) {
          setResources((prev: any) => ({
              ...prev,
              [activeTab]: prev[activeTab].filter((item: any) => item.id !== id)
          }));
          
          // Nếu đang xem chi tiết mục bị xóa thì quay lại danh sách
          if (selectedItem?.id === id) {
              setSelectedItem(null);
          }
      }
  };

  const handleOpenAdd = () => {
      setFormData({ 
          id: '', title: '', content: '', author: '', type: '', category: '', audioUrl: '', file: '',
          targetTab: activeTab // Default to current tab
      });
      setIsEditing(false);
      setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any, e?: React.MouseEvent) => {
      if (e) {
          e.stopPropagation();
          e.preventDefault();
      }
      
      // Map existing data to form structure
      setFormData({
          id: item.id,
          title: item.title,
          // Map specific fields back to generic 'content' for editing
          content: item.content || item.lyric || item.desc || '',
          author: item.author || '',
          type: item.type || '',
          category: item.category || '',
          audioUrl: item.audioUrl || '',
          file: item.file || '',
          targetTab: activeTab // Initially the current tab
      });
      setIsEditing(true);
      setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.title) return;

      const targetTab = formData.targetTab;

      const payload = {
          ...formData,
          // Assign content to correct field based on the TARGET TAB, NOT activeTab
          lyric: targetTab === 'songs' ? formData.content : undefined,
          desc: (targetTab === 'games' || targetTab === 'forms') ? formData.content : undefined,
          content: targetTab === 'rituals' ? formData.content : undefined,
          // Clean up unused fields
          category: (targetTab === 'rituals') ? formData.category : undefined,
          type: (targetTab === 'games' || targetTab === 'forms') ? formData.type : undefined,
      };
      
      // Remove temporary form fields before saving
      delete payload.targetTab;

      setResources((prev: any) => {
          const newResources = { ...prev };

          if (isEditing) {
              // Check if moved to another tab
              if (activeTab !== targetTab) {
                  // Remove from old tab
                  newResources[activeTab] = newResources[activeTab].filter((item: any) => item.id !== formData.id);
                  // Add to new tab
                  newResources[targetTab] = [payload, ...newResources[targetTab]];
                  
                  // If we were viewing this item, close detail view since it moved
                  if (selectedItem && selectedItem.id === formData.id) {
                      setSelectedItem(null);
                  }
              } else {
                  // Update in place
                  newResources[activeTab] = newResources[activeTab].map((item: any) => 
                      item.id === formData.id ? { ...item, ...payload } : item
                  );
                  // Update detail view if active
                  if (selectedItem && selectedItem.id === formData.id) {
                      setSelectedItem({ ...selectedItem, ...payload });
                  }
              }
          } else {
              // Add new item
              const newEntry = {
                  ...payload,
                  id: `${targetTab}_${Date.now()}`
              };
              newResources[targetTab] = [newEntry, ...newResources[targetTab]];
          }
          return newResources;
      });

      setIsModalOpen(false);
      // Switch view to the target tab if we added/moved something there
      if (activeTab !== targetTab) {
          setActiveTab(targetTab as any);
      }
      
      alert(isEditing ? "Đã cập nhật thành công!" : "Đã thêm mới thành công!");
  };

  const renderContent = () => {
      const items = getFilteredData();

      if (selectedItem) {
          const media = getMediaType(selectedItem.audioUrl);

          return (
              <div className="animate-slide-up h-full flex flex-col relative">
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="flex items-center gap-1 text-gray-500 hover:text-primary-600 mb-4 font-medium print:hidden"
                  >
                      <ChevronRight className="rotate-180" size={18} /> Quay lại danh sách
                  </button>
                  
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex-1 overflow-y-auto">
                      <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-4">
                              <div className={`p-4 rounded-xl shadow-inner ${
                                  activeTab === 'rituals' ? 'bg-yellow-100 text-yellow-700' :
                                  activeTab === 'songs' ? 'bg-pink-100 text-pink-700' :
                                  activeTab === 'games' ? 'bg-green-100 text-green-700' :
                                  'bg-blue-100 text-blue-700'
                              }`}>
                                  {activeTab === 'rituals' && <Flower2 size={32} />}
                                  {activeTab === 'songs' && <Music size={32} />}
                                  {activeTab === 'games' && <Gamepad2 size={32} />}
                                  {activeTab === 'forms' && <FileText size={32} />}
                              </div>
                              <div>
                                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{selectedItem.title}</h2>
                                  {selectedItem.author && <p className="text-gray-500 italic flex items-center gap-1"><Mic2 size={14}/> {selectedItem.author}</p>}
                                  {selectedItem.category && <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{selectedItem.category}</span>}
                                  {selectedItem.type && activeTab !== 'rituals' && !selectedItem.category && <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 inline-block">{selectedItem.type}</span>}
                              </div>
                          </div>
                          
                          <div className="flex gap-2 print:hidden">
                              {isManager && (
                                <>
                                    <button onClick={(e) => handleOpenEdit(selectedItem, e)} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full" title="Chỉnh sửa">
                                        <Edit size={20} />
                                    </button>
                                    <button onClick={(e) => handleDelete(selectedItem.id, e)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full" title="Xóa tài liệu này">
                                        <Trash2 size={20} />
                                    </button>
                                </>
                              )}
                              <button onClick={handlePrint} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full" title="In nội dung">
                                  <Printer size={20} />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full" title="Chia sẻ">
                                  <Share2 size={20} />
                              </button>
                          </div>
                      </div>

                      {/* Content Body */}
                      <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-lg font-serif">
                          {selectedItem.content || selectedItem.lyric || selectedItem.desc}
                      </div>

                      {/* Media Player Section */}
                      {(selectedItem.audioUrl) && (
                          <div className="mt-8 print:hidden">
                              {/* YouTube Embed */}
                              {media.type === 'youtube' && (
                                  <div className="space-y-2">
                                      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                                          <iframe 
                                            width="100%" 
                                            height="100%" 
                                            src={`https://www.youtube.com/embed/${(media as any).id}`} 
                                            title="YouTube video player" 
                                            frameBorder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                          ></iframe>
                                      </div>
                                      <p className="text-xs text-gray-500 text-center"><Youtube size={12} className="inline mr-1"/> Video từ YouTube</p>
                                  </div>
                              )}

                              {/* TikTok Embed */}
                              {media.type === 'tiktok' && (
                                  <div className="space-y-2 flex flex-col items-center">
                                      <div className="w-[325px] h-[580px] rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-black">
                                          <iframe
                                              src={`https://www.tiktok.com/embed/v2/${(media as any).id}`}
                                              width="100%"
                                              height="100%"
                                              frameBorder="0"
                                              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                              allowFullScreen
                                              title="TikTok Video"
                                          ></iframe>
                                      </div>
                                      <p className="text-xs text-gray-500 text-center flex items-center gap-1">
                                          Video từ TikTok <ExternalLink size={10}/>
                                      </p>
                                  </div>
                              )}

                              {/* Audio Player */}
                              {media.type === 'audio' && (
                                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-4">
                                      <button 
                                        onClick={toggleAudio}
                                        className="w-12 h-12 rounded-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                                      >
                                          {isPlaying ? <PauseCircle size={28} /> : <PlayCircle size={28} />}
                                      </button>
                                      <div className="flex-1">
                                          <div className="text-sm font-bold text-gray-800 dark:text-gray-200">Phát file MP3 trực tiếp</div>
                                          <div className="text-xs text-gray-500">File âm thanh</div>
                                          <audio 
                                            ref={audioRef} 
                                            src={selectedItem.audioUrl} 
                                            onEnded={() => setIsPlaying(false)}
                                            className="hidden" 
                                          />
                                      </div>
                                      <Volume2 size={20} className="text-gray-400" />
                                  </div>
                              )}

                              {/* External Link */}
                              {media.type === 'link' && (
                                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 text-center">
                                      <p className="text-blue-800 dark:text-blue-200 mb-3 font-medium">Tài liệu này có liên kết media bên ngoài</p>
                                      <a 
                                        href={selectedItem.audioUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 font-bold"
                                      >
                                          <ExternalLink size={18} /> Mở liên kết ngay
                                      </a>
                                  </div>
                              )}
                          </div>
                      )}

                      {/* Download Action for Forms */}
                      {(activeTab === 'forms' || selectedItem.type === 'pdf') && (
                          <div className="mt-8 flex justify-center print:hidden">
                              <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                                  <Download size={20} /> Tải tài liệu về máy
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          );
      }

      return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
              {items.map((item: any) => {
                  const mediaType = getMediaType(item.audioUrl);
                  return (
                    <div 
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all cursor-pointer group flex items-start gap-4 relative"
                    >
                        {isManager && (
                            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <button 
                                    onClick={(e) => handleOpenEdit(item, e)}
                                    className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                                    title="Sửa"
                                >
                                    <Edit size={16} />
                                </button>
                                <button 
                                    onClick={(e) => handleDelete(item.id, e)}
                                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                                    title="Xóa"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}

                        <div className={`mt-1 p-3 rounded-xl flex-shrink-0 transition-colors shadow-sm ${
                            activeTab === 'rituals' ? 'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100' :
                            activeTab === 'songs' ? 'bg-pink-50 text-pink-600 group-hover:bg-pink-100' :
                            activeTab === 'games' ? 'bg-green-50 text-green-600 group-hover:bg-green-100' :
                            'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                        }`}>
                            {activeTab === 'rituals' && <Flower2 size={24} />}
                            {activeTab === 'songs' && (
                                mediaType.type === 'youtube' ? <Youtube size={24} className="text-red-600"/> :
                                mediaType.type === 'tiktok' ? <Video size={24} className="text-black dark:text-white"/> :
                                mediaType.type === 'link' ? <ExternalLink size={24} /> :
                                <Mic2 size={24} />
                            )}
                            {activeTab === 'games' && <Gamepad2 size={24} />}
                            {activeTab === 'forms' && <FileText size={24} />}
                        </div>
                        <div className="flex-1 min-w-0 pr-8">
                            <h3 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors text-lg">{item.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                                {item.content || item.lyric || item.desc || "Nhấn để xem chi tiết tài liệu này."}
                            </p>
                            {item.author && <span className="text-xs text-gray-400 mt-2 block italic">— {item.author}</span>}
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-primary-500 self-center" size={20} />
                    </div>
                  );
              })}
              {items.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                          <Search size={24} className="opacity-50" />
                      </div>
                      <p>Không tìm thấy nội dung phù hợp.</p>
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tư Liệu Sinh Hoạt</h2>
          <p className="text-gray-500 text-sm mt-1">Kho tàng nghi thức, bài hát và tài liệu GĐPT.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm tư liệu..." 
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {isManager && (
                <button 
                    onClick={handleOpenAdd}
                    className="bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 shadow-md flex items-center justify-center flex-shrink-0 gap-2 font-bold transition-all"
                    title="Thêm tài liệu mới"
                >
                    <Plus size={18} /> Thêm Mới
                </button>
            )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible flex-shrink-0 pb-2 md:pb-0">
              {Object.entries(TAB_CONFIG).map(([key, config]) => {
                  const Icon = config.icon;
                  const isActive = activeTab === key;
                  return (
                      <button 
                        key={key}
                        onClick={() => { setActiveTab(key as any); setSelectedItem(null); }}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                            isActive 
                            ? 'bg-primary-100 text-primary-800 shadow-sm ring-1 ring-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:ring-primary-800' 
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                          <Icon size={20} className={isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'} />
                          {config.label}
                      </button>
                  )
              })}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto">
              {renderContent()}
          </div>
      </div>

      {/* Add/Edit Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
           <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-primary-600 text-white">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        {isEditing ? <Edit size={20}/> : <Plus size={20}/>} 
                        {isEditing ? 'Chỉnh Sửa Tài Liệu' : 'Thêm Tài Liệu Mới'}
                    </h3>
                    <p className="text-primary-100 text-sm">Nhập thông tin chi tiết cho tư liệu</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white bg-white/10 p-2 rounded-full"><X size={20}/></button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                  <form id="resource-form" onSubmit={handleSave} className="space-y-4">
                      
                      {/* Target Tab Selection */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                              <FolderInput size={16}/> Danh mục hiển thị
                          </label>
                          <select
                            value={formData.targetTab}
                            onChange={(e) => setFormData({...formData, targetTab: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                          >
                              {Object.entries(TAB_CONFIG).map(([key, config]) => (
                                  <option key={key} value={key}>{config.label}</option>
                              ))}
                          </select>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tiêu đề (*)</label>
                          <input 
                            required
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Tên tài liệu..."
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                          />
                      </div>

                      {/* Conditional Fields based on SELECTED TARGET TAB */}
                      
                      {/* 1. Category / Type (For Rituals & Games) */}
                      {(formData.targetTab === 'rituals' || formData.targetTab === 'games') && (
                          <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phân loại</label>
                              <input 
                                type="text"
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder={formData.targetTab === 'rituals' ? "Ví dụ: Tụng niệm, Hành lễ..." : "Ví dụ: Vận động, Trí tuệ..."}
                                value={formData.targetTab === 'rituals' ? formData.category : formData.type}
                                onChange={(e) => formData.targetTab === 'rituals' ? setFormData({...formData, category: e.target.value}) : setFormData({...formData, type: e.target.value})}
                              />
                          </div>
                      )}

                      {/* 2. Author (For Songs) */}
                      {formData.targetTab === 'songs' && (
                          <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tác giả</label>
                              <input 
                                type="text"
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                                value={formData.author}
                                onChange={(e) => setFormData({...formData, author: e.target.value})}
                              />
                          </div>
                      )}

                      {/* 3. Media URL (Expanded to All Types except Forms) */}
                      {formData.targetTab !== 'forms' && (
                          <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link Video / Nhạc</label>
                              <div className="relative">
                                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                  <input 
                                    type="url"
                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="https://youtube.com..., https://tiktok.com..."
                                    value={formData.audioUrl}
                                    onChange={(e) => setFormData({...formData, audioUrl: e.target.value})}
                                  />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Hỗ trợ YouTube, TikTok, MP3 hoặc link ZingMP3/Spotify.</p>
                          </div>
                      )}

                      {/* 4. File URL (For Forms) */}
                      {formData.targetTab === 'forms' && (
                          <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link Tải File (PDF/Doc)</label>
                              <div className="relative">
                                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                  <input 
                                    type="url"
                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="https://..."
                                    value={formData.file}
                                    onChange={(e) => setFormData({...formData, file: e.target.value})}
                                  />
                              </div>
                          </div>
                      )}

                      {/* 5. Main Content / Lyric / Desc */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {formData.targetTab === 'songs' ? 'Lời bài hát' : formData.targetTab === 'games' ? 'Luật chơi & Cách chơi' : formData.targetTab === 'forms' ? 'Mô tả ngắn' : 'Nội dung văn bản'}
                          </label>
                          <textarea 
                             required
                             rows={6}
                             className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                             placeholder="Nhập nội dung chi tiết..."
                             value={formData.content}
                             onChange={(e) => setFormData({...formData, content: e.target.value})}
                          ></textarea>
                      </div>
                  </form>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 rounded-lg transition"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit"
                    form="resource-form"
                    className="px-5 py-2.5 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition flex items-center gap-2"
                  >
                    <Save size={18} /> {isEditing ? 'Cập Nhật' : 'Lưu Mới'}
                  </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
