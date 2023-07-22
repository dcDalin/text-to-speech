import { useNavigate } from 'react-router-dom';

import BlogCard from '../components/Cards/BlogCard';
import FullPageLoader from '../components/Loaders/FullPageLoader';
import Seo from '../components/Seo';
import useBlogs from '../hooks/useBlogs';

export default function HomePage() {
  const { loading, data, error } = useBlogs();

  const navigate = useNavigate();

  const handleNavigate = (slug: string) => navigate(slug);

  if (loading) return <FullPageLoader />;
  if (error) return <p>{error}</p>;
  return (
    <>
      <Seo title="Blogs" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16">
        {data && data.length ? (
          data.map(
            ({
              author,
              blog,
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
                  imageUrl={url}
                  title={title}
                  author={author}
                  datePublished={''}
                  readTime={'2 minutes'}
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