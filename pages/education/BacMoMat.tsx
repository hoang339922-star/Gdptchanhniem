
import React from 'react';
import CourseViewer from '../../components/education/CourseViewer';
import { MOCK_COURSES } from '../../lib/mockData';
import { Course } from '../../types';

const BacMoMat = () => {
  // Trong thực tế, bạn sẽ fetch course theo ID hoặc slug từ DB
  // Ở đây tôi lấy mock data của khóa Mở Mắt (Giả sử ID '1' là Mở Mắt)
  const courseData = MOCK_COURSES.find(c => c.bac_hoc === 'Mở Mắt') || {
      id: 'mock_mo_mat',
      title: 'Chương Trình Tu Học - Bậc Mở Mắt',
      bac_hoc: 'Mở Mắt',
      lessons: [],
      thumbnail_url: ''
  } as Course;

  return (
    <div className="p-4 md:p-6 h-full">
        <CourseViewer course={courseData} />
    </div>
  );
};

export default BacMoMat;
