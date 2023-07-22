/* eslint-disable @typescript-eslint/no-explicit-any */
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

export default function Blog({ blog }: { blog: any }) {
  return <div className="py-4">{documentToReactComponents(blog)}</div>;
}
