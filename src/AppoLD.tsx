import { useMemo, useRef, useEffect, useState } from 'react';
import { BsChevronLeft } from 'react-icons/bs';
import { markTheWords, useTextToSpeech } from 'react-speech-highlight';

import { convert } from 'html-to-text';

import Blog from './components/Blog';
import FloatingControls from './components/FloatingControls';
import { blog } from './data/blog';
import BlogLayout from './layout/BlogLayout';

function App() {
  const html = blog.blog;

  const text = convert(html);

  const textEl = useRef<HTMLInputElement | null>(null);
  const { controlHL, statusHL, prepareHL, spokenHL } = useTextToSpeech({
    disableSentenceHL: false,
    disableWordHL: false,
    autoScroll: true,
    lang: 'en - US',
  });

  const textHL = useMemo(() => markTheWords(text), [text]);

  return (
    <>
      <BsChevronLeft className="text-lg" />

      <BlogLayout>
        <h1 className="text-4xl font-bold font-open-sans">
          How the oldest multicellular form of life was found in lava
        </h1>
        <section className="flex items-center justify-between pt-8 pb-3">
          <h6 className="text-logoBlue text-shadow-sm font-semibold text-base">TechCrunch</h6>
          <div className="flex items-center space-x-2 text-xs font-semibold text-gray font-source-sans">
            <div>3 min read</div>
            <div>1 day ago</div>
          </div>
        </section>
        <img
          className="h-56 md:h-64 w-full object-cover"
          src="https://assets2.cbsnewsstatic.com/hub/i/r/2022/01/10/caee17e7-ecd1-48f1-ac6f-17cd0fdc3f65/thumbnail/620x409/0f8acbfb2a6a73e5765a07afe8ae7300/screen-shot-2022-01-10-at-1-28-36-pm.png?v=ed1888effc334856324ceac60c145559"
          alt="blog image"
        />

        <Blog />

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
      </BlogLayout>
    </>
  );
}

export default App;