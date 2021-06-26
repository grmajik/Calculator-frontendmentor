"use strict";

if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
	console.log('🎉 Dark mode is supported');
}

const themeThumb = document.getElementById('themeSlider');

themeThumb.addEventListener('click', e => {
	const value = e.target.value;
	setTheme(value);
	switchTheme(value);
})

function setTheme(value) {
	switch (value) {
		case '1':
			localStorage.setItem('theme', 'blue-theme');
			break;
		case '2':
			localStorage.setItem('theme', 'beige-theme');
			break;
		case '3':
			localStorage.setItem('theme', 'purple-theme');
			break;
	}
}

function switchTheme(value) {
	const currentTheme = localStorage.getItem('theme');
	if (currentTheme === 'blue-theme') {
		document.documentElement.className = '';
		document.documentElement.classList.add('blue-theme');
	} else if (currentTheme === 'beige-theme') {
		document.documentElement.className = '';
		document.documentElement.classList.add('beige-theme');
	} else if (currentTheme === 'purple-theme') {
		document.documentElement.className = '';
		document.documentElement.classList.add('purple-theme');
	}
};

switchTheme();

const calculator = {
	displayValue: '0',
	firstOperand: null,
	waitingForSecondOperand: false,
	operator: null,
};

function inputDigit(digit) {
	const { displayValue, waitingForSecondOperand } = calculator;
	if (waitingForSecondOperand) {
		calculator.displayValue = digit;
		calculator.waitingForSecondOperand = false;
	} else {
		calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
	}
}

function deleteDigit(digit) {
	const { displayValue } = calculator;
	calculator.displayValue = displayValue.slice(0, -1);
	console.log(calculator);
}

function inputDecimal(dot) {
	if (calculator.waitingForSecondOperand) {
		calculator.displayValue = "0.";
		calculator.waitingForSecondOperand = false;
		return;
	}
	if (!calculator.displayValue.includes(dot)) {
		calculator.displayValue += dot;
	}
}

function handleOperator(nextOperator) {
	const { firstOperand, displayValue, operator } = calculator; //object destructuring
	const inputValue = parseFloat(displayValue);

	if (operator && calculator.waitingForSecondOperand) {
		calculator.operator = nextOperator;
		return;
	}

	if (firstOperand == null && !isNaN(inputValue)) {
		calculator.firstOperand = inputValue;
	} else if (operator) {
		const result = calculate(firstOperand, inputValue, operator);

		calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
		calculator.firstOperand = result;
	}
	calculator.waitingForSecondOperand = true;
	calculator.operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
	if (operator === "+") {
		return firstOperand + secondOperand;
	} else if (operator === "-") {
		return firstOperand - secondOperand;
	} else if (operator === "*") {
		return firstOperand * secondOperand;
	} else if (operator === "/") {
		return firstOperand / secondOperand;
	}
	return secondOperand;
}

function resetCalculator() {
	calculator.displayValue = '0';
	calculator.firstOperand = null;
	calculator.waitingForSecondOperand = false;
	calculator.operator = null;
}

function updateDisplay() {
	const screen = document.querySelector('.calc-screen');
	screen.value = calculator.displayValue;
}

const buttons = document.querySelector('.calc-buttons');

buttons.addEventListener('click', (e) => {
	const value = e.target.value;
	if (!e.target.matches('button')) {
		return;
	}
	switch (value) {
		case '+':
		case '-':
		case '*':
		case '/':
		case '=':
			handleOperator(value);
			break;
		case '.':
			inputDecimal(value);
			break;
		case 'all-clear':
			resetCalculator();
			break;
		case 'delete':
			deleteDigit();
			break;
		default:
			if (Number.isInteger(parseFloat(value))) {
				inputDigit(value);
			}
	}
	updateDisplay();
})
updateDisplay();