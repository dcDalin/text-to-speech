import { useEffect, useState } from "react";

import {
  calibrateSteps,
  clearAllHighlighted,
  containsHTML,
  findScrollableParent,
  getFirstAlphabetIndex,
  getTheVoices,
  getVoiceForName,
  iOS,
  isAllUppercase,
  isNumber,
  iterateOverHTMLtag,
  makeTheSentencesViewable,
  newTextEl,
  noAbbreviation,
  removeSymbols,
  romanToArabic,
  speak,
  tryToSpeak,
} from "./Helper";

export { noAbbreviation, speak };

const SPEECH_CONFIG = "speech_config";

const NUM_SENTENCES_IN_PARAGRAPH = "num_sentences";
const PREV_PARAGRAPH_SENTENCE_INDEX = "prev_paragraph_sentence_index";
const NEXT_PARAGRAPH_SENTENCE_INDEX = "next_paragraph_sentence_index";

const LAST_SENTENCE_INDEX = "last_sentence_index";
const LAST_WORD_INDEX = "last_word_index";

function dotAsSentences(str, noAbbreviationFunc) {
  // console.log(str);
  // this function is to give the marker for the sentences and the each word.
  let wrapper = document.createElement("spkn");
  var arr = str.split(/\.\s|\.\n/);
  let lastPos = 0;

  // Iterate over sentence
  for (let i = 0, len = arr.length; i < len; i++) {
    let b = arr[i];
    let wordExist = false;

    let newSps = document.createElement("sps");
    // Give each word with <spw> tag
    // /\b\S+\b/g
    // /[\Sa-zA-ZÀ-ÿ0-9]+/g
    var taggedAllWords = b.match(/[',()a-zA-ZÀ-ÿ0-9-]+/g);

    if (taggedAllWords) {
      // var lenTaggedAllWords = taggedAllWords.length - 1;
      // var idxMatch = 0;

      taggedAllWords.forEach((match) => {
        // console.log(match);
        wordExist = true;

        let textWillSpoken = match;

        let idx = str.indexOf(match, lastPos);
        lastPos = idx;
        let idxAfter = idx + match.length;
        // console.log(str, idxAfter, idx, match.length);
        // console.log(idxAfter);

        if (str[idxAfter]) {
          if (/^[\W\d\s]+$/.test(str[idxAfter])) {
            textWillSpoken += str[idxAfter];
          }
        }

        if (str[idx - 1]) {
          if (/^[\W\d\s]+$/.test(str[idx - 1])) {
            textWillSpoken = str[idx - 1] + textWillSpoken;
          }
        }

        // console.log("Input: ", textWillSpoken, textWillSpoken.length);
        textWillSpoken = noAbbreviationFunc(textWillSpoken);
        textWillSpoken = romanTransform(textWillSpoken);

        // console.log("Output: ", textWillSpoken, typeof textWillSpoken);
        textWillSpoken = textWillSpoken.trim();

        // steps -1 mean the program doesn't know howmany steps to speak that word.
        // this useful on calibrate function
        let steps = textWillSpoken.split(" ").length;

        if (isNumber(textWillSpoken)) {
          let k = parseFloat(textWillSpoken);
          if (k > 10) {
            steps = -1;
          }
        } else {
          if (isAllUppercase(textWillSpoken)) {
            steps = -1;
          }
        }

        let newSpokenWord = document.createElement("spw");
        newSpokenWord.setAttribute("steps", steps);
        newSpokenWord.setAttribute("sp", textWillSpoken);
        newSpokenWord.innerHTML = match;

        newSps.appendChild(newSpokenWord);

        if (str[idxAfter]) {
          if (str[idxAfter] != "." || str[idxAfter] == " ") {
            newSps.appendChild(newTextEl(" "));
          }
        }
        // idxMatch++;
      });
    }

    // Remove extra spaces on the begining
    let theFirst = getFirstAlphabetIndex(b);

    if (wordExist) {
      wrapper.appendChild(newTextEl(b.substring(0, theFirst)));

      wrapper.appendChild(newSps);

      if (i < len - 1) {
        wrapper.appendChild(newTextEl(". "));
      }
    }
  }

  // console.log(wrapper);
  return wrapper;
}

export function markTheWords(str, noAbbreviationFunc = noAbbreviation) {
  if (str) {
    if (containsHTML(str)) {
      // console.log("Contains HTML");
      str = iterateOverHTMLtag(str, (txt) =>
        dotAsSentences(txt, noAbbreviationFunc)
      );
    } else {
      // console.log("NOT HTML");
      let spkn = document.createElement("div");
      spkn.appendChild(dotAsSentences(str, noAbbreviationFunc));
      str = spkn.innerHTML;
    }
  }

  return str;
}

export function romanTransform(str) {
  var exceptionsMatch = ["I ", " I ", " I"];
  var exceptions = ["a", "e"];

  var output = str.replace(
    /^\s*((M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?(?:[^I]|^)[I]{0,3})([\s.]|$))+/g,
    (match) => {
      var can = true;
      if (exceptionsMatch.includes(match)) {
        can = false;
      }

      let raw = removeSymbols(match).trim();
      // console.log("raw:", raw, raw.length);
      if (exceptions.includes(raw)) {
        can = false;
      }

      if (can) {
        if (raw.length > 0) {
          let arabicNum = romanToArabic(raw) + "";
          let dif = match.length - arabicNum.length;
          if (dif < 0) {
            dif = 0;
          }
          return arabicNum + " ".repeat(dif);
        }
      }

      return match;
    }
  );

  if (output != "NaN") {
    str = output;
  }

  return str;
}

function getBestVoicesRec(voices, idx, maxIdx, arr = [], callbackDone) {
  if (idx >= maxIdx || arr.length == 5) {
    if (typeof callbackDone == "function") {
      callbackDone(arr);
    }
  } else {
    var nextFunc = setTimeout(() => {
      // console.log("JUST SKIP TEST ", idx);
      getBestVoicesRec(voices, idx + 1, maxIdx, arr, callbackDone);
    }, 2000);
    var isTheVoiceHaveBoundaryEvent = false;
    var t0 = performance.now();
    speak(
      "test",
      {
        boundary: () => {
          isTheVoiceHaveBoundaryEvent = true;
        },
        end: () => {
          clearTimeout(nextFunc);

          var t1 = performance.now();
          var delta = (t1 - t0) / 1000;

          // console.log("TEST ENDED ", idx,voices[idx].name,delta);
          if (delta > 0.7 && delta < 1.5) {
            arr.push({
              name: voices[idx].name,
              lang: voices[idx].lang,
              voiceURI: voices[idx].voiceURI,
              time: delta,
              boundary: isTheVoiceHaveBoundaryEvent,
            });
          }

          getBestVoicesRec(voices, idx + 1, maxIdx, arr, callbackDone);
        },
        error: (error) => {
          console.log(error);
          console.log("ERROR");
        },
      },
      { voice: voices[idx], volume: 0 }
    );
  }
}

function getCalibrationText(arrSentencesEl) {
  var arrText = [];
  var arrWordsEl = arrSentencesEl[0].querySelectorAll("spw");
  var limit = arrSentencesEl.length > 1 ? 5 : 1;
  arrWordsEl.forEach((el) => {
    if (arrText.length < limit) {
      // only take 10 words
      arrText.push(el.getAttribute("sp"));
    }
  });
  var textForCalibration = arrText.join(" ");
  return textForCalibration;
}

function makeConfig(userConfig, overideConfig = null) {
  var configDefault = CONFIG_DEFAULT;
  // Overide the default config with user config
  if (userConfig != null) {
    if (typeof userConfig == "object") {
      Object.entries(CONFIG_DEFAULT).forEach(([key, value]) => {
        if (userConfig[key]) {
          configDefault[key] = userConfig[key];
        }

        if (overideConfig != null) {
          if (overideConfig[key]) {
            configDefault[key] = overideConfig[key];
          }
        }
      });
    }
  }
  return configDefault;
}

function saveParagraphIndex(index, lastHLS) {
  // Find the first sentences index of the next paragraph
  let a = sessionStorage.getItem(NEXT_PARAGRAPH_SENTENCE_INDEX);
  a = a ? parseInt(a) : 0;
  let b = sessionStorage.getItem(PREV_PARAGRAPH_SENTENCE_INDEX);
  b = b ? parseInt(b) : 0;
  let c = sessionStorage.getItem(NUM_SENTENCES_IN_PARAGRAPH);
  c = c ? parseInt(c) : 0;

  // These condition will match if the system spoke the first sentence of some paragraph
  if (a == index || a == 0 || index < b + c) {
    let num_sentences_current =
      lastHLS.parentNode.querySelectorAll("sps").length;

    let d = index - c;
    if (d < 0) {
      d = 0;
    }

    sessionStorage.setItem(PREV_PARAGRAPH_SENTENCE_INDEX, d);

    sessionStorage.setItem(NUM_SENTENCES_IN_PARAGRAPH, num_sentences_current);

    sessionStorage.setItem(
      NEXT_PARAGRAPH_SENTENCE_INDEX,
      num_sentences_current + index
    );
  }
}

const CONFIG_DEFAULT = {
  disableSentenceHL: false,
  disableWordHL: false,
  autoHL: true,

  classSentences: "highlight-sentence",
  classWord: "highlight-spoken",

  lang: "id-ID",
  pitch: 1,
  rate: 0.9,
  volume: 1,
  autoScroll: false,
  clear: true,
};

var arrSentencesElTemp = null;
var callbackDoneTemp = null;
var resumeTimeout = null;
var changeConfigTimeout = null;
var doubleClickTimeout = null;

/*
TTS version 4.3
https://github.com/albirrkarim/react-speech-highlight-demo
*/

export function useTextToSpeech(userConfig = null) {
  const [voices, setVoices] = useState([]);
  const [statusHL, setStatusHL] = useState("idle");

  const [wordSpoken, setWordSpoken] = useState("");
  const [sentenceSpoken, setSentenceSpoken] = useState("");

  useEffect(() => {
    window.speechSynthesis.pause();

    return () => {
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem("statusHL", statusHL);
  }, [statusHL]);

  function getVoices(markedTextEl, callback = null) {
    setStatusHL("getVoiceLoading");
    var cfg = makeConfig(userConfig);
    var prefered = cfg.lang.toLocaleLowerCase();

    var execTimeout = null;
    var allVoice = window.speechSynthesis.getVoices();
    if (allVoice.length == 0) {
      execTimeout = setTimeout(() => {
        getSuggestion();
      }, 5000);

      window.speechSynthesis.addEventListener("voiceschanged", getSuggestion);
    } else {
      getSuggestion();
    }

    function doneFind(arrOut) {
      function nextAction() {
        window.speechSynthesis.removeEventListener(
          "voiceschanged",
          getSuggestion
        );

        setVoices(arrOut);
        setStatusHL("idle");
        if (arrOut.length == 1) {
          if (typeof callback == "function") {
            // Return the voiceURI
            callback(arrOut[0]);
          }
        }
      }

      if (markedTextEl) {
        var arrSentencesEl = markedTextEl.querySelectorAll("sps");
        calibrateSteps(arrSentencesEl, 0, arrSentencesEl.length, () => {
          nextAction();
        });
      } else {
        nextAction();
      }
    }

    function getSuggestion() {
      if (execTimeout) {
        clearTimeout(execTimeout);
      }

      var filtered = getTheVoices(prefered);
      // Test the voice first.
      // some voice read too fast (poor quality)
      // So we filtered the voice with using it to speak "test"
      // if the time to beetween 0.7-1.5 seconds it's good.
      var before = sessionStorage.getItem("lang_" + cfg.lang);
      if (before) {
        before = JSON.parse(before);
        doneFind(before);
      } else {
        getBestVoicesRec(filtered, 0, filtered.length, [], (arrTime) => {
          arrTime.sort((a, b) => b.time - a.time); //DESC

          if (arrTime.length > 0) {
            sessionStorage.setItem("lang_" + cfg.lang, JSON.stringify(arrTime));
          }

          doneFind(arrTime);
        });
      }
    }
  }

  function play(
    markedTextEl = null, // Required
    voiceURI = null, // optional
    callbackDone,
    config
  ) {
    window.speechSynthesis.cancel();

    if (markedTextEl == null) {
      console.error("Pass some the HTML Element!");
      return;
    }

    var arrSentencesEl = markedTextEl.querySelectorAll("sps");
    arrSentencesElTemp = arrSentencesEl;
    callbackDoneTemp = callbackDone;

    if (arrSentencesEl.length == 0) {
      console.error("No marked sentences!");
      return;
    }

    var usedConfigRaw = makeConfig(userConfig, config);
    var usedConfig = usedConfigRaw;
    if (voiceURI) {
      var theVoice = getVoiceForName(voiceURI);
      if (theVoice != null) {
        usedConfig.voice = theVoice;
      }
    }

    if (usedConfig.voice) {
      if (usedConfig.voice.lang != usedConfig.lang) {
        usedConfig.voice = null;
      }
    }

    setStatusHL("calibration");
    tryToSpeak(
      getCalibrationText(arrSentencesEl),
      usedConfig,
      (timePerCharacter, isTheVoiceHaveBoundaryEvent, isHaveError) => {
        if (isHaveError) {
          setStatusHL("idle");
          return;
        }

        if (!isTheVoiceHaveBoundaryEvent) {
          console.warn("The voice has no onboundary features");
          console.warn("Try to mimic onboundary event");

          if (usedConfig.autoHL) {
            usedConfig.disableWordHL = true;
          }
        }

        if (timePerCharacter < 20) {
          console.warn(
            "Don't select that voices. That voice will perform bad."
          );
        }

        calibrateSteps(arrSentencesEl, 0, arrSentencesEl.length, () => {
          sessionStorage.setItem(
            SPEECH_CONFIG,
            JSON.stringify({
              voiceURI: voiceURI,
              config: usedConfig,
              timePerCharacter: timePerCharacter,
              isTheVoiceHaveBoundaryEvent: isTheVoiceHaveBoundaryEvent,
            })
          );

          setStatusHL("play");
          sentenceRec(
            arrSentencesEl,
            0,
            arrSentencesEl.length,
            () => {
              // callback ended
              setStatusHL("ended");
              setSentenceSpoken("");
              setWordSpoken("");

              if (typeof callbackDone == "function") {
                callbackDone();
              }
            },
            (text, isWord) => {
              // callback spoken
              // Sentence and word
              if (isWord) {
                setWordSpoken(text);
              } else {
                setSentenceSpoken(text);
              }
            },
            () => {
              // setStatusHL("error");
            },
            0,
            setStatusHL,
            usedConfig,
            timePerCharacter,
            isTheVoiceHaveBoundaryEvent
          );
        });
      }
    );
  }

  function resumeManual(
    lastIndexSentences = null,
    lastIndexWord = null,
    arrSentencesElTempCustom = null,
    configCustom = null
  ) {
    if (arrSentencesElTempCustom) {
      arrSentencesElTemp = arrSentencesElTempCustom;
    }

    if (arrSentencesElTemp) {
      // Get controlHL.play() param and variable
      if (configCustom) {
        var config = configCustom;
      } else {
        var { config, timePerCharacter, isTheVoiceHaveBoundaryEvent } =
          overideOrGetSessionConfig();
      }

      if (lastIndexSentences == null) {
        lastIndexSentences = parseInt(
          sessionStorage.getItem(LAST_SENTENCE_INDEX)
        );
      }

      if (lastIndexWord == null) {
        lastIndexWord = parseInt(sessionStorage.getItem(LAST_WORD_INDEX));
      }

      clearAllHighlighted(config.classSentences, config.classWord);

      // check if the lastIndexSentences is corrent index
      if (!arrSentencesElTemp[lastIndexSentences]) {
        console.warn("Invalid lastIndexSentences");
        setStatusHL("error");
        return;
      }

      sentenceRec(
        arrSentencesElTemp,
        lastIndexSentences,
        arrSentencesElTemp.length,
        () => {
          // callback ended
          setStatusHL("ended");
          setSentenceSpoken("");
          setWordSpoken("");

          if (typeof callbackDoneTemp == "function") {
            callbackDoneTemp();
          }
        },
        (text, isWord) => {
          // callback spoken
          // Sentence and word
          if (isWord) {
            setWordSpoken(text);
          } else {
            setSentenceSpoken(text);
          }
        },
        () => {
          setStatusHL("error");
        },
        lastIndexWord,
        setStatusHL,
        config,
        timePerCharacter,
        isTheVoiceHaveBoundaryEvent == "true"
      );
    }
  }

  function activateGesture(
    markedTextEl = null, // Required
    voiceURI = null, // optional
    callbackDone,
    config
  ) {
    // console.log("activateGesture");
    if (markedTextEl == null) {
      console.error("Pass some the HTML Element!");
      return;
    }

    var usedConfigRaw = makeConfig(userConfig, config);
    var usedConfig = usedConfigRaw;
    if (voiceURI) {
      var theVoice = getVoiceForName(voiceURI);
      if (theVoice != null) {
        usedConfig.voice = theVoice;
      }
    }

    var arrSentencesEl = markedTextEl.querySelectorAll("sps");
    var arrSentencesElArray = Array.from(arrSentencesEl);

    markedTextEl.ondblclick = function (event) {
      controlHL.stop();
      if (doubleClickTimeout) {
        clearTimeout(doubleClickTimeout);
      }
      doubleClickTimeout = setTimeout(() => {
        var el = event.target;
        // console.log(el)

        var sentence = el;
        if (el.tagName == "SPW") {
          sentence = el.parentNode;
        } else if (el.tagName == "SPS") {
          sentence = el;
        } else {
          sentence = el.querySelector("sps");
        }

        var index = arrSentencesElArray.indexOf(sentence);

        window.speechSynthesis.pause();
        window.speechSynthesis.cancel();

        setStatusHL("play");
        resumeManual(index, 0, arrSentencesEl, usedConfig);

        if (typeof callbackDone == "function") {
          callbackDone();
        }
      }, 50);
    };
  }

  function overideOrGetSessionConfig(newConfig, runtimeConfig = {}) {
    var data = sessionStorage.getItem(SPEECH_CONFIG);
    var usedConfig = makeConfig(newConfig);

    if (data) {
      data = JSON.parse(data);
      data.config = usedConfig;
    } else {
      data = {
        config: usedConfig,
        ...runtimeConfig,
      };
    }

    sessionStorage.setItem(SPEECH_CONFIG, JSON.stringify(data));

    return data;
  }

  const controlHL = {
    play,
    resume: () => {
      window.speechSynthesis.resume();

      // Check the system is resuming or not. using timeout
      // the speechSynthesis.resume() not working in chrome android
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
      }

      resumeTimeout = setTimeout(() => {
        var statusNow = sessionStorage.getItem("statusHL");

        if (iOS()) {
          if (statusNow != "play" && !window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setTimeout(() => {
              resumeManual();
              setStatusHL("play");
            }, 500);
          } else {
            setStatusHL("play");
          }
        } else {
          if (statusNow != "play") {
            window.speechSynthesis.cancel();
            setTimeout(() => {
              resumeManual();
            }, 500);
          }
        }
      }, 1000);
    },
    pause: () => {
      // console.log("controlHL.pause()");
      window.speechSynthesis.pause();
      setStatusHL("pause");
    },
    stop: () => {
      // console.log("controlHL.stop()");
      emptyTemp();

      // Clear all highlight
      var usedConfig = makeConfig(userConfig);
      clearAllHighlighted(usedConfig.classSentences, usedConfig.classWord);
      setStatusHL("idle");
    },
    seekSentenceBackward: () => {
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();

      // console.log("seekSentenceBackward");
      var last_index = sessionStorage.getItem(LAST_SENTENCE_INDEX);
      if (last_index) {
        resumeManual(parseInt(last_index) - 1, 0);
      }
    },
    seekSentenceForward: () => {
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();

      // console.log("seekSentenceForward");
      var last_index = sessionStorage.getItem(LAST_SENTENCE_INDEX);
      if (last_index) {
        resumeManual(parseInt(last_index) + 1, 0);
      }
    },
    seekParagraphBackward: () => {
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
      // console.log("seekParagraphBackward");

      var last_index = sessionStorage.getItem(PREV_PARAGRAPH_SENTENCE_INDEX);
      if (last_index) {
        resumeManual(parseInt(last_index), 0);
      }
    },
    seekParagraphForward: () => {
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();

      // console.log("seekParagraphForward");
      var last_index = sessionStorage.getItem(NEXT_PARAGRAPH_SENTENCE_INDEX);
      if (last_index) {
        resumeManual(parseInt(last_index), 0);
      }
    },
    activateGesture,
    changeConfig: (userConfig) => {
      if (changeConfigTimeout) {
        clearTimeout(changeConfigTimeout);
      }

      changeConfigTimeout = setTimeout(() => {
        if (statusHL == "play") {
          window.speechSynthesis.pause();
          window.speechSynthesis.cancel();
          overideOrGetSessionConfig(userConfig);
          setTimeout(() => {
            resumeManual();
          }, 100);
        } else {
          overideOrGetSessionConfig(userConfig);
        }
      }, 1000);
    },
  };

  return {
    controlHL: controlHL,
    statusHL: statusHL,
    spokenHL: {
      sentence: sentenceSpoken,
      word: wordSpoken,
    },
    prepareHL: {
      voices,
      getVoices,
    },
    // stateHL: {
    //     error: isError,
    // },
  };
}

function sentenceRec(
  arrSentencesEl,
  index,
  maxIndex,
  callbackDone,
  callbackSpoken,
  callbackError = null,
  last_word_index = 0,
  setStatusHL,
  config = null,
  timePerCharacter = 0,
  isTheVoiceHaveBoundaryEvent = true
) {
  // Reqursively walk through every sentences
  if (index == maxIndex) {
    emptyTemp();

    if (typeof callbackDone == "function") {
      callbackDone();
    }
  } else {
    let lastHLS = null; // last highlight sentence
    let lastHLW = null; // last highlight word

    const {
      classSentences,
      classWord,
      disableSentenceHL,
      disableWordHL,
      autoScroll,
    } = config;

    lastHLS = arrSentencesEl[index];

    saveParagraphIndex(index, lastHLS);

    if (!disableSentenceHL) {
      lastHLS.classList.add(classSentences);
    }

    if (autoScroll) {
      var theParent = findScrollableParent(lastHLS);
      makeTheSentencesViewable(lastHLS, theParent);
    }

    var arrWordsEl = lastHLS.querySelectorAll("spw");

    if (last_word_index > 0) {
      var tamp = [];
      for (let i = last_word_index, len = arrWordsEl.length; i < len; i++) {
        tamp.push(arrWordsEl[i]);
      }
      arrWordsEl = tamp;
    }

    var idxHLSteps = 0;
    var idxWord = 0;
    var numberSteps = [];
    var allWords = [];

    arrWordsEl.forEach((wordEl) => {
      allWords.push(wordEl.getAttribute("sp").trim());
      numberSteps.push(parseInt(wordEl.getAttribute("steps")));
    });

    const nextHightlight = () => {
      if (idxWord < arrWordsEl.length) {
        // Remove last highlighted word
        if (lastHLW) {
          lastHLW.classList.remove(classWord);
          lastHLW = null;
        }

        // Save last word index so we can do resumeManual();
        // The actual word index is idxWord + last_word_index
        sessionStorage.setItem(LAST_WORD_INDEX, idxWord + last_word_index);

        // Highlight the word
        if (!disableWordHL) {
          arrWordsEl[idxWord].classList.add(classWord);
          lastHLW = arrWordsEl[idxWord];
        }

        if (typeof callbackSpoken == "function") {
          callbackSpoken(allWords[idxWord], true);
        }
      }
    };

    var text = allWords.join(" ");

    var timeOutWord = null;

    function nextSentence(idx, timePerCharacterCustom = null) {
      // Function to move to the next sentence
      var status = sessionStorage.getItem("statusHL");
      if (status == "play" || status == "idle") {
        if (timeOutWord) {
          clearTimeout(timeOutWord);
        }

        if (lastHLW) {
          lastHLW.classList.remove(classWord);
        }

        if (lastHLS) {
          lastHLS.classList.remove(classSentences);
        }
      }

      if (status == "play") {
        sentenceRec(
          arrSentencesEl,
          idx,
          maxIndex,
          callbackDone,
          callbackSpoken,
          callbackError,
          0,
          setStatusHL,
          config,
          timePerCharacterCustom ? timePerCharacterCustom : timePerCharacter,
          isTheVoiceHaveBoundaryEvent
        );
      }
    }

    var isError = false;

    // To avoid the function execution died. we must use set timeout
    // console.log(timePerCharacter);
    var theSTimeout = text.length * timePerCharacter + 500;
    if (timePerCharacter < 20) {
      theSTimeout = text.length * 90 + 500;
    }

    var timeoutFunction = setTimeout(() => {
      // These function will execute when the voice services is not reach onended function
      if (
        sessionStorage.getItem("statusHL") == "play" &&
        index == sessionStorage.getItem(LAST_SENTENCE_INDEX)
      ) {
        // console.log("JUST SKIP ", index);
        // console.log("ISERROR ", isError);
        nextSentence(index + 1);
      }
    }, theSTimeout);

    if (!disableWordHL) {
      if (isTheVoiceHaveBoundaryEvent == false && timePerCharacter > 20) {
        // Try to mimic on boundary event
        function mimicOnboundary() {
          if (allWords[idxWord]) {
            nextHightlight();
            var wordTime = allWords[idxWord].length * timePerCharacter - 40;

            idxWord++;
            idxHLSteps++;

            if (allWords[idxWord] && isError == false) {
              timeOutWord = setTimeout(() => {
                if (sessionStorage.getItem("statusHL") == "play") {
                  mimicOnboundary();
                }
              }, wordTime);
            }
          } else {
            if (lastHLW) {
              lastHLW.classList.remove(classWord);
            }
          }
        }
        mimicOnboundary();
      }
    }

    if (typeof callbackSpoken == "function") {
      callbackSpoken(text);
    }

    // Save last sentence index so we can do resumeManual();
    sessionStorage.setItem(LAST_SENTENCE_INDEX, index);

    var t0 = performance.now();
    speak(
      text,
      {
        start: () => {
          // console.log("ON START EVENT ", index);
          setStatusHL("play");
        },
        resume: () => {
          // console.log("ON RESUME EVENT ", index);
          setStatusHL("play");
        },
        pause: () => {
          // console.log("ON PAUSE EVENT ", index);
          // on Chrome android, safari ipad  pause event not fired.
          clearTimeout(timeOutWord);
          clearTimeout(timeoutFunction);
        },
        end: () => {
          // console.log("ON ENDED ", index);
          clearTimeout(timeOutWord);
          clearTimeout(timeoutFunction);

          if (timePerCharacter < 20) {
            nextSentence(index + 1, (performance.now() - t0) / text.length);
          } else {
            nextSentence(index + 1);
          }
        },
        boundary: (ev) => {
          // console.log(numberSteps);
          if (idxHLSteps < numberSteps.length) {
            numberSteps[idxHLSteps]--;
          }
          if (numberSteps[idxHLSteps] == 0) {
            nextHightlight();

            idxWord++;
            idxHLSteps++;
          } else {
            nextHightlight();
          }
        },
        error: (error) => {
          // console.log(error);
          // console.log("ON ERROR ", index);
          isError = true;
          // alert("Error");

          if (error.error == "interrupted") {
            // The window.speechSynthesis.cancel(); resulting error with message "interrupted"
            // We need to clear the timeout function. so the reqursive not play together
            clearTimeout(timeoutFunction);
            clearTimeout(timeOutWord);
          }

          if (typeof callbackError == "function") {
            callbackError();
          }
        },
      },
      config
    );
  }
}

function emptyTemp() {
  if (resumeTimeout) {
    clearTimeout(resumeTimeout);
    resumeTimeout = null;
  }
  arrSentencesElTemp = null;
  callbackDoneTemp = null;

  sessionStorage.removeItem(NUM_SENTENCES_IN_PARAGRAPH);
  sessionStorage.removeItem(PREV_PARAGRAPH_SENTENCE_INDEX);
  sessionStorage.removeItem(NEXT_PARAGRAPH_SENTENCE_INDEX);

  sessionStorage.removeItem(SPEECH_CONFIG);
  sessionStorage.removeItem(LAST_SENTENCE_INDEX);
  sessionStorage.removeItem(LAST_WORD_INDEX);

  window.speechSynthesis.pause();
  window.speechSynthesis.cancel();
}
