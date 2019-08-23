'use strict';

const {
  REGEX_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_GLOBAL,
  REGEX_REMOVE_BACKSLASH
} = require('./constants');

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

// don't check process if we're in the browser
// since in the browser `process` is undefined, therefore `process.platform` would throw
const win32 = !isBrowser && process.platform === 'win32';

exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
exports.toPosixSlashes = str => str.replace(/\\/g, '/');

exports.removeBackslashes = str => {
  return str.replace(REGEX_REMOVE_BACKSLASH, match => {
    return match === '\\' ? '' : match;
  });
}

exports.supportsLookbehinds = () => {
  const segs = process.version.slice(1).split('.');
  if (segs.length === 3 && +segs[0] >= 9 || (+segs[0] === 8 && +segs[1] >= 10)) {
    return true;
  }
  return false;
};

exports.isWindows = options => {
  if (options && typeof options.windows === 'boolean') {
    return options.windows;
  }
  return win32 === true;
};

exports.escapeLast = (input, char, lastIdx) => {
  const idx = input.lastIndexOf(char, lastIdx);
  if (idx === -1) return input;
  if (input[idx - 1] === '\\') return exports.escapeLast(input, char, idx - 1);
  return input.slice(0, idx) + '\\' + input.slice(idx);
};
