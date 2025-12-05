
import { 
  Lightbulb, Flag, Radio, Lock, HeartPulse, Map, Book, Users
} from 'lucide-react';

export type TopicConfigItem = {
    label: string;
    description: string;
    icon: any;
    color: string;
    bg: string;
    section: 'Chuyên Môn' | 'Tu Học & Kiến Thức';
};

export const TOPIC_CONFIG: Record<string, TopicConfigItem> = {
  'Morse': { label: 'Morse', description: 'Luyện tín hiệu (Nghe/Nhìn).', icon: Radio, color: 'text-blue-600', bg: 'bg-blue-100', section: 'Chuyên Môn' },
  'Semaphore': { label: 'Semaphore', description: 'Tra cứu & Luyện tập tư thế cờ.', icon: Flag, color: 'text-red-600', bg: 'bg-red-100', section: 'Chuyên Môn' },
  'MatThu': { label: 'Mật Thư', description: 'Thay thế, Dời chỗ, Ẩn giấu...', icon: Lock, color: 'text-purple-600', bg: 'bg-purple-100', section: 'Chuyên Môn' },
  'NutDay': { label: 'Nút Dây', description: 'Cách thắt nút thông dụng.', icon: Lightbulb, color: 'text-orange-600', bg: 'bg-orange-100', section: 'Chuyên Môn' },
  'CuuThuong': { label: 'Cứu Thương', description: 'Sơ cấp cứu cơ bản.', icon: HeartPulse, color: 'text-pink-600', bg: 'bg-pink-100', section: 'Chuyên Môn' },
  'DauDiDuong': { label: 'Dấu Đi Đường', description: 'Dấu hiệu thiên nhiên & quy ước.', icon: Map, color: 'text-emerald-600', bg: 'bg-emerald-100', section: 'Chuyên Môn' },
  'PhatPhap': { label: 'Phật Pháp', description: 'Lịch sử & Giáo lý.', icon: Book, color: 'text-yellow-600', bg: 'bg-yellow-100', section: 'Tu Học & Kiến Thức' },
  'KienThucGDPT': { label: 'Kiến Thức GĐPT', description: 'Tổ chức & Nghi thức.', icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-100', section: 'Tu Học & Kiến Thức' }
};
