'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// A type definition for our course object for better code safety
type Course = {
  id: string;
  title: string;
  created_at: string;
};

const allowedRoles = ['Instructor', 'Admin', 'Super Admin'];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{ role: string } | null>(null);
  const [courses, setCourses] = useState<Course[]>([]); // State to hold the courses
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // 1. Check for a user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // 2. Fetch the user's profile and role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profile || !allowedRoles.includes(profile.role)) {
        router.push('/');
        return;
      }
      setUserProfile(profile);

      // 3. Fetch the courses that belong to this user
      const { data: courseData, error } = await supabase
        .from('courses')
        .select('id, title, created_at')
        .eq('instructor_id', session.user.id) // Filter by instructor ID
        .order('created_at', { ascending: false }); // Show newest first

      if (courseData) {
        setCourses(courseData);
      }

      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) {
    return <div className="pt-24 text-center">Loading dashboard...</div>;
  }

  // In src/app/dashboard/page.tsx

return (
  <div className="container mx-auto p-8 pt-24">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold text-primary">Educator Dashboard</h1>
      <Link href="/dashboard/create-course">
        <button className="bg-primary/10 hover:bg-primary/20 backdrop-blur-sm border border-primary/20 text-primary font-bold py-2 px-6 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
          Create New Course
        </button>
      </Link>
    </div>

    <div>
      <h2 className="text-2xl font-semibold text-primary mb-4">Your Courses</h2>
      <div className="space-y-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className="bg-white/10 p-4 rounded-lg shadow-md border border-primary/10 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-primary">{course.title}</h3>
                <p className="text-sm text-secondary">Created on: {new Date(course.created_at).toLocaleDateString()}</p>
              </div>
              {/* --- UPDATED BUTTON --- */}
              <Link href={`/dashboard/manage/${course.id}`} className="text-sm font-semibold text-primary hover:text-accent transition-colors">
                Manage
              </Link>
            </div>
          ))
        ) : (
          <p className="text-secondary">You haven't created any courses yet.</p>
        )}
      </div>
    </div>
  </div>
);
}