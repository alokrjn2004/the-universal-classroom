'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';

// Defines the shape of our course data, including the instructor's profile
type Course = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  profiles: {
    full_name: string | null;
  }[] | null; // Correctly typed as an array
};

export default function Home() {
  // This useState hook creates the 'courses' variable
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This useEffect hook fetches the data and fills the 'courses' variable
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            description,
            image_url,
            profiles ( full_name )
          `);

        if (fetchError) throw fetchError;
        if (data) setCourses(data);

      } catch (err: any) {
        setError('Could not load courses at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div className="pt-24 text-center">Loading courses...</div>;
  }
  
  if (error) {
    return <div className="pt-24 text-center text-accent">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8 pt-24">
      <h1 className="text-5xl font-bold text-primary text-center mb-12">
        Explore Our Courses
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link href={`/course/${course.id}`} key={course.id}>
            <div className="bg-white/10 border border-primary/10 rounded-lg flex flex-col hover:border-primary/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden h-full">
              <div className="relative w-full h-48">
                {course.image_url ? (
                  <Image
                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_400,h_225,c_fill/${course.image_url}`}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-subtle flex items-center justify-center">
                    <p className="text-secondary text-sm">No Image</p>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold text-primary mb-2">{course.title}</h2>
                <p className="text-secondary text-sm mb-4">
                  By {course.profiles?.[0]?.full_name || 'Anonymous Instructor'}
                </p>
                <p className="text-primary/80 flex-grow text-sm">{course.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}