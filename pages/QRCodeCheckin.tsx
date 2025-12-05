
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { 
  Camera, Wifi, WifiOff, RefreshCw, 
  CheckCircle, Clock, MapPin, User,
  Smartphone, History, QrCode as QrIcon, XCircle, AlertTriangle
} from 'lucide-react';
import { MOCK_DOAN_SINH, MOCK_CHECKIN_LOGS } from '../lib/mockData';
import { CheckInRecord, DoanSinh } from '../types';

const QRCodeCheckin = () => {
  const [activeTab, setActiveTab] = useState<'scan' | 'my-code' | 'history'>('scan');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [logs, setLogs] = useState<CheckInRecord[]>(MOCK_CHECKIN_LOGS);
  
  // Scanner States
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [scanResult, setScanResult] = useState<DoanSinh | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSimulateScan = () => {
    setScanning(true);
    setScanStatus('scanning');
    setScanResult(null); // Clear previous result
    
    // Simulate finding a random member after 1.5 seconds
    setTimeout(() => {
      // 30% chance of failure for demo purposes
      const isError = Math.random() < 0.3;

      if (isError) {
          setScanStatus('error');
          setScanResult(null);
          setToast({ 
            message: `Không tìm thấy mã QR hoặc mã không hợp lệ!`, 
            type: 'error' 
          });
      } else {
          const randomMember = MOCK_DOAN_SINH[Math.floor(Math.random() * MOCK_DOAN_SINH.length)];
          setScanResult(randomMember);
          setScanStatus('success');
          
          const newLog: CheckInRecord = {
            id: Date.now().toString(),
            doan_sinh_id: randomMember.id,
            doan_sinh_name: randomMember.full_name,
            timestamp: new Date().toISOString(),
            type: 'in',
            method: 'qr',
            location: 'Sân Chùa (Cổng 1)',
            synced: isOnline
          };
          
          setLogs([newLog, ...logs]);
          setToast({ 
            message: `Đã check-in thành công: ${randomMember.full_name}`, 
            type: 'success' 
          });

          // Simulate sending notification to parent
          console.log(`Sending SMS to ${randomMember.parent_phone}...`);
      }
      setScanning(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">QR Code Check-in</h2>
          <div className="flex items-center gap-2 mt-1">
             <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                 isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
             }`}>
                 {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
                 {isOnline ? 'Online - Đã đồng bộ' : 'Offline - Lưu cục bộ'}
             </span>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm w-full md:w-auto">
           <button 
             onClick={() => setActiveTab('scan')}
             className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
               activeTab === 'scan' ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
             }`}
           >
             <Camera size={16} /> Quét QR
           </button>
           <button 
             onClick={() => setActiveTab('my-code')}
             className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
               activeTab === 'my-code' ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
             }`}
           >
             <QrIcon size={16} /> Mã của tôi
           </button>
           <button 
             onClick={() => setActiveTab('history')}
             className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
               activeTab === 'history' ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
             }`}
           >
             <History size={16} /> Lịch sử
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Dynamic Content based on Tab */}
        <div className="lg:col-span-2">
            
            {/* --- SCAN TAB --- */}
            {activeTab === 'scan' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[500px] flex flex-col">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 dark:text-white">Máy quét Camera</h3>
                        <select className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 outline-none">
                            <option>Camera Sau (Mặc định)</option>
                            <option>Camera Trước</option>
                        </select>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-900 relative">
                        {/* Camera Viewport Simulation */}
                        <div className={`w-full max-w-sm aspect-square border-2 rounded-lg relative overflow-hidden bg-black transition-colors duration-300 ${
                            scanStatus === 'success' ? 'border-green-500' : 
                            scanStatus === 'error' ? 'border-red-500' : 'border-white/30'
                        }`}>
                            {scanning ? (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-b from-primary-500/20 to-transparent animate-pulse z-10"></div>
                                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] z-20 animate-[scan_2s_ease-in-out_infinite]"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-white/70 text-sm animate-pulse">Đang tìm mã QR...</p>
                                    </div>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                                    {scanStatus === 'success' ? (
                                        <div className="animate-bounce">
                                            <CheckCircle size={64} className="text-green-500" />
                                            <p className="text-green-500 font-bold mt-2">Quét thành công!</p>
                                        </div>
                                    ) : scanStatus === 'error' ? (
                                        <div className="animate-pulse">
                                            <XCircle size={64} className="text-red-500" />
                                            <p className="text-red-500 font-bold mt-2">Lỗi quét!</p>
                                        </div>
                                    ) : (
                                        <>
                                            <Camera size={48} className="mb-2 opacity-50" />
                                            <p className="text-sm">Camera đang tắt</p>
                                        </>
                                    )}
                                </div>
                            )}
                            
                            {/* Corner Markers */}
                            <div className={`absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 rounded-tl-lg transition-colors duration-300 ${
                                scanStatus === 'success' ? 'border-green-500' : scanStatus === 'error' ? 'border-red-500' : 'border-primary-500'
                            }`}></div>
                            <div className={`absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 rounded-tr-lg transition-colors duration-300 ${
                                scanStatus === 'success' ? 'border-green-500' : scanStatus === 'error' ? 'border-red-500' : 'border-primary-500'
                            }`}></div>
                            <div className={`absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 rounded-bl-lg transition-colors duration-300 ${
                                scanStatus === 'success' ? 'border-green-500' : scanStatus === 'error' ? 'border-red-500' : 'border-primary-500'
                            }`}></div>
                            <div className={`absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 rounded-br-lg transition-colors duration-300 ${
                                scanStatus === 'success' ? 'border-green-500' : scanStatus === 'error' ? 'border-red-500' : 'border-primary-500'
                            }`}></div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button 
                                onClick={handleSimulateScan}
                                disabled={scanning}
                                className="bg-primary-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:bg-primary-700 transition transform active:scale-95 disabled:opacity-50 flex items-center gap-2"
                            >
                                {scanning ? <RefreshCw className="animate-spin" size={20} /> : <Camera size={20} />}
                                {scanning ? 'Đang xử lý...' : 'Quét Giả Lập'}
                            </button>
                        </div>
                        <p className="mt-4 text-gray-400 text-xs max-w-xs text-center">
                            * Chế độ demo: Nhấn nút trên để mô phỏng việc quét (có 30% tỷ lệ lỗi để kiểm tra giao diện).
                        </p>
                    </div>
                </div>
            )}

            {/* --- MY CODE TAB --- */}
            {activeTab === 'my-code' && (
                 <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[500px] flex flex-col items-center justify-center p-8">
                     <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 text-center max-w-sm w-full">
                         <div className="mb-6 relative mx-auto w-fit">
                             <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-25"></div>
                             <div className="relative bg-white p-2 rounded-lg">
                                 <QRCode value="DS-001-TAMMINH" size={200} />
                             </div>
                         </div>
                         <h3 className="text-xl font-bold text-gray-900">Nguyễn Văn Tâm</h3>
                         <p className="text-primary-600 font-medium">PD. Tâm Minh</p>
                         <p className="text-gray-500 text-sm mt-1">Huynh Trưởng • Ngành Thanh</p>
                         
                         <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-left">
                             <div>
                                 <p className="text-xs text-gray-400 uppercase font-semibold">Mã số</p>
                                 <p className="text-gray-800 font-medium">HT-0012</p>
                             </div>
                             <div>
                                 <p className="text-xs text-gray-400 uppercase font-semibold">Đơn vị</p>
                                 <p className="text-gray-800 font-medium">GĐPT Chánh Niệm</p>
                             </div>
                         </div>
                     </div>
                     <p className="mt-6 text-gray-500 dark:text-gray-400 text-sm text-center max-w-md">
                         Sử dụng mã này để điểm danh tại cổng hoặc check-in các sự kiện của đơn vị.
                     </p>
                 </div>
            )}

            {/* --- HISTORY TAB --- */}
            {activeTab === 'history' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[500px]">
                     <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-800 dark:text-white">Lịch sử quét gần đây</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700/30 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Đoàn sinh</th>
                                    <th className="px-6 py-3">Thời gian</th>
                                    <th className="px-6 py-3">Loại</th>
                                    <th className="px-6 py-3">Địa điểm</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{log.doan_sinh_name}</td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(log.timestamp).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} • {new Date(log.timestamp).toLocaleDateString('vi-VN')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                                log.type === 'in' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                                {log.type === 'in' ? 'Vào' : 'Ra'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{log.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>

        {/* Right Column: Recent Info Panel */}
        <div className="space-y-6">
            {/* Last Scan Result Card */}
            <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border transition-all duration-300 ${
                scanStatus === 'success' 
                ? 'border-green-200 dark:border-green-900 ring-2 ring-green-100 dark:ring-green-900/20' 
                : scanStatus === 'error'
                ? 'border-red-200 dark:border-red-900 ring-2 ring-red-100 dark:ring-red-900/20'
                : 'border-gray-100 dark:border-gray-700'
            }`}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Kết quả quét</h3>
                
                {scanStatus === 'error' ? (
                     <div className="text-center py-6 animate-pulse">
                        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100 dark:border-red-900/50 text-red-500">
                            <AlertTriangle size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-red-600 dark:text-red-400">Không tìm thấy!</h4>
                        <p className="text-gray-500 text-sm mt-1">Mã QR không hợp lệ hoặc chưa được đăng ký.</p>
                     </div>
                ) : scanResult ? (
                    <div className="text-center animate-slide-up">
                        <div className="relative inline-block mb-3">
                            <img src={scanResult.avatar_url} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" />
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                                <CheckCircle size={14} />
                            </div>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">{scanResult.full_name}</h4>
                        <p className="text-primary-600 font-medium">{scanResult.phap_danh}</p>
                        <p className="text-gray-500 text-sm mt-1 mb-4">{scanResult.doan}</p>
                        
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-sm text-green-800 dark:text-green-300 mb-4">
                            <div className="flex items-center justify-center gap-2 font-medium mb-1">
                                <CheckCircle size={16} /> Điểm danh thành công
                            </div>
                            <div className="text-xs opacity-80">
                                {new Date().toLocaleTimeString()}
                            </div>
                        </div>

                        <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
                            <Smartphone size={12} />
                            Đã gửi thông báo đến {scanResult.parent_phone}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <QrIcon size={32} />
                        </div>
                        <p>Chưa có dữ liệu quét.</p>
                        <p className="text-xs mt-1">Sử dụng camera để quét mã QR của đoàn sinh.</p>
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Thống kê hôm nay</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Tổng lượt check-in</span>
                        <span className="font-bold text-gray-900 dark:text-white">{logs.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Đúng giờ</span>
                        <span className="font-bold text-green-600">{logs.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Đi trễ</span>
                        <span className="font-bold text-orange-600">0</span>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
                    <div className="flex justify-between items-center">
                         <span className="text-gray-500 text-sm flex items-center gap-1"><MapPin size={14}/> Địa điểm</span>
                         <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">Sân Chùa</span>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* Toast Notification */}
      {toast && (
          <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-xl text-white font-medium flex items-center gap-3 animate-slide-up z-50 border transition-all ${
              toast.type === 'success' 
              ? 'bg-green-600 border-green-500' 
              : 'bg-red-600 border-red-500'
          }`}>
              <div className={`p-1 rounded-full ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
              </div>
              <div className="flex flex-col">
                  <span className="font-bold text-sm uppercase">{toast.type === 'success' ? 'Thành công' : 'Thất bại'}</span>
                  <span className="text-sm opacity-90">{toast.message}</span>
              </div>
          </div>
      )}
    </div>
  );
};

export default QRCodeCheckin;
