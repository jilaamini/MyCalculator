'use strict';

import {
  AlphabeticFeatures,
  AngleUnit,
  ArithmaticOperators,
  Key,
  KeyLabel,
  RESET_VALUE
} from './constants.js';
import { getOpenedBrackets } from './validator.js';
const inputElement = document.querySelector('.calculator-input');

/**
 * This function modifies the input key to display a user-friendly version of it
 * on the screen.
 */
export function modifyDisplay(key) {
  let modifiedInput = key;

  // Some keys need to be modified before displaying them in the screen
  switch (key) {
    case Key.Answer:
      modifiedInput = KeyLabel.Answer;
      break;

    case Key.Sin:
      modifiedInput = KeyLabel.Sin;
      break;

    case Key.Cos:
      modifiedInput = KeyLabel.Cos;
      break;

    case Key.Tan:
      modifiedInput = KeyLabel.Tan;
      break;

    case Key.Multiplication:
      modifiedInput = KeyLabel.Multiplication;
      break;

    case Key.Division:
      modifiedInput = KeyLabel.Division;
      break;
  }

  // Clear the default zero value if the user begins typing every key but an
  // arithmatic keys or a percentage sign)
  if (
    inputElement.innerText === RESET_VALUE &&
    !ArithmaticOperators.includes(key) &&
    key !== Key.Percentage
  ) {
    inputElement.innerText = '';
  }

  // Switch the arithmetic operator if the user types a different one.
  if (ArithmaticOperators.includes(key)) {
    const lastCharacter = inputElement.innerText.slice(-1);
    if (ArithmaticOperators.includes(lastCharacter) && key !== lastCharacter) {
      inputElement.innerText = inputElement.innerText.slice(0, -1);
    }
  }

  // Add a multiplication sign after the Answer key or numbers followed by alphabetic
  // keys to enhance readability.
  if (AlphabeticFeatures.includes(key)) {
    if (inputElement.innerText.match(/[Ans|\d|)]\s*$/)) {
      modifiedInput = KeyLabel.Multiplication + modifiedInput;
    }
  }

  // Add a multiplication sign after the Answer key followed by a number to enhance readability.
  if (Number.isInteger(parseInt(key)) && inputElement.innerText.match(/[Ans|%]\s*$/)) {
    modifiedInput = KeyLabel.Multiplication + modifiedInput;
  }

  return modifiedInput;
}

/**
 * This function is responsible for modifying the input to ensure it forms a valid expression
 * before being evaluated by the eval function.
 */
export function modifyExpression(answer, angleUnit) {
  // Close any remaining open Brackets
  inputElement.innerText += ')'.repeat(getOpenedBrackets());

  // The modifications made here are not reflected in the input element directly
  // but are crucial for ensuring the expression's validity when evaluated by the eval function.
  let value = inputElement.innerText;
  value = value
    .replaceAll('Ans', answer)
    // replace all % with /100
    .replaceAll('%', '/100')
    // replace all x with *
    .replaceAll('×', '*')
    // replace all ÷ with /
    .replaceAll('÷', '/')
    // replace ( with *(
    .replace(/(\d+)\s*\(/g, '$1*(')
    // replace ) with )*
    .replace(/\)\s*(\d+)/g, ')*$1');

  // replace all triogometric with Math.sin
  if (angleUnit === AngleUnit.Degree) {
    value = value
      .replaceAll(/sin\(/g, 'Math.sin(')
      .replaceAll(/cos\(/g, 'Math.cos(')
      .replaceAll(/tan\(/g, 'Math.tan(');
  } else {
    // Convert degree to radian
    value = value
      .replaceAll(/sin\(/g, 'Math.sin(Math.PI/180*')
      .replaceAll(/cos\(/g, 'Math.cos(Math.PI/180*')
      .replaceAll(/tan\(/g, 'Math.tan(Math.PI/180*');
  }

  return value;
}
