
import React from 'react';
import CourseViewer from '../../components/education/CourseViewer';
import { MOCK_COURSES } from '../../lib/mockData';
import { Course } from '../../types';

const BacTrungThien = () => {
  const courseData = MOCK_COURSES.find(c => c.bac_hoc === 'Trung Thiện') || {
      id: 'mock_trung_thien',
      title: 'Chương Trình Tu Học - Bậc Trung Thiện',
      bac_hoc: 'Trung Thiện',
      lessons: [],
      thumbnail_url: ''
  } as Course;

  return (
    <div className="p-4 md:p-6 h-full">
        <CourseViewer course={courseData} />
    </div>
  );
};

export default BacTrungThien;
