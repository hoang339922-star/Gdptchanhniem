
import { create } from 'zustand';
import { User, UserRole, Doan, Nganh } from './types';

// Mock Users for different roles
export const MOCK_USERS_DB: Record<string, User> = {
  'admin': {
    id: 'admin_1',
    email: 'giatruong@gdpt.vn',
    full_name: 'Nguyễn Văn Tâm',
    phap_danh: 'Tâm Minh',
    role: UserRole.GIA_TRUONG, // Xem hết
    avatar_url: 'https://ui-avatars.com/api/?name=Tam+Minh&background=0D8ABC&color=fff',
  },
  'ov_nam': {
    id: 'ht_1',
    email: 'ht_ov_nam@gdpt.vn',
    full_name: 'Lê Văn Hùng',
    phap_danh: 'Thiện Dũng',
    role: UserRole.HUYNH_TRUONG,
    doan: Doan.OANH_VU_NAM, // Chỉ xem Oanh Vũ Nam
    nganh: Nganh.DONG,
    avatar_url: 'https://ui-avatars.com/api/?name=Thien+Dung&background=FFC000&color=fff',
  },
  'thieu_nu': {
    id: 'ht_2',
    email: 'ht_thieu_nu@gdpt.vn',
    full_name: 'Trần Thị Mai',
    phap_danh: 'Diệu Thảo',
    role: UserRole.HUYNH_TRUONG,
    doan: Doan.THIEU_NU, // Chỉ xem Thiếu Nữ
    nganh: Nganh.THIEU,
    avatar_url: 'https://ui-avatars.com/api/?name=Dieu+Thao&background=E91E63&color=fff',
  },
  'doan_sinh': { // Oanh Vũ
    id: '1', // Matches ID in MOCK_DOAN_SINH (Trần Văn An)
    email: 'ds_an@gdpt.vn',
    full_name: 'Trần Văn An',
    phap_danh: 'Minh Tánh',
    role: UserRole.DOAN_SINH,
    doan: Doan.OANH_VU_NAM,
    bac_hoc: 'Mở Mắt', // Bậc học cụ thể
    avatar_url: 'https://picsum.photos/200?1',
  },
  'thieu_sinh': { // Thiếu Nam - Để test Hướng Thiện
    id: '3', // Matches ID in MOCK_DOAN_SINH (Nguyễn Quốc Cường)
    email: 'ds_cuong@gdpt.vn',
    full_name: 'Nguyễn Quốc Cường',
    phap_danh: 'Quảng Đức',
    role: UserRole.DOAN_SINH,
    doan: Doan.THIEU_NAM,
    bac_hoc: 'Hướng Thiện', // Bậc học cụ thể
    avatar_url: 'https://picsum.photos/200?3',
  }
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  // Helper to check access to a specific Doan (Group)
  canAccessDoan: (targetDoan: Doan) => boolean;
  // Helper to check access to a specific Member Profile
  canAccessMember: (memberId: string, memberDoan: Doan) => boolean;
  
  // Event Registration
  registeredEventIds: string[];
  registerEvent: (eventId: string) => void;

  // Education Progress
  completedLessons: string[];
  markLessonComplete: (lessonId: string) => void;
}

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null, 
  isAuthenticated: false,
  registeredEventIds: [],
  completedLessons: ['l1_mm', 'ht_01'], // Mock dữ liệu đã học: Bài 1 Mở Mắt và Bài 1 Hướng Thiện
  
  login: (user) => {
    set({ user, isAuthenticated: true, registeredEventIds: [] });
  },
  logout: () => set({ user: null, isAuthenticated: false, registeredEventIds: [], completedLessons: [] }),
  
  registerEvent: (eventId) => set((state) => ({ 
    registeredEventIds: [...state.registeredEventIds, eventId] 
  })),

  markLessonComplete: (lessonId) => set((state) => {
    if (state.completedLessons.includes(lessonId)) return state;
    return { completedLessons: [...state.completedLessons, lessonId] };
  }),

  canAccessDoan: (targetDoan: Doan) => {
    const { user } = get();
    if (!user) return false;
    
    // Đoàn sinh không có quyền xem thông tin cấp Đoàn (trả về false cho các view quản lý)
    if (user.role === UserRole.DOAN_SINH) return false;

    // Admin, Gia Trưởng, Liên Đoàn Trưởng thấy hết các Đoàn
    if (
      user.role === UserRole.ADMIN_ROOT || 
      user.role === UserRole.GIA_TRUONG || 
      user.role === UserRole.LIEN_DOAN_TRUONG
    ) {
      return true;
    }

    // Huynh trưởng CHỈ thấy đoàn của mình phụ trách
    // So sánh chính xác Enum Doan
    if (user.role === UserRole.HUYNH_TRUONG) {
        return user.doan === targetDoan;
    }

    return false;
  },

  canAccessMember: (memberId: string, memberDoan: Doan) => {
    const { user } = get();
    if (!user) return false;

    // Admin thấy hết
    if (
        user.role === UserRole.ADMIN_ROOT || 
        user.role === UserRole.GIA_TRUONG || 
        user.role === UserRole.LIEN_DOAN_TRUONG
    ) {
        return true;
    }

    // Đoàn sinh chỉ thấy chính mình
    if (user.role === UserRole.DOAN_SINH) {
        return user.id === memberId;
    }

    // Huynh trưởng chỉ thấy đoàn sinh nằm trong đoàn mình phụ trách
    if (user.role === UserRole.HUYNH_TRUONG) {
        return user.doan === memberDoan;
    }

    return false;
  }
}));

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  darkMode: false,
  toggleDarkMode: () => {
    set((state) => {
      const newMode = !state.darkMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { darkMode: newMode };
    });
  },
}));
