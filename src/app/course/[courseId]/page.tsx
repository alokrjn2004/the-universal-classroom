import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { Clock, ListVideo, InfinityIcon, CheckCircle2 } from 'lucide-react';

// This is a "type" that describes the exact shape of our data.
// It helps prevent errors by making our code more predictable.
type CourseData = {
  title: string;
  description: string | null;
  image_url: string | null;
  objectives: string[] | null;
  profiles: { full_name: string | null; } | null; // Note: Not an array for a single record
  lessons: { id: string; title: string; }[];
};

export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
  
  // The query now fetches the related profile as a single object, not an array
  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      title,
      description,
      image_url,
      objectives,
      profiles!inner ( full_name ),
      lessons ( id, title )
    `)
    .eq('id', params.courseId)
    .single<CourseData>();

  if (error || !course) {
    return <div className="pt-24 text-center">Course not found.</div>;
  }

  // Sample data for display purposes
  const learningObjectives = course.objectives || [];

  return (
    <>
      <div className="bg-primary text-white pt-32 pb-16">
        <div className="container mx-auto max-w-5xl px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-2">{course.title}</h1>
          <p className="text-lg text-gray-300 mb-4">{course.description}</p>
          <p className="text-sm">Created by <span className="font-semibold">{course.profiles?.full_name || 'Anonymous'}</span></p>
        </div>
      </div>

      <div className="bg-background">
        <div className="container mx-auto max-w-5xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12 lg:items-start">
            <div className="lg:col-span-2">
              <div className="border border-primary/20 p-6 mb-8 bg-white/5 rounded-md">
                <h2 className="text-2xl font-bold text-primary mb-4">What you'll learn</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  {learningObjectives.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle2 size={20} className="flex-shrink-0 mt-1 text-primary/80" />
                      <span className="text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Course content</h2>
                <div className="space-y-2">
                  {course.lessons.map((lesson, index) => (
                    <div key={lesson.id} className="bg-subtle p-3 flex items-center rounded-md">
                      <ListVideo size={16} className="text-secondary mr-3 flex-shrink-0" />
                      <p className="text-primary">{lesson.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="relative w-full aspect-video rounded-md overflow-hidden shadow-lg mb-4">
                  {course.image_url && (
                    <Image src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_400,q_auto,f_auto/${course.image_url}`} alt={course.title} fill className="object-cover" />
                  )}
                </div>
                <button className="w-full bg-accent text-white font-bold py-3 px-4 rounded-md hover:bg-accent/90 transition-colors mb-4">Enroll Now</button>
                <div className="space-y-2 text-sm text-secondary text-center">
                  <p>30-Day Money-Back Guarantee</p>
                  <p>Full Lifetime Access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}