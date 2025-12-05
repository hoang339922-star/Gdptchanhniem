
import React from 'react';
import CourseViewer from '../../components/education/CourseViewer';
import { MOCK_COURSES } from '../../lib/mockData';
import { Course } from '../../types';

const BacHuongThien = () => {
  // Lấy mock data của khóa Hướng Thiện
  const courseData = MOCK_COURSES.find(c => c.bac_hoc === 'Hướng Thiện') || {
      id: 'mock_huong_thien',
      title: 'Chương Trình Tu Học - Bậc Hướng Thiện',
      bac_hoc: 'Hướng Thiện',
      lessons: [],
      thumbnail_url: ''
  } as Course;

  return (
    <div className="p-4 md:p-6 h-full">
        <CourseViewer course={courseData} />
    </div>
  );
};

export default BacHuongThien;
