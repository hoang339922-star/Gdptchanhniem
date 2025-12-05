
import React, { useState } from 'react';
import { Mail, Clock, Play, CheckCircle, AlertCircle, Eye, Settings, Calendar, UserX, TrendingUp, Send, X } from 'lucide-react';
import { MOCK_DOAN_SINH, MOCK_ATTENDANCE, MOCK_EVENTS, MOCK_TRANSACTIONS } from '../../lib/mockData';
import { Doan, UserRole } from '../../types';
import { useAuthStore } from '../../store';

type ReportType = 'over_age' | 'absenteeism' | 'activity_summary';

interface AutomationJob {
    id: string;
    type: ReportType;
    title: string;
    description: string;
    frequency: 'Hàng ngày' | 'Hàng tuần' | 'Hàng tháng';
    recipients: string[];
    lastRun: string | null;
    status: 'active' | 'paused';
    icon: any;
    color: string;
}

const EmailAutomation = () => {
    const { user } = useAuthStore();
    
    // Mock Configuration State
    const [jobs, setJobs] = useState<AutomationJob[]>([
        {
            id: 'job_1',
            type: 'over_age',
            title: 'Cảnh báo Đoàn sinh quá tuổi',
            description: 'Danh sách các em đã vượt quá độ tuổi quy định của Đoàn hiện tại.',
            frequency: 'Hàng tháng',
            recipients: ['bht@gdpt.vn', 'lien-doan-truong@gdpt.vn'],
            lastRun: '2023-10-01',
            status: 'active',
            icon: Calendar,
            color: 'bg-orange-100 text-orange-600'
        },
        {
            id: 'job_2',
            type: 'absenteeism',
            title: 'Báo cáo Vắng sinh hoạt',
            description: 'Danh sách đoàn sinh vắng mặt liên tiếp hoặc tỷ lệ chuyên cần thấp.',
            frequency: 'Hàng tuần',
            recipients: ['thu-ky@gdpt.vn', 'huynh-truong-cac-doan@gdpt.vn'],
            lastRun: '2023-10-22',
            status: 'active',
            icon: UserX,
            color: 'bg-red-100 text-red-600'
        },
        {
            id: 'job_3',
            type: 'activity_summary',
            title: 'Tổng hợp Tình hình sinh hoạt',
            description: 'Thống kê số lượng tham gia, tài chính và sự kiện trong kỳ.',
            frequency: 'Hàng tháng',
            recipients: ['ban-quan-tri@gdpt.vn'],
            lastRun: null,
            status: 'paused',
            icon: TrendingUp,
            color: 'bg-blue-100 text-blue-600'
        }
    ]);

    const [previewContent, setPreviewContent] = useState<{subject: string, body: React.ReactNode} | null>(null);
    const [isSending, setIsSending] = useState(false);

    // --- REPORT GENERATION LOGIC ---

    const generateOverAgeReport = () => {
        const today = new Date();
        const currentYear = today.getFullYear();
        
        const data = MOCK_DOAN_SINH.map(ds => {
            const birthYear = new Date(ds.birth_date).getFullYear();
            const age = currentYear - birthYear;
            let isOver = false;
            let limit = 0;
            
            // Logic giả định: Oanh Vũ > 12 tuổi, Thiếu > 18 tuổi
            if (ds.doan.includes('Oanh Vũ') && age > 12) { isOver = true; limit = 12; }
            else if (ds.doan.includes('Thiếu') && age > 18) { isOver = true; limit = 18; }
            
            return isOver ? { ...ds, age, limit } : null;
        }).filter(Boolean) as any[];

        return {
            subject: `[GĐPT] Cảnh báo Đoàn sinh quá tuổi - Tháng ${today.getMonth() + 1}/${currentYear}`,
            body: (
                <div className="space-y-4 text-gray-800 dark:text-gray-200">
                    <p className="text-gray-800 dark:text-gray-200">Kính gửi Ban Huynh Trưởng,</p>
                    <p className="text-gray-800 dark:text-gray-200">Hệ thống xin gửi danh sách các đoàn sinh đã vượt quá độ tuổi quy định của ngành:</p>
                    
                    {data.length > 0 ? (
                        <div className="overflow-hidden border border-gray-300 dark:border-gray-600 rounded-lg">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                                    <tr>
                                        <th className="p-3 text-left border-b border-gray-300 dark:border-gray-600 font-bold">Họ tên</th>
                                        <th className="p-3 text-left border-b border-gray-300 dark:border-gray-600 font-bold">Pháp danh</th>
                                        <th className="p-3 text-left border-b border-gray-300 dark:border-gray-600 font-bold">Đoàn</th>
                                        <th className="p-3 text-center border-b border-gray-300 dark:border-gray-600 font-bold">Tuổi</th>
                                        <th className="p-3 text-center border-b border-gray-300 dark:border-gray-600 font-bold">Giới hạn</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                    {data.map(d => (
                                        <tr key={d.id}>
                                            <td className="p-3 border-r border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">{d.full_name}</td>
                                            <td className="p-3 border-r border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">{d.phap_danh}</td>
                                            <td className="p-3 border-r border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">{d.doan}</td>
                                            <td className="p-3 text-center font-bold text-red-600 border-r border-gray-200 dark:border-gray-700">{d.age}</td>
                                            <td className="p-3 text-center text-gray-900 dark:text-gray-100">{d.limit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="italic text-green-600 bg-green-50 p-3 rounded border border-green-200">
                            <CheckCircle size={16} className="inline mr-1"/> Hiện tại không có đoàn sinh nào quá tuổi quy định.
                        </p>
                    )}
                    
                    <p className="mt-4 text-gray-800 dark:text-gray-200">Đề nghị các Huynh trưởng đoàn xem xét làm lễ lên đoàn cho các em.</p>
                </div>
            )
        };
    };

    const generateAbsentReport = () => {
        const stats: Record<string, number> = {};
        MOCK_ATTENDANCE.forEach(rec => {
            if (rec.status === 'absent') {
                stats[rec.doan_sinh_id] = (stats[rec.doan_sinh_id] || 0) + 1;
            }
        });

        const data = MOCK_DOAN_SINH.map(ds => ({
            ...ds,
            absentCount: stats[ds.id] || 0
        })).filter(ds => ds.absentCount > 0).sort((a,b) => b.absentCount - a.absentCount);

        return {
            subject: `[GĐPT] Báo cáo Vắng sinh hoạt - Tuần ${getWeekNumber(new Date())}`,
            body: (
                <div className="space-y-4 text-gray-800 dark:text-gray-200">
                    <p className="text-gray-800 dark:text-gray-200">Kính gửi Ban Huynh Trưởng và Thư Ký,</p>
                    <p className="text-gray-800 dark:text-gray-200">Thống kê danh sách đoàn sinh vắng mặt nhiều trong thời gian qua:</p>
                    {data.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-2 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                            {data.map(d => (
                                <li key={d.id}>
                                    <strong>{d.full_name}</strong> ({d.doan}): Vắng <span className="text-red-600 font-bold">{d.absentCount}</span> buổi.
                                    <br/><span className="text-gray-500 text-xs">Phụ huynh: {d.parent_name} - SĐT: {d.parent_phone}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="italic text-green-600 bg-green-50 p-3 rounded border border-green-200">
                            <CheckCircle size={16} className="inline mr-1"/> Tình hình chuyên cần rất tốt, không có ai vắng nhiều.
                        </p>
                    )}
                    <p className="text-gray-800 dark:text-gray-200">Đề nghị Huynh trưởng đoàn liên hệ thăm hỏi gia đình.</p>
                </div>
            )
        };
    };

    const generateActivityReport = () => {
        const totalFunds = MOCK_TRANSACTIONS.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
        const upcomingEvents = MOCK_EVENTS.filter(e => e.status === 'upcoming');
        
        return {
            subject: `[GĐPT] Tổng hợp tình hình sinh hoạt tháng`,
            body: (
                <div className="space-y-4 text-gray-800 dark:text-gray-200">
                    <p className="text-gray-800 dark:text-gray-200">Kính gửi Ban Quản Trị,</p>
                    <p className="text-gray-800 dark:text-gray-200">Báo cáo tóm tắt tình hình hoạt động của đơn vị:</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                            <h4 className="font-bold text-blue-800 dark:text-blue-300">Nhân sự</h4>
                            <p className="text-gray-800 dark:text-gray-200">Tổng số: {MOCK_DOAN_SINH.length} đoàn sinh</p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                            <h4 className="font-bold text-green-800 dark:text-green-300">Tài chính</h4>
                            <p className="text-gray-800 dark:text-gray-200">Quỹ hiện tại: {totalFunds.toLocaleString('vi-VN')} đ</p>
                        </div>
                    </div>

                    <h4 className="font-bold mt-4 border-b dark:border-gray-700 pb-1 text-gray-800 dark:text-gray-200">Sự kiện sắp tới:</h4>
                    {upcomingEvents.length > 0 ? (
                        <ul className="list-decimal pl-5 text-gray-800 dark:text-gray-200">
                            {upcomingEvents.map(e => (
                                <li key={e.id}>{e.title} ({new Date(e.date).toLocaleDateString('vi-VN')})</li>
                            ))}
                        </ul>
                    ) : <p className="italic text-gray-500">Không có sự kiện sắp tới.</p>}
                </div>
            )
        };
    };

    // Helper to get week number
    function getWeekNumber(d: Date) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        var weekNo = Math.ceil(( ( (d.valueOf() - yearStart.valueOf()) / 86400000) + 1)/7);
        return weekNo;
    }

    const handleRunNow = (job: AutomationJob) => {
        let content;
        switch(job.type) {
            case 'over_age': content = generateOverAgeReport(); break;
            case 'absenteeism': content = generateAbsentReport(); break;
            case 'activity_summary': content = generateActivityReport(); break;
        }
        setPreviewContent(content || null);
    };

    const handleSendEmail = () => {
        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            setPreviewContent(null);
            alert("Đã gửi email báo cáo thành công!");
        }, 1500);
    };

    const toggleStatus = (id: string) => {
        setJobs(jobs.map(j => j.id === id ? { ...j, status: j.status === 'active' ? 'paused' : 'active' } : j));
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Mail className="text-primary-600" /> Cấu hình gửi báo cáo tự động
                    </h3>
                    <button className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                        <Settings size={14} /> Cài đặt SMTP
                    </button>
                </div>

                <div className="space-y-4">
                    {jobs.map(job => (
                        <div key={job.id} className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 hover:border-primary-300 transition-colors">
                            <div className={`p-3 rounded-full ${job.color} flex-shrink-0`}>
                                <job.icon size={24} />
                            </div>
                            
                            <div className="flex-1 text-center md:text-left">
                                <h4 className="font-bold text-gray-900 dark:text-white">{job.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{job.description}</p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-1 rounded border dark:border-gray-600">
                                        <Clock size={12} /> {job.frequency}
                                    </span>
                                    <span className="flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-1 rounded border dark:border-gray-600">
                                        <Mail size={12} /> {job.recipients.length} người nhận
                                    </span>
                                    {job.lastRun && (
                                        <span className="flex items-center gap-1 text-green-600">
                                            <CheckCircle size={12} /> Chạy lần cuối: {new Date(job.lastRun).toLocaleDateString('vi-VN')}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => toggleStatus(job.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                        job.status === 'active' 
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                                >
                                    {job.status === 'active' ? 'Đang chạy' : 'Tạm dừng'}
                                </button>
                                <button 
                                    onClick={() => handleRunNow(job)}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 shadow-md hover:shadow-lg transition-all"
                                >
                                    <Play size={16} /> Chạy ngay
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Email Preview Modal */}
            {previewContent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <Eye size={18} className="text-blue-600" /> Xem trước Email
                            </h3>
                            <button onClick={() => setPreviewContent(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={20} /></button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-900/50">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Subject</p>
                                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">{previewContent.subject}</h4>
                                </div>
                                <div className="p-6 text-gray-800 dark:text-gray-200 leading-relaxed font-serif text-base">
                                    {previewContent.body}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-3">
                            <button 
                                onClick={() => setPreviewContent(null)}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
                            >
                                Đóng
                            </button>
                            <button 
                                onClick={handleSendEmail}
                                disabled={isSending}
                                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSending ? 'Đang gửi...' : <><Send size={18} /> Gửi Báo Cáo</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailAutomation;
