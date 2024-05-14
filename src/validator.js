'use strict';
import { Key } from './constants.js';

const inputElement = document.querySelector('.calculator-input');

/** This function validate the input key*/
export function isValidKey(key) {
  if (!Object.values(Key).includes(key)) {
    return false;
  }

  switch (key) {
    case Key.CloseBracket:
      if (getOpenedBrackets() <= 0) {
        return false;
      }
      break;
    case Key.Plus:
    case Key.Minus:
    case Key.Multiplication:
    case Key.Division:
      // Avoid multiple identical arithmetic operators in succession.
      const prevoiusCharacter = inputElement.innerText[inputElement.innerText.length - 1];
      if (prevoiusCharacter === key) {
        return false;
      }
      break;

    case Key.FlaotingPoint:
      // Avoid multiple dots in a number
      if (inputElement.innerText.match(/\.\d*$/)) {
        return false;
      }
      break;
  }
  return true;
}

export function getOpenedBrackets() {
  return (
    (inputElement.innerText.match(/\(/g) || []).length -
    (inputElement.innerText.match(/\)/g) || []).length
  );
}
