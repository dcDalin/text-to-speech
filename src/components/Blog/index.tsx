/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from 'react';
import { markTheWords } from 'react-speech-highlight';

import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';

import { useSpeech } from '../../context/SpeechContext';

interface IBlogProps {
  blog: any;
}

export default function Blog({ blog }: IBlogProps) {
  const inputText = documentToPlainTextString(blog);

  const textHL = useMemo(() => markTheWords(inputText), [inputText]);

  const { textEl, disableSentenceHL, disableWordHL, autoHL, autoScroll, controlHL } = useSpeech();

  const lang = 'en-US';

  useEffect(() => {
    // Activate the double click gesture
    if (textEl.current) {
      controlHL.activateGesture(textEl.current, localStorage.getItem('voice_for_' + lang), null, {
        lang: lang,
        disableSentenceHL: disableSentenceHL,
        disableWordHL: disableWordHL,
        autoHL: autoHL,
        autoScroll: autoScroll,
      });
    }
  }, []);

  return (
    <div
      ref={textEl}
      className="py-4"
      dangerouslySetInnerHTML={{
        __html: textHL,
      }}
    ></div>
  );
}
