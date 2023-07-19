import {
  englishAbbreviationMap,
  indonesianAbbreviationMap,
} from "./Abbreviation";

export function noAbbreviation(
  string,
  abbreviationMap = englishAbbreviationMap
) {
  // Define replace function for abbreviation to match your problem

  // Replace the class
  const abbreviationMapClass = {
    a: "adjektiva",
    adv: "adverbia",
    n: "nomina",
    num: "numeralia",
    v: "verba",
    pron: "pronomina",
    p: "partikel",
  };

  for (const key in abbreviationMapClass) {
    var rex = new RegExp(`\\d+(\.)? ${key} `, "g");
    string = string.replace(rex, (match) => {
      const num = match.slice(0, -2);
      return `${num} (${abbreviationMapClass[key]}) `;
    });
  }

  // Replace the meters
  function replaceMeters(string) {
    return string.replace(/\d+ m /g, (match) => {
      const num = match.slice(0, -2);
      return `${num} meter `;
    });
  }

  string = replaceMeters(string);

  // Multiple
  var rex = new RegExp(" x ", "g");
  string = string.replace(rex, " kali ");

  // Sampai 10-50 meter
  var rex = new RegExp("--", "g");
  string = string.replace(rex, "-");

  // Replace common abbreviation
  for (const abbreviation in abbreviationMap) {
    // var rex = new RegExp(`${abbreviation}`, "g");
    // string = string.replace(rex, abbreviationMap[abbreviation]);

    // Match word with end spaces
    var rex = new RegExp(`${abbreviation} `, "g");
    string = string.replace(rex, abbreviationMap[abbreviation] + " ");

    // Match word beetween spaces
    rex = new RegExp(` ${abbreviation} `, "g");
    string = string.replace(rex, " " + abbreviationMap[abbreviation] + " ");

    // Match word with ( symbol at the begininig
    rex = new RegExp(`[(]${abbreviation} `, "g");
    string = string.replace(rex, "(" + abbreviationMap[abbreviation] + " ");

    // Match word with following )
    rex = new RegExp(` ${abbreviation}[)]`, "g");
    string = string.replace(rex, " " + abbreviationMap[abbreviation] + ")");

    // Match word with following the end of the string
    rex = new RegExp(` ${abbreviation}+$`, "g");
    string = string.replace(rex, " " + abbreviationMap[abbreviation]);

    // Match word if the word end with . or ;
    rex = new RegExp(`${abbreviation}(\\.|\\;)`, "g");
    string = string.replace(rex, abbreviationMap[abbreviation] + ".");
  }

  return string;
}

export function newTextEl(str) {
  return document.createTextNode(str);
}

export function isAllUppercase(str) {
  return str === str.toUpperCase();
}

export function containsHTML(string) {
  var pattern = /<[a-z][\s\S]*>/i;
  return pattern.test(string);
}

export function getVoiceForName(voiceURI) {
  var voices = speechSynthesis.getVoices();
  for (let i = 0; i < voices.length; i++) {
    if (voices[i].voiceURI == voiceURI) {
      return voices[i];
    }
  }
  return null;
}

export function speak(
  text,
  eventHandler = {}, // start, end, resume, error, pause, mark
  config = {
    lang: "id-ID",
    pitch: 1,
    rate: 0.9,
    volume: 1,
    voice: null,
    clear: true,
  }
) {
  if (!("speechSynthesis" in window)) {
    console.log("Text-to-speech not supported.");
    return;
  }

  let msg = new SpeechSynthesisUtterance();

  var {
    lang = "id-ID",
    pitch = 1,
    rate = 0.9,
    volume = 1,
    clear = true,
    voice = null,
  } = config;

  if (voice) {
    msg.voice = voice;
  }

  msg.lang = lang;
  msg.pitch = pitch;
  msg.rate = rate;
  msg.volume = volume;

  msg.text = text;

  Object.entries(eventHandler).forEach(([key, func]) => {
    msg.addEventListener(key, func);
  });

  if (clear) {
    window.speechSynthesis.cancel();
  }

  window.speechSynthesis.speak(msg);
}

export function getTextNodes(element) {
  // Initialize an array to store the text nodes
  const textNodes = [];

  // Iterate over the child nodes of the element
  for (let i = 0; i < element.childNodes.length; i++) {
    const childNode = element.childNodes[i];

    // If the child node is a text node, add it to the array
    if (childNode.nodeType === Node.TEXT_NODE) {
      textNodes.push(childNode);
    }
    // If the child node is an element, recursively get its text nodes
    else if (childNode.nodeType === Node.ELEMENT_NODE) {
      textNodes.push(...getTextNodes(childNode));
    }
  }

  // Return the array of text nodes
  return textNodes;
}

export function getFirstAlphabetIndex(str) {
  for (let i = 0; i < str.length; i++) {
    if (str[i].match(/[a-zA-Z0-9]/)) {
      return i;
    }
  }
  return -1;
}

export function isNumber(str) {
  return /^\d+$/.test(str);
}

export function iterateOverHTMLtag(html, executeOverIterate) {
  // Create a temporary element
  const temp = document.createElement("div");
  // Set the HTML content of the element to the input HTML string
  temp.innerHTML = html;

  // Get all the text nodes in the element
  const textNodes = getTextNodes(temp);

  // Iterate over the text nodes and wrap each word in a span element
  textNodes.forEach((node) => {
    let cond1 = true;

    if (node.nodeValue.length == 1) {
      if (!/[a-zA-Z0-9]/.test(node.nodeValue)) {
        cond1 = false;
      }
    }

    // console.log(node);

    if (cond1) {
      if (typeof executeOverIterate == "function") {
        node.parentNode.replaceChild(executeOverIterate(node.nodeValue), node);
      }
    }
  });

  // Return the inner HTML of the element as a string
  return temp.innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

export function findScrollableParent(el) {
  while ((el = el.parentElement) && !(el.scrollHeight > el.clientHeight));
  return el;
}

export function makeTheSentencesViewable(lastHLS, theParent = null) {
  if (lastHLS) {
    lastHLS.focus();
    let rect = lastHLS.getBoundingClientRect();
    if (rect.top < 0 || rect.bottom > window.innerHeight) {
      lastHLS.scrollIntoView({ block: "center", behavior: "smooth" });
    }

    if (theParent) {
      let rectScrollable = theParent.getBoundingClientRect();
      if (
        rect.bottom > rectScrollable.bottom ||
        rect.top < rectScrollable.top
      ) {
        let elementTop = rect.top;
        let elementHeight = rect.height;
        let elementMiddle = elementTop + elementHeight / 2;
        let viewportMiddle = rectScrollable.bottom / 2;
        theParent.scrollBy({
          top: elementMiddle - viewportMiddle,
          behavior: "smooth",
        });

        rect = lastHLS.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          lastHLS.scrollIntoView({
            block: "center",
            behavior: "smooth",
          });
        }
      }
    }
  }
}

export function romanToArabic(roman) {
  // console.log("ROMAN INPUT ", roman);
  // roman = removeSymbols(roman);
  roman = roman.toUpperCase().trim();
  // console.log("ROMAN OUPUT ", roman.length);

  // Create a lookup table that contains the Roman numerals and their corresponding Arabic values.
  const lookup = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  // Initialize the result to 0.
  let result = 0;

  // Split the Roman numeral string into individual characters.
  const romanArray = roman.split("");

  // console.log(romanArray)

  // Loop through the characters and add the corresponding Arabic values to the result.
  for (let i = 0; i < romanArray.length; i++) {
    // Get the current character and the next character.
    const current = lookup[romanArray[i]];
    const next = lookup[romanArray[i + 1]];

    // If the current character has a lower value than the next character, then subtract it from the result.
    if (current < next) {
      result -= current;
    } else {
      // Otherwise, add the current character to the result.
      result += current;
    }
  }

  return result;
}

export function clearAllHighlighted(classSentences, classWord) {
  let a = document.querySelectorAll("." + classSentences);
  a.forEach((el) => {
    el.classList.remove(classSentences);
  });
  a = document.querySelectorAll("." + classWord);
  a.forEach((el) => {
    el.classList.remove(classWord);
  });
}

export function removeSymbols(str) {
  // return str.replace(/[^\w\s]/gi, "");
  return str.replace(/[^a-zA-Z\s]/g, "");
}

export function countWords(html) {
  // Remove the HTML tags from the string
  const text = html.replace(/<[^>]*>/g, "");

  // Split the text into an array of words
  const words = text.split(/\b/);

  // Return the number of words in the array
  return words.length;
}

export function endTimeReport(t0) {
  var t1 = performance.now();
  console.log("Calibration took: ", ((t1 - t0) / 1000).toFixed(2), " Seconds");
}

export function tryToSpeak(text, config = {}, callback) {
  // Getting the actual spoken time per character.
  var t0 = performance.now();
  var isTheVoiceHaveBoundaryEvent = false;

  var keepAlive = setTimeout(() => {
    console.warn("tryToSpeak is died");
    if (typeof callback == "function") {
      callback(0, false, false);
    }
  }, 10000);

  speak(
    text,
    {
      end: () => {
        clearTimeout(keepAlive);
        if (typeof callback == "function") {
          var timePerCharacter = (performance.now() - t0) / text.length;
          callback(timePerCharacter, isTheVoiceHaveBoundaryEvent); // miliseconds
        }
      },
      boundary: () => {
        isTheVoiceHaveBoundaryEvent = true;
      },
      error: (err) => {
        // Error
        // console.log(err);
        if (typeof callback == "function") {
          callback(0, false, true);
        }
      },
    },
    { ...config, volume: 0 }
  );
}

export function calibrateSteps(arrSentencesEl, index, maxIndex, callbackDone) {
  // This is for getting the actual steps. when the steps attribute equal -1
  if (index == maxIndex) {
    if (typeof callbackDone == "function") {
      callbackDone();
    }
  } else {
    var arrWordsEl = arrSentencesEl[index].querySelectorAll("spw");
    walkThroughWords(arrWordsEl, 0, arrWordsEl.length, () => {
      calibrateSteps(arrSentencesEl, index + 1, maxIndex, callbackDone);
    });
  }
}

function walkThroughWords(arrWordsEl, index, maxIndex, callback) {
  if (index == maxIndex) {
    if (typeof callback == "function") {
      callback();
    }
  } else {
    var currentEl = arrWordsEl[index];
    var num = parseInt(currentEl.getAttribute("steps"));
    if (num == -1) {
      var text = currentEl.getAttribute("sp");
      var counter = 0;
      speak(
        text,
        {
          end: () => {
            if (counter == -1) {
              counter = 1;
            }
            currentEl.setAttribute("steps", counter);
            walkThroughWords(arrWordsEl, index + 1, maxIndex, callback);
          },
          boundary: (ev) => {
            counter++;
          },
        },
        { volume: 0, rate: 2 }
      );
    } else {
      walkThroughWords(arrWordsEl, index + 1, maxIndex, callback);
    }
  }
}

function checkArrException(voiceURI, arrVoices) {
  for (let i = 0, len = arrVoices.length; i < len; i++) {
    if (arrVoices[i].voiceURI == voiceURI) {
      return true;
    }
  }
  return false;
}

function getAnotherVoices(sourceArr, lang, exceptions = []) {
  let addon = sourceArr.filter((e) => {
    if (!checkArrException(e.voiceURI, exceptions)) {
      var k = e.lang.toLocaleLowerCase().split(/[-_]/);
      var p = lang.split(/[-_]/);
      var cond1 = k[0] == p[0];

      if (k.length > 1) {
        var cond2 = k[1] == p[1];

        let a = cond1 || cond2;
        // console.log(k, p, a);
        return a;
      }
      return cond1;
    }
    return false;
  });

  return [...exceptions, ...addon];
}

export function getTheVoices(preferedLang, withException = true, wide = false) {
  var arrVoices = speechSynthesis.getVoices();
  var filtered = arrVoices.filter((e) => e.lang == preferedLang);

  if (filtered.length < 3 || wide) {
    filtered = getAnotherVoices(arrVoices, preferedLang, filtered);
  }

  if (filtered.length == 0) {
    filtered = arrVoices.filter((e) => {
      var exist = e.lang.toLocaleLowerCase().split(/[-_]/)[0];
      var p = preferedLang.split(/[-_]/)[0];
      return exist.startsWith(p);
    });
  }

  if (withException) {
    var exceptions = [
      "Bells",
      "Jester",
      "Good News",
      "Bad News",
      "Wobble",
      "Bubbles",
      "Cellos",
      "Organ",
      "Grandma",
      "Grandpa",
      "Boing",
    ];

    function containsString(inputString, stringsToCheck) {
      return stringsToCheck.some((string) => inputString.includes(string));
    }
    return filtered.filter((e) => !containsString(e.name, exceptions));
  }
  return filtered;
}

export function iOS() {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}
