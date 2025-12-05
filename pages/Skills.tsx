
import React, { useState } from 'react';
import { MOCK_QUIZZES } from '../lib/mockData';
import { SkillTopic, QuizQuestion } from '../types';
import SkillDashboard from '../components/skills/SkillDashboard';
import QuizGame from '../components/skills/QuizGame';
import SemaphoreLesson from '../components/skills/SemaphoreLesson';
import MorseLesson from '../components/skills/MorseLesson';
import TrailSignsLesson from '../components/skills/TrailSignsLesson';
import FirstAidLesson from '../components/skills/FirstAidLesson';
import KnotsLesson from '../components/skills/KnotsLesson';
import CipherLesson from '../components/skills/CipherLesson';
import GeneralSkillLesson from '../components/skills/GeneralSkillLesson';

const QUESTIONS_PER_SESSION = 20;

const Skills = () => {
  // Global State for Questions
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>(MOCK_QUIZZES);
  
  // Session State
  const [activeTopic, setActiveTopic] = useState<SkillTopic | null>(null);
  const [isQuizMode, setIsQuizMode] = useState(false); // true = quiz, false = study/menu (for specific lessons)
  
  // Quiz Session State
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>([]);

  // --- ACTIONS ---

  const handleTopicSelect = (topic: string) => {
    const selectedTopic = topic as SkillTopic;
    setActiveTopic(selectedTopic);
    
    // Always go to Lesson View first (Study Mode) for ALL topics now
    setIsQuizMode(false);
  };

  const startQuiz = (topic: SkillTopic = activeTopic!) => {
    // Logic: Filter -> Shuffle -> Slice to 20
    const topicQuestions = allQuestions.filter(q => q.topic === topic);
    const shuffled = [...topicQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, QUESTIONS_PER_SESSION);
    
    setSessionQuestions(selected);
    setIsQuizMode(true);
  };

  const handleAddQuestion = (newQ: QuizQuestion) => {
      setAllQuestions(prev => [...prev, newQ]);
  };

  // --- RENDERERS ---

  // 1. Dashboard (Main Menu)
  if (!activeTopic) {
    return (
        <SkillDashboard 
            allQuestions={allQuestions}
            onSelectTopic={handleTopicSelect}
            onAddQuestion={handleAddQuestion}
        />
    );
  }

  // 2. QUIZ MODE (Shared by all topics when user clicks "Start Quiz")
  if (isQuizMode) {
      return (
          <QuizGame 
              questions={sessionQuestions}
              topic={activeTopic}
              onExit={() => setActiveTopic(null)}
              onRetry={() => startQuiz(activeTopic)}
          />
      );
  }

  // 3. LESSON VIEWS (Study Mode)
  switch (activeTopic) {
      case 'Semaphore':
          return (
              <SemaphoreLesson 
                  onBack={() => setActiveTopic(null)}
                  onStartQuiz={() => startQuiz('Semaphore')}
              />
          );
      case 'Morse':
          return (
              <MorseLesson 
                  onBack={() => setActiveTopic(null)}
                  onStartQuiz={() => startQuiz('Morse')}
              />
          );
      case 'DauDiDuong':
          return (
              <TrailSignsLesson 
                  onBack={() => setActiveTopic(null)}
                  onStartQuiz={() => startQuiz('DauDiDuong')}
              />
          );
      case 'CuuThuong':
          return (
              <FirstAidLesson 
                  onBack={() => setActiveTopic(null)}
                  onStartQuiz={() => startQuiz('CuuThuong')}
              />
          );
      case 'NutDay':
          return (
              <KnotsLesson 
                  onBack={() => setActiveTopic(null)}
                  onStartQuiz={() => startQuiz('NutDay')}
              />
          );
      case 'MatThu':
          return (
              <CipherLesson 
                  onBack={() => setActiveTopic(null)}
                  onStartQuiz={() => startQuiz('MatThu')}
              />
          );
      case 'PhatPhap':
      case 'KienThucGDPT':
          return (
              <GeneralSkillLesson 
                  topic={activeTopic}
                  onBack={() => setActiveTopic(null)}
                  onStartQuiz={() => startQuiz(activeTopic)}
              />
          );
      default:
          // Fallback
          return (
              <div className="text-center p-10">
                  <p>Chủ đề này chưa có bài học chi tiết.</p>
                  <button onClick={() => startQuiz(activeTopic)} className="text-primary-600 underline">Vào thi ngay</button>
              </div>
          );
  }
};

export default Skills;
