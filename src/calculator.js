'use strict';
import {
  ANSWER_PREFIX,
  AngleUnit,
  ClearingState,
  ERROR_MESSAGE,
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
  // Determine whether to display the historical answer, the input equation, or empty.
  historyBar = HistoryBar.Empty;
  // Whether clear all or clear one key(backspace).
  clearingState = ClearingState.Clear;
  // Degree or Radian
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
      case Key.Backspace:
        this.handleClearKey();
        break;

      case Key.Equality:
      case Key.Enter:
        this.handleEqualityKey();
        break;

      default:
        // Change the clear button to Clear state
        this.clearingState = ClearingState.Clear;
        this.clearElement.innerText = ClearingState.Clear;

        // Display the historical answer when the user begins typing after the previous equation.
        if (this.historyBar === HistoryBar.Equation) {
          this.historyElement.innerText = ANSWER_PREFIX + this.answer;
          this.historyBar = HistoryBar.Answer;

          this.inputElement.innerText = RESET_VALUE;
        }

        // Apply necessary modifications to enhance user-friendliness before displaying the input.
        const modifiedInput = modifyDisplay(key);

        this.inputElement.innerText += modifiedInput;
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

  handleClearKey = () => {
    if (this.clearingState === ClearingState.AllClear) {
      // Reset the input.
      this.inputElement.innerText = RESET_VALUE;

      // Reset the history bar.
      this.historyBar = HistoryBar.Empty;
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

  handleEqualityKey = () => {
    const originalExpression = this.inputElement.innerText;
    const transformedExpression = modifyExpression(this.answer, this.angleUnit);

    // Show the equation input at the history bar.
    this.historyBar = HistoryBar.Equation;
    this.historyElement.innerText = this.inputElement.innerText + Key.Equality;

    // Change the clear button to AllClear
    this.clearingState = ClearingState.AllClear;
    this.clearElement.innerText = ClearingState.AllClear;

    try {
      const newResult = eval(transformedExpression);
      const error = isNaN(newResult) || !isFinite(newResult);
      this.inputElement.innerText = error ? ERROR_MESSAGE : newResult;
      this.answer = error ? this.answer : newResult;
    } catch (error) {
      this.inputElement.innerText = ERROR_MESSAGE;
      console.info(`Original expression: ${originalExpression}`);
      console.info(`Tranformed expression: ${transformedExpression}`);
      console.error(`Error message: `, error);
    }
  };
}
