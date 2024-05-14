import { Calculator } from './src/calculator.js';

const calculator = new Calculator();

window.handleKeyPress = calculator.handleKeyPress;
window.toggleAngleUnit = calculator.toggleAngleUnit;
