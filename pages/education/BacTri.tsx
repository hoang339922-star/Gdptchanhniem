
import React from 'react';
import CourseViewer from '../../components/education/CourseViewer';
import { MOCK_COURSES } from '../../lib/mockData';
import { Course } from '../../types';

const BacTri = () => {
  const courseData = MOCK_COURSES.find(c => c.bac_hoc === 'Bậc Trì') || {
      id: 'mock_bac_tri',
      title: 'Chương Trình Tu Học - Bậc Trì',
      bac_hoc: 'Bậc Trì',
      lessons: [],
      thumbnail_url: ''
  } as Course;

  return (
    <div className="p-4 md:p-6 h-full">
        <CourseViewer course={courseData} />
    </div>
  );
};

export default BacTri;
