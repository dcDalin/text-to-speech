import { useParams } from 'react-router-dom';

import Blog from '../components/Blog';
import PreviousChevron from '../components/Buttons/PreviousChevron';
import CircularProgress from '../components/CircularProgress';
import FloatingControls from '../components/FloatingControls';
import DateLabel from '../components/Labels/DateLabel';
import FullPageLoader from '../components/Loaders/FullPageLoader';
import Seo from '../components/Seo';
import { useSpeech } from '../context/SpeechContext';
import useBlog from '../hooks/useBlog';
import BlogLayout from '../layout/BlogLayout';

export default function BlogPage() {
  const { slug } = useParams();
  const { controlHL, textEl, statusHL } = useSpeech();

  const { loading, data, error } = useBlog(slug);

  if (loading) return <FullPageLoader />;
  if (error) return <p>{error}</p>;

  const {
    title,
    author,
    datePosted,
    imageUrl: {
      fields: {
        file: { url },
      },
    },
    blog,
  } = data;

  return (
    <>
      <Seo title="Blog" />
      <div className="relative h-full">
        <PreviousChevron />

        <BlogLayout>
          <h1 className="text-4xl font-bold font-open-sans">{title}</h1>
          <section className="flex items-center justify-between pt-8 pb-3">
            <h6 className="text-logoBlue text-shadow-sm font-semibold text-base">{author}</h6>
            <div className="flex items-center space-x-2 text-xs font-semibold text-gray font-source-sans">
              <div>2 min read</div>
              <DateLabel dateString={datePosted} />
            </div>
          </section>
          <img className="h-56 md:h-64 w-full object-cover" src={url} alt={`${title} image`} />

          <div>
            <div className="float-left h-12 w-12 pt-8 pr-2 flex items-center">
              <CircularProgress />
            </div>
            <Blog blog={blog} />
          </div>
        </BlogLayout>
        <div className="fixed bottom-16 left-0 w-full h-14 md:h-20">
          <div className="h-full w-full md:w-[572px] mx-auto px-4 md:px-8">
            <FloatingControls
              isPlay={statusHL == 'play' || statusHL == 'calibration'}
              play={() => {
                if (statusHL == 'pause') {
                  controlHL.resume();
                } else {
                  controlHL.play(textEl.current, localStorage.getItem('voice_for_' + 'en - US'));
                }
              }}
              pause={controlHL.pause}
              stop={controlHL.stop}
            />
          </div>
        </div>
      </div>
    </>
  );
}
