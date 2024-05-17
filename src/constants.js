export const AngleUnit = Object.freeze({
  Degree: 'Deg',
  Radian: 'Rad'
});

export const ClearingState = Object.freeze({
  // AC: All Clear
  AllClear: 'AC',
  // C: Clear (Backspace)
  Clear: 'C'
});

export const HistoryBar = Object.freeze({
  Answer: 'Answer',
  Equation: 'Equation',
  Empty: 'Empty'
});

export const Key = Object.freeze({
  Zero: '0',
  One: '1',
  Two: '2',
  Three: '3',
  Four: '4',
  Five: '5',
  Six: '6',
  Seven: '7',
  Eight: '8',
  Nine: '9',
  Plus: '+',
  Minus: '-',
  Multiplication: '*',
  Division: '/',
  Percentage: '%',
  FloatingPoint: '.',
  OpeningBracket: '(',
  ClosingBracket: ')',
  Equality: '=',
  Enter: 'enter',
  Backspace: 'backspace',
  Sin: 's',
  Cos: 'c',
  Tan: 't',
  Answer: 'a'
});

// Special Key labels to be displayed on the calculator screen
export const KeyLabel = Object.freeze({
  Answer: 'Ans',
  Sin: 'sin(',
  Cos: 'cos(',
  Tan: 'tan(',
  Multiplication: '×',
  Division: '÷'
});

export const ArithmaticKeys = [Key.Plus, Key.Minus, Key.Multiplication, Key.Division];

export const AlphabeticKeys = [Key.Sin, Key.Cos, Key.Tan, Key.Answer];

export const RESET_VALUE = '0';

// Add a Non-breaking space to avoid the history bar from collapsing
export const RESET_HISTOTY_BAR = '\xa0';

export const ANSWER_PREFIX = 'Ans = ';

export const ERROR_MESSAGE = 'Error';
