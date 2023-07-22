import { useEffect, useState } from 'react';

import { BLOG_CONTENT_TYPE } from '../utils/constants';
import client from '../utils/contentful/client';

export default function useBlogs() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<null | unknown[]>(null);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        setError(null);
        setLoading(true);
        const entries = await client.getEntries({
          content_type: BLOG_CONTENT_TYPE,
        });

        const sanitizeEntries = entries.items.map((item) => {
          return item.fields;
        });

        console.log('Sanitize is: ', sanitizeEntries);

        setData(sanitizeEntries);
        setLoading(false);
      } catch (error) {
        console.log('Could not fetch: ', error);
        setError('Something went wrong');
        setLoading(false);
      }
    };

    getBlogs();
  }, []);

  return { loading, data, error };
}
