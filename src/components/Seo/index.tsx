import { Helmet } from 'react-helmet-async';

interface ISeoProps {
  title: string;
  content?: string;
}

export default function Seo({ title, content = 'Text to Speech' }: ISeoProps) {
  return (
    <Helmet>
      <title>Text To Speech {title ? `| ${title}` : null}</title>
      <meta name="description" content={content} />
    </Helmet>
  );
}
