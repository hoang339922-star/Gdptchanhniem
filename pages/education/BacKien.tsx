
import React from 'react';
import CourseViewer from '../../components/education/CourseViewer';
import { MOCK_COURSES } from '../../lib/mockData';
import { Course } from '../../types';

const BacKien = () => {
  const courseData = MOCK_COURSES.find(c => c.bac_hoc === 'Bậc Kiên') || {
      id: 'mock_bac_kien',
      title: 'Chương Trình Tu Học - Bậc Kiên',
      bac_hoc: 'Bậc Kiên',
      lessons: [],
      thumbnail_url: ''
  } as Course;

  return (
    <div className="p-4 md:p-6 h-full">
        <CourseViewer course={courseData} />
    </div>
  );
};

export default BacKien;
