
import React from 'react';
import CourseViewer from '../../components/education/CourseViewer';
import { MOCK_COURSES } from '../../lib/mockData';
import { Course } from '../../types';

const BacChanhThien = () => {
  const courseData = MOCK_COURSES.find(c => c.bac_hoc === 'Chánh Thiện') || {
      id: 'mock_chanh_thien',
      title: 'Chương Trình Tu Học - Bậc Chánh Thiện',
      bac_hoc: 'Chánh Thiện',
      lessons: [],
      thumbnail_url: ''
  } as Course;

  return (
    <div className="p-4 md:p-6 h-full">
        <CourseViewer course={courseData} />
    </div>
  );
};

export default BacChanhThien;
