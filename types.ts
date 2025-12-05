
export enum UserRole {
  ADMIN_ROOT = 'admin_root',
  GIA_TRUONG = 'gia_truong',
  LIEN_DOAN_TRUONG = 'lien_doan_truong',
  HUYNH_TRUONG = 'huynh_truong',
  THU_KY = 'thu_ky',
  PHU_HUYNH = 'phu_huynh',
  DOAN_SINH = 'doan_sinh',
  CO_VAN = 'co_van',
  DOAN_PHA = 'doan_pha',
}

export enum Nganh {
  THANH = 'Thanh',
  THIEU = 'Thiếu',
  DONG = 'Đồng',
}

export enum Doan {
  NAM_PHAT_TU = 'Nam Phật Tử',
  NU_PHAT_TU = 'Nữ Phật Tử',
  THIEU_NAM = 'Thiếu Nam',
  THIEU_NU = 'Thiếu Nữ',
  OANH_VU_NAM = 'Oanh Vũ Nam',
  OANH_VU_NU = 'Oanh Vũ Nữ',
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phap_danh?: string;
  role: UserRole;
  doan?: Doan; // Đoàn mà huynh trưởng phụ trách (nếu có)
  nganh?: Nganh;
  avatar_url?: string;
  bac_hoc?: string;
}

export interface DoanSinh {
  id: string;
  full_name: string;
  phap_danh: string;
  birth_date: string; // ISO date
  gender: 'Nam' | 'Nữ';
  doan: Doan;
  bac_hoc: string;
  join_date: string;
  status: 'active' | 'inactive' | 'graduated';
  parent_name?: string;
  parent_phone?: string;
  avatar_url?: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  doan_sinh_id: string;
  doan_sinh_name: string; // Denormalized for easy display
  doan: Doan;
  status: 'present' | 'absent' | 'excused' | 'late' | 'early_leave';
  notes?: string;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  scope: 'general' | 'doan'; // general = Quỹ Gia Đình, doan = Quỹ Đoàn
  target_doan?: Doan; // Nếu scope = doan, trường này xác định đoàn nào
  category: string;
  description: string;
  performer: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: 'Sinh hoạt' | 'Trại' | 'Lễ' | 'Họp';
  participants_count: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  description?: string;
}

// Updated Skill Topics
export type SkillTopic = 
  | 'Morse' 
  | 'Semaphore' 
  | 'MatThu' 
  | 'NutDay' 
  | 'CuuThuong' 
  | 'DauDiDuong' 
  | 'PhatPhap' 
  | 'KienThucGDPT';

export interface QuizQuestion {
  id: string;
  topic?: SkillTopic; // Optional now, as it can be part of a Lesson
  question: string;
  image_url?: string; 
  options: string[];
  correct_answer: number; 
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'text' | 'video' | 'pdf';
  content: string; // HTML for text, URL for video/pdf
  duration: number; // minutes
  is_completed: boolean;
  quiz?: QuizQuestion[]; // Danh sách câu hỏi trắc nghiệm cuối bài
}

export interface Course {
  id: string;
  title: string;
  bac_hoc: string;
  lessons: Lesson[]; // Updated: Course contains actual lessons
  thumbnail_url: string;
  nganh_target?: Nganh[]; 
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  status: 'good' | 'damaged' | 'lost';
  last_check: string;
  image_url?: string;
}

export interface Achievement {
  id: string;
  doan_sinh_id: string;
  doan_sinh_name: string;
  type: 'bonus' | 'penalty';
  category: 'Chuyên cần' | 'Học tập' | 'Kỷ luật' | 'Hoạt động' | 'Khác';
  points: number;
  reason: string;
  date: string;
  event_id?: string; // Optional link to an event
  event_title?: string;
  is_verified: boolean; // Parent confirmation status
  verified_at?: string;
}

export interface CheckInRecord {
  id: string;
  doan_sinh_id: string;
  doan_sinh_name: string;
  timestamp: string;
  type: 'in' | 'out';
  method: 'qr' | 'manual';
  location: string;
  synced: boolean;
}
