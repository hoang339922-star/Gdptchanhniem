
import React from 'react';
import CourseViewer from '../../components/education/CourseViewer';
import { MOCK_COURSES } from '../../lib/mockData';
import { Course } from '../../types';

const BacLuc = () => {
  const courseData = MOCK_COURSES.find(c => c.bac_hoc === 'Bậc Lực') || {
      id: 'mock_bac_luc',
      title: 'Chương Trình Tu Học - Bậc Lực',
      bac_hoc: 'Bậc Lực',
      lessons: [],
      thumbnail_url: ''
  } as Course;

  return (
    <div className="p-4 md:p-6 h-full">
        <CourseViewer course={courseData} />
    </div>
  );
};

export default BacLuc;
