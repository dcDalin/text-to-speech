import { useEffect, useState } from 'react';

import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import client from '../../utils/contentful/client';

export default function Blog() {
  const [blogs, setBlogs] = useState<any>({
    blog: {
      content: [],
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBlog = async () => {
      try {
        setLoading(true);
        const { items } = await client.getEntries({
          content_type: 'blog',
          'fields.slug': 'connect-with-mayfield-jetro-toptal-and-more-at-techcrunch-disrupt',
        });

        console.log(items[0].fields);
        setBlogs(items[0].fields);
        setLoading(false);
      } catch (error) {
        console.log('error is: ', error);
        setLoading(false);
      }
    };

    getBlog();
  }, []);

  if (loading) return <p>loading...</p>;

  const richTextDocument = {
    nodeType: 'document',
    data: {},
    content: blogs.blog.content,
  };

  return <div>{documentToReactComponents(richTextDocument, {})}</div>;
}
