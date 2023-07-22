/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BLOG_CONTENT_TYPE } from '../utils/constants';
import client from '../utils/contentful/client';

export default function useBlog(slug = '') {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        setError(null);
        setLoading(true);

        if (!slug) {
          return navigate('/');
        }

        const entries = await client.getEntries({
          content_type: BLOG_CONTENT_TYPE,
          'fields.slug': slug,
        });

        if (!entries.items.length) {
          setError('Blog not found');
        } else {
          setData(entries.items[0].fields);
        }

        setLoading(false);
      } catch (error) {
        setError('Something went wrong');
        setLoading(false);
      }
    };

    getBlogs();
  }, [navigate, slug]);

  return { loading, data, error };
}
