'use strict';
import {
  ANSWER_PREFIX,
  AngleUnit,
  ClearState,
  HistoryBar,
  Key,
  RESET_HISTOTY_BAR,
  RESET_VALUE
} from './constants.js';
import { modifyDisplay, modifyExpression } from './modifier.js';
import { isValidKey } from './validator.js';

export class Calculator {
  // Keep track of the current answer. (For memory functionality)
  answer = 0;
  // Determine whether to display the historical answer, the input equation, or nothing.
  histroryBar = HistoryBar.Nothing;
  // Whether cleat all or clear one key(backspace).
  clearingState = ClearState.Clear;
  angleUnit = AngleUnit.Degree;

  constructor() {
    this.inputElement = document.querySelector('.calculator-input');
    this.historyElement = document.querySelector('.calculator-history');
    this.clearElement = document.querySelector('.calculator-clear');

    window.addEventListener('keydown', e => {
      this.handleKeyPress(e.key);
    });
  }

  handleKeyPress = key => {
    key = key.toLowerCase();

    if (!isValidKey(key)) {
      return;
    }

    switch (key) {
      case Key.Clear:
      case Key.Backspace:
        this.handleClear();
        break;

      case Key.Equality:
      case Key.Enter:
        this.handleEquality();
        break;

      default:
        // Change the clear button to Clear
        this.clearingState = ClearState.Clear;
        this.clearElement.innerText = ClearState.Clear;

        // Display the historical answer when the user begins typing after the previous calculation.
        if (this.histroryBar === HistoryBar.Input && key !== Key.Equality && key !== Key.Enter) {
          this.historyElement.innerText = ANSWER_PREFIX + this.answer;
          this.inputElement.innerText = RESET_VALUE;
          this.histroryBar = HistoryBar.Answer;
        }

        const modifiedInput = modifyDisplay(key);
        this.inputElement.innerText += modifiedInput;
    }
  };

  handleAc = input => {
    if (input === Key.Backspace || input === Key.Clear) {
      return;
    } else if (input === Key.Enter || input === Key.Equality) {
      this.clearingState = ClearState.AllClear;
      this.clearElement.innerText = 'AC';
    } else {
      this.clearingState = ClearState.Clear;
      this.clearElement.innerText = 'C';
    }
  };

  toggleAngleUnit = () => {
    const degElement = document.querySelector('.deg');
    if (this.angleUnit === AngleUnit.Degree) {
      degElement.innerText = AngleUnit.Radian;
      this.angleUnit = AngleUnit.Radian;
    } else {
      degElement.innerText = AngleUnit.Degree;
      this.angleUnit = AngleUnit.Degree;
    }
  };

  handleClear = () => {
    if (this.clearingState === ClearState.AllClear) {
      // Reset the input.
      this.inputElement.innerText = RESET_VALUE;

      // Reset the history bar.
      this.histroryBar = HistoryBar.Nothing;
      this.historyElement.innerText = RESET_HISTOTY_BAR;
    } else {
      // Remove trigonometric keys in one step.
      const trigonometricPattern = /[tan,cos,sin]\($/g;
      if (trigonometricPattern.test(this.inputElement.innerText)) {
        this.inputElement.innerText = this.inputElement.innerText.substring(
          0,
          this.inputElement.innerText.length - 4
        );
      } else if (this.inputElement.innerText.match(/Ans$/g)) {
        // Remove the Answer key in one step.
        this.inputElement.innerText = this.inputElement.innerText.substring(
          0,
          this.inputElement.innerText.length - 3
        );
      } else {
        // Otherwise Remove the last character (backspace)
        this.inputElement.innerText = this.inputElement.innerText.substring(
          0,
          this.inputElement.innerText.length - 1
        );
      }

      // Restore the default value if the input is empty.
      if (this.inputElement.innerText === '') {
        this.inputElement.innerText = RESET_VALUE;
      }
    }
  };

  handleEquality = () => {
    const transformed = modifyExpression(this.answer, this.angleUnit);

    // Show the equation input at the history bar.
    this.histroryBar = HistoryBar.Input;
    this.historyElement.innerText = this.inputElement.innerText + Key.Equality;

    // Change the clear button to AllClear
    this.clearingState = ClearState.AllClear;
    this.clearElement.innerText = ClearState.AllClear;

    try {
      const result = eval(transformed);
      this.inputElement.innerText = isNaN(result) ? 'Error' : result;
      this.answer = isNaN(result) ? this.answer : result;
    } catch (error) {
      this.inputElement.innerText = 'Error';
    }
  };
}
