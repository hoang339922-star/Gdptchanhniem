
import React from 'react';
import CourseViewer from '../../components/education/CourseViewer';
import { MOCK_COURSES } from '../../lib/mockData';
import { Course } from '../../types';

const BacCanhMem = () => {
  const courseData = MOCK_COURSES.find(c => c.bac_hoc === 'Cánh Mềm') || {
      id: 'mock_canh_mem',
      title: 'Chương Trình Tu Học - Bậc Cánh Mềm',
      bac_hoc: 'Cánh Mềm',
      lessons: [],
      thumbnail_url: ''
  } as Course;

  return (
    <div className="p-4 md:p-6 h-full">
        <CourseViewer course={courseData} />
    </div>
  );
};

export default BacCanhMem;
