'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Import our Supabase client
import { useRouter } from 'next/navigation'; // Import the router for redirection

export default function CreateCoursePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // To prevent multiple submissions
  const router = useRouter();

  // This function will now save data to the database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Get the currently logged-in user's ID
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('You must be logged in to create a course.');
      setIsSubmitting(false);
      return;
    }

    // 2. Insert the new course data into the 'courses' table
    const { error } = await supabase
      .from('courses')
      .insert({
        title: title,
        description: description,
        instructor_id: user.id, // Associate the course with the logged-in user
      });

    if (error) {
      alert('Error creating course: ' + error.message);
    } else {
      alert('Course created successfully!');
      // 3. Redirect the user back to the dashboard after success
      router.push('/dashboard');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto p-8 pt-24">
      <h1 className="text-4xl font-bold text-primary mb-6">Create a New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="title" className="block text-lg font-semibold text-secondary">
            Course Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-md bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., Introduction to Contract Law"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-lg font-semibold text-secondary">
            Course Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-md bg-white/50 h-32 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Describe what students will learn in this course."
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-primary/10 hover:bg-primary/20 backdrop-blur-sm border border-primary/20 text-primary font-bold py-3 px-8 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50"
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? 'Saving...' : 'Save and Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}