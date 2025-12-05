
import React from 'react';
import CourseViewer from '../../components/education/CourseViewer';
import { MOCK_COURSES } from '../../lib/mockData';
import { Course } from '../../types';

const BacTungBay = () => {
  const courseData = MOCK_COURSES.find(c => c.bac_hoc === 'Tung Bay') || {
      id: 'mock_tung_bay',
      title: 'Chương Trình Tu Học - Bậc Tung Bay',
      bac_hoc: 'Tung Bay',
      lessons: [],
      thumbnail_url: ''
  } as Course;

  return (
    <div className="p-4 md:p-6 h-full">
        <CourseViewer course={courseData} />
    </div>
  );
};

export default BacTungBay;
