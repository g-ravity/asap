import memoize from "lodash/memoize";

export const getInitials = (word: string): string => {
  const wordsArr = word.split(" ");
  return `${wordsArr.shift()![0].toUpperCase()}${wordsArr.length ? wordsArr.pop()![0].toUpperCase() : ""}`;
};

export const getRandomColor = (key?: string): string =>
  `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;

export const getMemoizedColor = memoize(getRandomColor);
