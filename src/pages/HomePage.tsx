/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import BlogCard from '../components/Cards/BlogCard';
import FullPageLoader from '../components/Loaders/FullPageLoader';
import Seo from '../components/Seo';
import { useSpeech } from '../context/SpeechContext';
import useBlogs from '../hooks/useBlogs';

export default function HomePage() {
  const { loading, data, error } = useBlogs();

  const navigate = useNavigate();

  const handleNavigate = (slug: string) => navigate(slug);

  const { controlHL } = useSpeech();

  useEffect(() => {
    controlHL.stop();
  }, [controlHL]);

  if (loading) return <FullPageLoader />;
  if (error) return <p>{error}</p>;
  return (
    <>
      <Seo title="Blogs" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16  p-4 md:p-10">
        {data && data.length ? (
          data.map(
            ({
              author,
              datePosted,
              imageUrl: {
                fields: {
                  file: { url },
                },
              },
              slug,
              title,
            }: any) => {
              return (
                <BlogCard
                  key={slug}
                  imageUrl={url}
                  title={title}
                  author={author}
                  datePublished={datePosted}
                  readTime={'2 minutes read'}
                  handleNavigate={() => handleNavigate(slug)}
                />
              );
            },
          )
        ) : (
          <p>No blogs found</p>
        )}
      </div>
    </>
  );
}
