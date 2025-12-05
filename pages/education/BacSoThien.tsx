
import React from 'react';
import CourseViewer from '../../components/education/CourseViewer';
import { MOCK_COURSES } from '../../lib/mockData';
import { Course } from '../../types';

const BacSoThien = () => {
  const courseData = MOCK_COURSES.find(c => c.bac_hoc === 'Sơ Thiện') || {
      id: 'mock_so_thien',
      title: 'Chương Trình Tu Học - Bậc Sơ Thiện',
      bac_hoc: 'Sơ Thiện',
      lessons: [],
      thumbnail_url: ''
  } as Course;

  return (
    <div className="p-4 md:p-6 h-full">
        <CourseViewer course={courseData} />
    </div>
  );
};

export default BacSoThien;
