
import React from 'react';
import CourseViewer from '../../components/education/CourseViewer';
import { MOCK_COURSES } from '../../lib/mockData';
import { Course } from '../../types';

const BacChanCung = () => {
  const courseData = MOCK_COURSES.find(c => c.bac_hoc === 'Chân Cứng') || {
      id: 'mock_chan_cung',
      title: 'Chương Trình Tu Học - Bậc Chân Cứng',
      bac_hoc: 'Chân Cứng',
      lessons: [],
      thumbnail_url: ''
  } as Course;

  return (
    <div className="p-4 md:p-6 h-full">
        <CourseViewer course={courseData} />
    </div>
  );
};

export default BacChanCung;
