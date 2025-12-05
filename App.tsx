
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Attendance from './pages/Attendance';
import Education from './pages/Education';
import Finance from './pages/Finance';
import Events from './pages/Events';
import Inventory from './pages/Inventory';
import Achievements from './pages/Achievements';
import GoodDeeds from './pages/GoodDeeds';
import Settings from './pages/Settings';
import Resources from './pages/Resources';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Skills from './pages/Skills';
import Reports from './pages/Reports';
import { useAuthStore } from './store';

// Import các file Bậc học - Ngành Đồng
import BacMoMat from './pages/education/BacMoMat';
import BacCanhMem from './pages/education/BacCanhMem';
import BacChanCung from './pages/education/BacChanCung';
import BacTungBay from './pages/education/BacTungBay';

// Import các file Bậc học - Ngành Thiếu
import BacHuongThien from './pages/education/BacHuongThien';
import BacSoThien from './pages/education/BacSoThien';
import BacTrungThien from './pages/education/BacTrungThien';
import BacChanhThien from './pages/education/BacChanhThien';

// Import các file Bậc học - Huynh Trưởng
import BacKien from './pages/education/BacKien';
import BacTri from './pages/education/BacTri';
import BacDinh from './pages/education/BacDinh';
import BacLuc from './pages/education/BacLuc';

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="reports" element={<Reports />} />
          <Route path="resources" element={<Resources />} />
          <Route path="good-deeds" element={<GoodDeeds />} />
          
          {/* Education Routes - Main Menu */}
          <Route path="education" element={<Education />} />
          
          {/* Education Routes - Ngành Đồng */}
          <Route path="education/mo-mat" element={<BacMoMat />} />
          <Route path="education/canh-mem" element={<BacCanhMem />} />
          <Route path="education/chan-cung" element={<BacChanCung />} />
          <Route path="education/tung-bay" element={<BacTungBay />} />

          {/* Education Routes - Ngành Thiếu */}
          <Route path="education/huong-thien" element={<BacHuongThien />} />
          <Route path="education/so-thien" element={<BacSoThien />} />
          <Route path="education/trung-thien" element={<BacTrungThien />} />
          <Route path="education/chanh-thien" element={<BacChanhThien />} />

          {/* Education Routes - Huynh Trưởng */}
          <Route path="education/kien" element={<BacKien />} />
          <Route path="education/tri" element={<BacTri />} />
          <Route path="education/dinh" element={<BacDinh />} />
          <Route path="education/luc" element={<BacLuc />} />

          <Route path="education/*" element={<div className="p-8 text-center text-gray-500">Nội dung đang được cập nhật...</div>} />

          <Route path="skills" element={<Skills />} />
          <Route path="finance" element={<Finance />} />
          <Route path="events" element={<Events />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="settings" element={<Settings />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
