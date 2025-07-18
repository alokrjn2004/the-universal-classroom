'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import Image from 'next/image';

type Lesson = {
  id: string;
  title: string;
  video_url: string | null;
};

export default function ManageCoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;

  // States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseImageUrl, setCourseImageUrl] = useState<string | null>(null);
  const [newCourseImage, setNewCourseImage] = useState<File | null>(null);
  const [objectives, setObjectives] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonVideo, setNewLessonVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseAndLessons = useCallback(async () => {
    if (!courseId) return;
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`title, description, image_url, objectives`)
        .eq('id', courseId)
        .single();
      if (error) throw error;
      if (data) {
        setTitle(data.title);
        setDescription(data.description || '');
        setCourseImageUrl(data.image_url);
        setObjectives(data.objectives || []);
      }
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('id, title, video_url')
        .eq('course_id', courseId)
        .order('created_at', { ascending: true });
      if (lessonError) throw lessonError;
      if (lessonData) setLessons(lessonData);
    } catch (err: any) {
      setError('Failed to load course data.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseAndLessons();
  }, [courseId, fetchCourseAndLessons]);

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('courses').update({ title, description, objectives }).eq('id', courseId);
    if (error) alert('Error updating course: ' + error.message);
    else alert('Course updated successfully!');
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setNewCourseImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!newCourseImage) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', newCourseImage);
      formData.append('upload_preset', 'ml_default');
      const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`;
      const cloudinaryResponse = await fetch(uploadUrl, { method: 'POST', body: formData });
      const cloudinaryData = await cloudinaryResponse.json();
      if (cloudinaryData.error) throw new Error(cloudinaryData.error.message);
      const imageUrl = cloudinaryData.public_id;
      const { error: supabaseError } = await supabase.from('courses').update({ image_url: imageUrl }).eq('id', courseId);
      if (supabaseError) throw supabaseError;
      alert('Course image updated successfully!');
      setCourseImageUrl(imageUrl);
      setNewCourseImage(null);
    } catch (err: any) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (indexToRemove: number) => {
    setObjectives(objectives.filter((_, index) => index !== indexToRemove));
  };
  
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setNewLessonVideo(e.target.files[0]);
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || !newLessonVideo) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', newLessonVideo);
      formData.append('upload_preset', 'ml_default');
      const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/video/upload`;
      const cloudinaryResponse = await fetch(uploadUrl, { method: 'POST', body: formData });
      const cloudinaryData = await cloudinaryResponse.json();
      if (cloudinaryData.error) throw new Error(cloudinaryData.error.message);
      const videoUrl = cloudinaryData.public_id;
      const { error: supabaseError } = await supabase.from('lessons').insert({ title: newLessonTitle, course_id: courseId, video_url: videoUrl });
      if (supabaseError) throw supabaseError;
      alert('Lesson added successfully!');
      setNewLessonTitle('');
      setNewLessonVideo(null);
      const fileInput = document.getElementById('lesson-video-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchCourseAndLessons();
    } catch (err: any) {
      alert('Failed to add lesson: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="pt-24 text-center">Loading course...</div>;
  if (error) return <div className="pt-24 text-center text-accent">{error}</div>;

  return (
    <div className="container mx-auto p-8 pt-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-4">Edit Course Info</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-secondary mb-2">Course Image</label>
                {courseImageUrl && (
                  <Image src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_400,h_250,c_fill/${courseImageUrl}`} alt="Current course image" width={400} height={250} className="rounded-md object-cover mb-4" />
                )}
                <input type="file" accept="image/*" onChange={handleImageFileChange} className="w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                <button onClick={handleImageUpload} disabled={!newCourseImage || isSubmitting} className="w-full mt-2 bg-secondary/80 text-white font-bold py-2 px-4 rounded-md hover:bg-secondary transition-colors disabled:opacity-50">{isSubmitting ? 'Uploading...' : 'Upload New Image'}</button>
              </div>
              <form onSubmit={handleUpdateCourse} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-lg font-semibold text-secondary">Course Title</label>
                  <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 mt-2 border rounded-md bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary" required />
                </div>
                <div>
                  <label htmlFor="description" className="block text-lg font-semibold text-secondary">Course Description</label>
                  <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 mt-2 border rounded-md bg-white/50 h-32 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </form>
            </div>
          </div>
          <div>
            <label className="block text-lg font-semibold text-secondary">Learning Objectives</label>
            <div className="space-y-2 mt-2">
              {objectives.map((obj, index) => (
                <div key={index} className="flex items-center justify-between bg-white/50 p-2 rounded-md">
                  <span className="text-sm text-primary">{obj}</span>
                  <button type="button" onClick={() => handleRemoveObjective(index)} className="text-red-500 hover:text-red-700 text-xs font-bold">Remove</button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2 mt-2">
              <input type="text" value={newObjective} onChange={(e) => setNewObjective(e.target.value)} placeholder="Add a new objective" className="flex-grow px-4 py-2 border rounded-md bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary" />
              <button type="button" onClick={handleAddObjective} className="bg-secondary/80 text-white font-bold py-2 px-4 rounded-md hover:bg-secondary">Add</button>
            </div>
            <button type="button" onClick={() => handleUpdateCourse} className="mt-6 w-full bg-primary/10 hover:bg-primary/20 backdrop-blur-sm border border-primary/20 text-primary font-bold py-3 px-8 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-lg">Save All Changes</button>
          </div>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-primary mb-4">Course Lessons</h2>
          <form onSubmit={handleAddLesson} className="space-y-4 p-4 border border-primary/20 rounded-lg mb-6">
            <input type="text" value={newLessonTitle} onChange={(e) => setNewLessonTitle(e.target.value)} placeholder="Enter new lesson title" className="w-full px-4 py-2 border rounded-md bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary" required />
            <input id="lesson-video-upload" type="file" accept="video/*" onChange={handleVideoFileChange} className="w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" required />
            <button type="submit" className="bg-primary/80 text-white font-bold py-2 px-4 rounded-md hover:bg-primary transition-colors w-full disabled:opacity-50" disabled={isSubmitting}>{isSubmitting ? 'Uploading...' : 'Add Lesson'}</button>
          </form>
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className="bg-white/10 p-3 rounded-lg border border-primary/10 flex items-center justify-between">
                <p className="font-semibold"><span className="text-secondary mr-2">{index + 1}.</span>{lesson.title}</p>
                <button className="text-xs text-secondary hover:text-accent">Edit</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}