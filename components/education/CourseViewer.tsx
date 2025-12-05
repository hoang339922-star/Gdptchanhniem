
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, FileText, CheckCircle, Clock, ChevronLeft, 
  Plus, X, Save, Video, AlignLeft, HelpCircle, ArrowRight,
  Lock, ArrowLeft, Award, Trash2, Edit, ListOrdered, Music, Youtube,
  Bold, Italic, Underline, List, Image as ImageIcon, Link as LinkIcon, 
  AlignLeft as AlignLeftIcon, AlignCenter, AlignRight, Undo, Redo, 
  Type, Eye, Play, Menu
} from 'lucide-react';
import { Course, Lesson, QuizQuestion, UserRole } from '../../types';
import { useAuthStore } from '../../store';
import { useNavigate } from 'react-router-dom';

interface CourseViewerProps {
  course: Course;
  onUpdateCourse?: (updatedCourse: Course) => void;
}

const CourseViewer: React.FC<CourseViewerProps> = ({ course: initialCourse, onUpdateCourse }) => {
  const { user, completedLessons, markLessonComplete } = useAuthStore();
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  
  // State for Course Data
  const [course, setCourse] = useState<Course>(initialCourse);

  // Mobile Menu State
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
      setCourse(initialCourse);
  }, [initialCourse]); 

  // Reset active lesson ONLY when course ID changes
  useEffect(() => {
      setActiveLesson(null);
  }, [initialCourse.id]);
  
  // Navigation State
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [viewMode, setViewMode] = useState<'content' | 'quiz'>('content');

  // Instructor Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Partial<Lesson>>({
    type: 'text',
    duration: 15,
    content: '',
    quiz: []
  });
  const [editTab, setEditTab] = useState<'content' | 'quiz'>('content'); 
  const [tempNewQuestion, setTempNewQuestion] = useState<Partial<QuizQuestion>>({
      options: ['', '', '', ''],
      correct_answer: 0
  });

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const isInstructor = user?.role === UserRole.HUYNH_TRUONG || user?.role === UserRole.GIA_TRUONG || user?.role === UserRole.ADMIN_ROOT;
  const isDoanSinh = user?.role === UserRole.DOAN_SINH;

  // --- ACCESS CONTROL CHECK ---
  const canAccessCourse = (() => {
      if (!user) return false;
      if (isInstructor) return true;
      if (isDoanSinh) {
          return user.bac_hoc === course.bac_hoc;
      }
      return false;
  })();

  // --- DYNAMIC COURSE STATE ---
  const mergedLessons = useMemo(() => {
      return course.lessons.map(lesson => ({
          ...lesson,
          is_completed: completedLessons.includes(lesson.id)
      }));
  }, [course.lessons, completedLessons]);

  // Auto-select first lesson
  useEffect(() => {
      if (canAccessCourse && mergedLessons.length > 0 && !activeLesson) {
          setActiveLesson(mergedLessons[0]);
          setViewMode('content');
      }
  }, [canAccessCourse, mergedLessons.length]);

  // Scroll to top when active lesson changes
  useEffect(() => {
      if (contentScrollRef.current) {
          contentScrollRef.current.scrollTop = 0;
      }
  }, [activeLesson]);

  const handleStartLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setViewMode('content'); // Luôn reset về tab nội dung
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizCompleted(false);
    setSelectedOption(null);
    setShowMobileMenu(false); // Đóng menu mobile khi chọn bài
  };

  const navigateLesson = (direction: 'next' | 'prev') => {
      if (!activeLesson) return;
      const currentIndex = mergedLessons.findIndex(l => l.id === activeLesson.id);
      
      if (direction === 'next' && currentIndex < mergedLessons.length - 1) {
          handleStartLesson(mergedLessons[currentIndex + 1]);
      } else if (direction === 'prev' && currentIndex > 0) {
          handleStartLesson(mergedLessons[currentIndex - 1]);
      }
  };

  // --- INSTRUCTOR ACTIONS ---
  const openAddLessonModal = () => {
      setEditingLesson({
          id: `l_new_${Date.now()}`,
          title: '',
          type: 'text',
          duration: 15,
          content: '',
          quiz: []
      });
      setEditTab('content');
      setIsEditModalOpen(true);
      setTimeout(() => {
          if (editorRef.current) {
              editorRef.current.innerHTML = '';
              editorRef.current.focus();
          }
      }, 100);
  };

  const openEditLessonModal = (lesson: Lesson, e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingLesson({ ...lesson });
      setEditTab('content');
      setIsEditModalOpen(true);
      setTimeout(() => {
          if (editorRef.current) {
              editorRef.current.innerHTML = lesson.content || '';
              editorRef.current.focus();
          }
      }, 100);
  };

  // --- WYSIWYG EDITOR LOGIC ---
  const execCmd = (command: string, value: string | undefined = undefined) => {
      document.execCommand(command, false, value);
      if (editorRef.current) {
          setEditingLesson(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
          editorRef.current.focus(); // Keep focus
      }
  };

  const handleEditorChange = () => {
      if (editorRef.current) {
          setEditingLesson(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
      }
  };

  const handleSaveLesson = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingLesson.title) return;

      const newLessonData = editingLesson as Lesson;
      if (editingLesson.type === 'text' && editorRef.current) {
          newLessonData.content = editorRef.current.innerHTML;
      }

      let newLessons = [...course.lessons];
      const existingIndex = newLessons.findIndex(l => l.id === newLessonData.id);
      if (existingIndex > -1) {
          newLessons[existingIndex] = newLessonData;
      } else {
          newLessons.push(newLessonData);
      }

      const updatedCourse = { ...course, lessons: newLessons };
      setCourse(updatedCourse);
      if (onUpdateCourse) onUpdateCourse(updatedCourse);
      
      if (activeLesson?.id === newLessonData.id) {
          setActiveLesson(newLessonData);
      }

      setIsEditModalOpen(false);
      // alert("Đã lưu bài học thành công!");
  };

  const handleDeleteLesson = (lessonId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!window.confirm("Bạn có chắc muốn xóa bài học này?")) return;

      const updatedCourse = {
          ...course,
          lessons: course.lessons.filter(l => l.id !== lessonId)
      };
      setCourse(updatedCourse);
      if (activeLesson?.id === lessonId) setActiveLesson(null);
  };

  // --- QUIZ MANAGEMENT ---
  const handleAddQuizQuestion = () => {
      if (!tempNewQuestion.question) return;
      const newQ: QuizQuestion = {
          id: `q_${Date.now()}`,
          question: tempNewQuestion.question,
          options: tempNewQuestion.options as string[],
          correct_answer: tempNewQuestion.correct_answer || 0,
          explanation: tempNewQuestion.explanation
      };
      
      setEditingLesson(prev => ({
          ...prev,
          quiz: [...(prev.quiz || []), newQ]
      }));
      setTempNewQuestion({ options: ['', '', '', ''], correct_answer: 0, question: '', explanation: '' });
  };

  const handleDeleteQuizQuestion = (qId: string) => {
      setEditingLesson(prev => ({
          ...prev,
          quiz: prev.quiz?.filter(q => q.id !== qId) || []
      }));
  };

  // --- STUDENT QUIZ LOGIC ---
  const handleQuizOptionSelect = (idx: number) => {
    if (selectedOption !== null) return; 
    setSelectedOption(idx);
    if (activeLesson?.quiz && idx === activeLesson.quiz[currentQuizIndex].correct_answer) {
       setQuizScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!activeLesson?.quiz) return;
    if (currentQuizIndex + 1 < activeLesson.quiz.length) {
       setCurrentQuizIndex(p => p + 1);
       setSelectedOption(null);
    } else {
       setQuizCompleted(true);
       if (!completedLessons.includes(activeLesson.id)) {
           markLessonComplete(activeLesson.id);
       }
    }
  };

  // Helper to render content based on type
  const renderContent = (lesson: Lesson) => {
      if (!lesson.content && lesson.type === 'text') {
          return (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <FileText size={48} className="mb-3 opacity-50 text-gray-300"/>
                  <p className="font-medium">Nội dung đang cập nhật...</p>
                  {isInstructor && <p className="text-xs mt-1 text-blue-500 cursor-pointer" onClick={(e) => openEditLessonModal(lesson, e)}>Bấm vào đây để soạn bài</p>}
              </div>
          );
      }

      if (lesson.type === 'video') {
          let src = lesson.content;
          let isYoutube = src.includes('youtube.com') || src.includes('youtu.be');
          if (isYoutube) {
              src = src.replace('watch?v=', 'embed/');
          } 
          
          return (
              <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative border border-gray-200 dark:border-gray-700">
                      <iframe width="100%" height="100%" src={src} title="Lesson Video" frameBorder="0" allowFullScreen></iframe>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
                      {isYoutube ? <Youtube size={16} className="text-red-600"/> : <Music size={16} className="text-purple-600"/>}
                      <span>{isYoutube ? 'Video bài giảng từ YouTube' : 'Nội dung đa phương tiện'}</span>
                  </div>
              </div>
          );
      } 
      if (lesson.type === 'pdf') {
          return (
              <div className="bg-gray-100 dark:bg-gray-700/50 p-12 text-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <FileText size={64} className="mx-auto mb-4 text-red-500"/>
                  <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">Tài liệu PDF</h3>
                  <p className="text-sm text-gray-500 mb-4 break-all">{lesson.content}</p>
                  <a href={lesson.content} target="_blank" className="bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition inline-flex items-center gap-2 font-medium">
                      <ArrowRight size={18}/> Mở tài liệu
                  </a>
              </div>
          );
      }
      
      // Render HTML Content (Text)
      return (
          <div 
            className="prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-100 leading-relaxed text-base md:text-lg font-serif" 
            dangerouslySetInnerHTML={{ __html: lesson.content }} 
          />
      );
  };

  if (!canAccessCourse) {
      return (
          <div className="h-[calc(100vh-6rem)] flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8 text-center animate-fade-in">
              <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                  <Lock size={48} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Truy cập bị hạn chế</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                  Nội dung này dành riêng cho bậc học <strong>{course.bac_hoc}</strong>.
              </p>
              <button onClick={() => navigate('/education')} className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary-700 transition">
                  Quay lại Menu Tu Học
              </button>
          </div>
      );
  }

  const completedCount = mergedLessons.filter(l => l.is_completed).length;
  const totalCount = mergedLessons.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Editor Toolbar Button Component
  const EditorButton = ({ onClick, icon: Icon, title, active = false }: any) => (
      <button 
          type="button"
          onMouseDown={(e) => { e.preventDefault(); onClick(); }} // Prevent focus loss
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${active ? 'bg-gray-300 dark:bg-gray-500' : ''}`}
          title={title}
      >
          <Icon size={18} className="text-gray-700 dark:text-gray-200" />
      </button>
  );

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-6 items-stretch overflow-hidden relative">
         
         {/* MOBILE MENU OVERLAY */}
         {showMobileMenu && (
             <div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
                onClick={() => setShowMobileMenu(false)}
             />
         )}

         {/* LEFT SIDEBAR: LESSON LIST (Responsive Drawer) */}
         <div className={`
            fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0 md:w-80 lg:w-96 md:shadow-md md:inset-auto md:h-full md:border border-gray-200 dark:border-gray-700 flex flex-col rounded-xl
            ${showMobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
         `}>
             <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0 flex justify-between items-start">
                 <div className="flex-1">
                    <button onClick={() => navigate('/education')} className="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1 mb-3 transition-colors font-medium">
                        <ChevronLeft size={16} /> Danh sách bậc học
                    </button>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-3">{course.title}</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide">
                            <span>Tiến độ</span>
                            <span>{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-green-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                 </div>
                 {/* Close Button for Mobile */}
                 <button 
                    onClick={() => setShowMobileMenu(false)}
                    className="md:hidden p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                 >
                     <X size={24} />
                 </button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
                 {mergedLessons.map((lesson, idx) => {
                     const isActive = activeLesson?.id === lesson.id;
                     const isLocked = !isInstructor && idx > 0 && !mergedLessons[idx - 1].is_completed;

                     return (
                         <div key={lesson.id} className="relative group">
                             <button 
                                type="button"
                                disabled={isLocked}
                                onClick={() => !isLocked && handleStartLesson(lesson)}
                                className={`w-full text-left p-3 pr-16 rounded-lg flex items-start gap-3 transition-all relative ${
                                    isActive 
                                    ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 shadow-sm' 
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                                } ${isLocked ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : ''}`}
                             >
                                 <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                                     lesson.is_completed 
                                     ? 'bg-green-100 border-green-200 text-green-600' 
                                     : isActive 
                                     ? 'bg-primary-600 border-primary-600 text-white'
                                     : 'bg-white border-gray-300 text-gray-500'
                                 }`}>
                                     {lesson.is_completed ? <CheckCircle size={14} /> : isLocked ? <Lock size={12} /> : idx + 1}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                     <h4 className={`text-sm font-semibold truncate leading-snug ${isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                         {lesson.title}
                                     </h4>
                                     <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                         <span className="flex items-center gap-1 bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-100 dark:border-gray-700">
                                             {lesson.type === 'video' ? <Video size={10}/> : lesson.type === 'pdf' ? <FileText size={10}/> : <AlignLeft size={10}/>}
                                             {lesson.type === 'video' ? 'Video' : lesson.type === 'pdf' ? 'PDF' : 'Bài đọc'}
                                         </span>
                                         <span>{lesson.duration}p</span>
                                     </div>
                                 </div>
                             </button>
                             
                             {/* Nút Xem Bài riêng biệt (chỉ hiện khi chưa active) */}
                             {!isLocked && !isActive && (
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleStartLesson(lesson); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-xs font-bold shadow-sm flex items-center gap-1 transition-colors"
                                >
                                    <Eye size={14} /> Xem
                                </button>
                             )}
                             
                             {isInstructor && (
                                <div className="absolute right-14 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 shadow-sm rounded-lg p-1 border border-gray-200 dark:border-gray-600 z-10">
                                    <button 
                                        type="button"
                                        onClick={(e) => openEditLessonModal(lesson, e)}
                                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit size={14} />
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={(e) => handleDeleteLesson(lesson.id, e)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"
                                        title="Xóa bài học"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                             )}
                         </div>
                     );
                 })}
                 
                 {isInstructor && (
                     <button 
                        type="button"
                        onClick={openAddLessonModal} 
                        className="w-full mt-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition flex items-center justify-center gap-2 text-sm font-medium"
                     >
                         <Plus size={16} /> Thêm bài học mới
                     </button>
                 )}
             </div>
         </div>

         {/* RIGHT MAIN: CONTENT VIEWER */}
         <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden relative">
             {activeLesson ? (
                 <>
                    {/* View Switcher Tabs & Mobile Menu Trigger */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0 sticky top-0 z-20">
                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setShowMobileMenu(true)}
                            className="md:hidden px-4 border-r border-gray-100 dark:border-gray-700 text-gray-500 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <Menu size={20} />
                        </button>

                        <button onClick={() => setViewMode('content')} className={`flex-1 py-3 md:py-4 text-xs md:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${viewMode === 'content' ? 'text-primary-600 border-primary-600 bg-primary-50/10' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
                            <BookOpen size={16} /> <span className="hidden sm:inline">Nội Dung Bài Học</span><span className="sm:hidden">Bài Học</span>
                        </button>
                        <button onClick={() => setViewMode('quiz')} className={`flex-1 py-3 md:py-4 text-xs md:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${viewMode === 'quiz' ? 'text-primary-600 border-primary-600 bg-primary-50/10' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
                            <HelpCircle size={16} /> <span className="hidden sm:inline">Bài Tập Trắc Nghiệm ({activeLesson.quiz?.length || 0})</span><span className="sm:hidden">Trắc Nghiệm</span>
                        </button>
                    </div>

                    <div ref={contentScrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-white dark:bg-gray-800 scroll-smooth custom-scrollbar">
                        {viewMode === 'content' ? (
                            <div className="max-w-4xl mx-auto h-full flex flex-col">
                                <div className="flex-1 space-y-6">
                                    <div className="pb-4 border-b border-gray-100 dark:border-gray-700">
                                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">{activeLesson.title}</h1>
                                        <div className="flex items-center gap-4 text-xs md:text-sm text-gray-500 mt-2">
                                            <span className="flex items-center gap-1"><Clock size={14}/> {activeLesson.duration} phút</span>
                                            {completedLessons.includes(activeLesson.id) && (
                                                <span className="flex items-center gap-1 text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full"><CheckCircle size={14}/> Đã hoàn thành</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Render Content - Thêm key để force re-render */}
                                    <div key={activeLesson.id}>
                                        {renderContent(activeLesson)}
                                    </div>

                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-3">
                                    <button onClick={() => navigateLesson('prev')} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition border border-gray-200 sm:border-transparent" disabled={mergedLessons.findIndex(l => l.id === activeLesson.id) === 0}>
                                        <ArrowLeft size={18} /> Bài trước
                                    </button>
                                    
                                    {!completedLessons.includes(activeLesson.id) && activeLesson.quiz && activeLesson.quiz.length > 0 ? (
                                        <button onClick={() => setViewMode('quiz')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg animate-pulse">
                                            Làm bài kiểm tra <ArrowRight size={20} />
                                        </button>
                                    ) : (
                                        <button onClick={() => navigateLesson('next')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg disabled:opacity-50 disabled:bg-gray-400" disabled={mergedLessons.findIndex(l => l.id === activeLesson.id) === mergedLessons.length - 1}>
                                            Bài tiếp theo <ArrowRight size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // QUIZ VIEW
                            <div className="max-w-3xl mx-auto py-6">
                                {activeLesson.quiz && activeLesson.quiz.length > 0 ? (
                                    quizCompleted ? (
                                        <div className="text-center py-8 md:py-12 animate-fade-in">
                                            <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Award size={48} />
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">Kết quả: {quizScore}/{activeLesson.quiz.length}</h3>
                                            <p className="text-gray-500 mb-8">Bạn đã hoàn thành bài tập trắc nghiệm.</p>
                                            
                                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                                <button onClick={() => { setQuizCompleted(false); setCurrentQuizIndex(0); setQuizScore(0); setSelectedOption(null); }} className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                                                    Làm lại
                                                </button>
                                                {!completedLessons.includes(activeLesson.id) ? (
                                                    <button onClick={() => { markLessonComplete(activeLesson.id); }} className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-bold shadow-lg">
                                                        Xác nhận hoàn thành bài
                                                    </button>
                                                ) : (
                                                    <button onClick={() => navigateLesson('next')} className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-bold shadow-lg">
                                                        Tiếp tục bài sau
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="animate-fade-in">
                                            <div className="mb-6 text-sm text-gray-500 flex justify-between items-center">
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">Câu {currentQuizIndex + 1}/{activeLesson.quiz.length}</span>
                                                <span className="font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded">{Math.round(((currentQuizIndex)/activeLesson.quiz.length)*100)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full mb-8">
                                                <div className="bg-primary-600 h-2 rounded-full transition-all duration-300" style={{width: `${((currentQuizIndex)/activeLesson.quiz.length)*100}%`}}></div>
                                            </div>
                                            
                                            <h3 className="text-lg md:text-xl font-bold mb-6 text-gray-900 dark:text-white leading-relaxed">{activeLesson.quiz[currentQuizIndex].question}</h3>
                                            
                                            <div className="space-y-3">
                                                {activeLesson.quiz[currentQuizIndex].options.map((opt, idx) => (
                                                    <button 
                                                        key={idx} 
                                                        disabled={selectedOption !== null} 
                                                        onClick={() => handleQuizOptionSelect(idx)} 
                                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                                                            selectedOption === idx 
                                                                ? (idx === activeLesson.quiz![currentQuizIndex].correct_answer 
                                                                    ? 'border-green-500 bg-green-50 text-green-800' 
                                                                    : 'border-red-500 bg-red-50 text-red-800') 
                                                                : 'border-gray-200 text-gray-700 hover:border-primary-500 dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-full border flex-shrink-0 flex items-center justify-center font-bold text-sm ${
                                                            selectedOption === idx 
                                                            ? (idx === activeLesson.quiz![currentQuizIndex].correct_answer ? 'border-green-600 bg-green-200 text-green-800' : 'border-red-600 bg-red-200 text-red-800')
                                                            : 'border-gray-300 text-gray-500'
                                                        }`}>
                                                            {String.fromCharCode(65 + idx)}
                                                        </div>
                                                        <span className="font-medium">{opt}</span>
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            {selectedOption !== null && (
                                                <div className="mt-8 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600 animate-slide-up">
                                                    <div className={`font-bold mb-2 ${selectedOption === activeLesson.quiz[currentQuizIndex].correct_answer ? 'text-green-600' : 'text-red-600'}`}>
                                                        {selectedOption === activeLesson.quiz[currentQuizIndex].correct_answer ? 'Chính xác! 🎉' : 'Chưa đúng! 😅'}
                                                    </div>
                                                    {activeLesson.quiz[currentQuizIndex].explanation && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{activeLesson.quiz[currentQuizIndex].explanation}</p>
                                                    )}
                                                    <div className="flex justify-end">
                                                        <button onClick={handleNextQuestion} className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition shadow-lg w-full sm:w-auto">
                                                            {currentQuizIndex + 1 === activeLesson.quiz.length ? 'Xem kết quả' : 'Câu tiếp theo'}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center text-gray-500 py-20">
                                        <HelpCircle size={64} className="mx-auto mb-4 opacity-20" />
                                        <p className="text-lg">Bài học này chưa có bài tập trắc nghiệm.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                 </>
             ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center relative">
                     
                     {/* Mobile Open Menu Button in Empty State */}
                     <button 
                        onClick={() => setShowMobileMenu(true)}
                        className="md:hidden absolute top-4 left-4 p-2 text-gray-500 hover:text-primary-600 bg-gray-100 rounded-lg"
                     >
                        <Menu size={24} />
                     </button>

                     <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                         <BookOpen size={40} className="opacity-50" />
                     </div>
                     <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Chào mừng bạn đến với khóa học</h3>
                     <p className="max-w-xs mt-2 text-gray-500">Vui lòng chọn một bài học từ danh sách bên trái (hoặc bấm Menu) để bắt đầu.</p>
                     
                     {mergedLessons.length > 0 && (
                         <button 
                            onClick={() => handleStartLesson(mergedLessons[0])}
                            className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg hover:bg-primary-700 transition flex items-center gap-2"
                         >
                             <Play size={20} fill="white" /> Bắt đầu học ngay
                         </button>
                     )}
                 </div>
             )}
         </div>

         {/* ADD/EDIT LESSON MODAL */}
         {isEditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-primary-600 text-white">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Edit size={20}/> {editingLesson.id?.includes('new') ? 'Thêm Bài Học Mới' : 'Chỉnh Sửa Bài Học'}
                        </h3>
                        <button onClick={() => setIsEditModalOpen(false)} className="text-white/80 hover:text-white bg-white/10 p-2 rounded-full"><X size={20}/></button>
                    </div>
                    
                    {/* Modal Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <button 
                            onClick={() => setEditTab('content')}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${editTab === 'content' ? 'border-primary-600 text-primary-600 bg-white dark:bg-gray-800' : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            <AlignLeft size={16} /> Nội Dung Bài Học
                        </button>
                        <button 
                            onClick={() => setEditTab('quiz')}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${editTab === 'quiz' ? 'border-primary-600 text-primary-600 bg-white dark:bg-gray-800' : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            <ListOrdered size={16} /> Ngân Hàng Câu Hỏi ({editingLesson.quiz?.length || 0})
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        {editTab === 'content' ? (
                            <form id="lesson-form" onSubmit={handleSaveLesson} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên bài học (*)</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={editingLesson.title || ''}
                                            onChange={e => setEditingLesson({...editingLesson, title: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loại hình</label>
                                        <select 
                                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={editingLesson.type}
                                            onChange={e => setEditingLesson({...editingLesson, type: e.target.value as any})}
                                        >
                                            <option value="text">Văn bản (Text/Markdown)</option>
                                            <option value="video">Video (YouTube/ZingMP3)</option>
                                            <option value="pdf">Tài liệu (PDF)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thời lượng (phút)</label>
                                        <input 
                                            type="number" 
                                            min="1"
                                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={editingLesson.duration || ''}
                                            onChange={e => setEditingLesson({...editingLesson, duration: Number(e.target.value)})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex justify-between">
                                        <span>
                                            {editingLesson.type === 'video' ? 'Link Video/Audio' : editingLesson.type === 'pdf' ? 'Link File PDF' : 'Nội dung bài học'}
                                        </span>
                                    </label>
                                    
                                    {/* WYSIWYG EDITOR - WORD STYLE */}
                                    {editingLesson.type === 'text' ? (
                                        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden flex flex-col h-[400px] shadow-sm bg-white dark:bg-gray-800">
                                            {/* Toolbar Ribbon */}
                                            <div className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 p-2 flex items-center gap-1 flex-wrap">
                                                <div className="flex bg-white dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500">
                                                    <EditorButton onClick={() => execCmd('undo')} icon={Undo} title="Hoàn tác" />
                                                    <EditorButton onClick={() => execCmd('redo')} icon={Redo} title="Làm lại" />
                                                </div>
                                                <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-2"></div>
                                                
                                                <div className="flex bg-white dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500">
                                                    <EditorButton onClick={() => execCmd('bold')} icon={Bold} title="In đậm" />
                                                    <EditorButton onClick={() => execCmd('italic')} icon={Italic} title="In nghiêng" />
                                                    <EditorButton onClick={() => execCmd('underline')} icon={Underline} title="Gạch chân" />
                                                </div>
                                                
                                                <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-2"></div>

                                                <div className="flex bg-white dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500">
                                                    <EditorButton onClick={() => execCmd('justifyLeft')} icon={AlignLeftIcon} title="Căn trái" />
                                                    <EditorButton onClick={() => execCmd('justifyCenter')} icon={AlignCenter} title="Căn giữa" />
                                                    <EditorButton onClick={() => execCmd('justifyRight')} icon={AlignRight} title="Căn phải" />
                                                </div>

                                                <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-2"></div>

                                                <div className="flex bg-white dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500">
                                                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', 'H3'); }} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-500 font-bold text-gray-700 dark:text-gray-200 text-sm" title="Tiêu đề lớn">H1</button>
                                                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', 'H4'); }} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-500 font-semibold text-gray-700 dark:text-gray-200 text-sm" title="Tiêu đề nhỏ">H2</button>
                                                </div>

                                                <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-2"></div>

                                                <div className="flex bg-white dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500">
                                                    <EditorButton onClick={() => execCmd('insertOrderedList')} icon={ListOrdered} title="Danh sách số" />
                                                    <EditorButton onClick={() => execCmd('insertUnorderedList')} icon={List} title="Danh sách chấm" />
                                                </div>
                                            </div>
                                            
                                            {/* Editor Area (ContentEditable) */}
                                            <div 
                                                ref={editorRef}
                                                contentEditable={true}
                                                onInput={handleEditorChange}
                                                className="w-full flex-1 p-6 dark:text-white text-gray-900 outline-none overflow-y-auto prose dark:prose-invert max-w-none text-lg font-serif"
                                                style={{ minHeight: '300px' }}
                                            ></div>
                                        </div>
                                    ) : (
                                        <textarea 
                                            required
                                            rows={5}
                                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                            placeholder={editingLesson.type === 'video' ? 'Ví dụ: https://www.youtube.com/watch?v=...' : 'Nhập link file PDF...'}
                                            value={editingLesson.content || ''}
                                            onChange={e => setEditingLesson({...editingLesson, content: e.target.value})}
                                        ></textarea>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                {/* Add New Question Form */}
                                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                                    <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2"><Plus size={16}/> Thêm câu hỏi trắc nghiệm</h4>
                                    <div className="space-y-3">
                                        <input 
                                            type="text" 
                                            placeholder="Nhập câu hỏi..."
                                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={tempNewQuestion.question || ''}
                                            onChange={e => setTempNewQuestion({...tempNewQuestion, question: e.target.value})}
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            {[0, 1, 2, 3].map(idx => (
                                                <div key={idx} className="flex gap-2 items-center">
                                                    <input 
                                                        type="radio" 
                                                        name="correct_ans"
                                                        checked={tempNewQuestion.correct_answer === idx}
                                                        onChange={() => setTempNewQuestion({...tempNewQuestion, correct_answer: idx})}
                                                    />
                                                    <input 
                                                        type="text"
                                                        placeholder={`Đáp án ${String.fromCharCode(65+idx)}`}
                                                        className="flex-1 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:text-white"
                                                        value={tempNewQuestion.options?.[idx] || ''}
                                                        onChange={e => {
                                                            const newOpts = [...(tempNewQuestion.options || [])];
                                                            newOpts[idx] = e.target.value;
                                                            setTempNewQuestion({...tempNewQuestion, options: newOpts});
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="Giải thích (Tùy chọn)..."
                                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                                            value={tempNewQuestion.explanation || ''}
                                            onChange={e => setTempNewQuestion({...tempNewQuestion, explanation: e.target.value})}
                                        />
                                        <button 
                                            type="button"
                                            onClick={handleAddQuizQuestion}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 w-full"
                                        >
                                            Thêm vào ngân hàng đề
                                        </button>
                                    </div>
                                </div>

                                {/* List Existing Questions */}
                                <div className="space-y-3">
                                    {editingLesson.quiz?.map((q, idx) => (
                                        <div key={q.id} className="p-3 border rounded-lg bg-white dark:bg-gray-800 relative group hover:shadow-md transition-all">
                                            <div className="font-bold text-sm mb-1 pr-8 text-gray-800 dark:text-white">Câu {idx + 1}: {q.question}</div>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
                                                {q.options.map((opt, oIdx) => (
                                                    <span key={oIdx} className={oIdx === q.correct_answer ? 'text-green-600 font-bold' : ''}>
                                                        {String.fromCharCode(65+oIdx)}. {opt}
                                                    </span>
                                                ))}
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteQuizQuestion(q.id)}
                                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {(!editingLesson.quiz || editingLesson.quiz.length === 0) && (
                                        <p className="text-center text-gray-400 text-sm italic">Chưa có câu hỏi nào.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="button"
                            onClick={handleSaveLesson}
                            className="px-6 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700"
                        >
                            Lưu Bài Học
                        </button>
                    </div>
                </div>
            </div>
         )}
    </div>
  );
};

export default CourseViewer;
