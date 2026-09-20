import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SAMPLE_LESSONS } from '@/data/sampleLessons';
import LessonClient from './LessonClient';

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export function generateStaticParams() {
  return Object.keys(SAMPLE_LESSONS).map((lessonId) => ({
    lessonId,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = SAMPLE_LESSONS[lessonId];
  if (!lesson) {
    return {
      title: 'পাঠ পাওয়া যায়নি | IQRA Quranic Arabic',
    };
  }

  return {
    title: `${lesson.titleBengali} • ${lesson.subtitleBengali} | ইক্বরা কোরানের আরবী`,
    description: `মডিউল ${lesson.moduleNumber}, পাঠ ${lesson.lessonNumber}: ${lesson.anchorAyah.arabicText} - ${lesson.anchorAyah.bengaliTranslation}`,
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { lessonId } = await params;
  const lesson = SAMPLE_LESSONS[lessonId];

  if (!lesson) {
    notFound();
  }

  return <LessonClient lesson={lesson} lessonId={lessonId} />;
}
