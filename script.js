let display = document.getElementById('display');
let operationDisplay = document.getElementById('operation');
let currentInput = '0';
let operator = null;
let previousValue = null;
let shouldResetDisplay = false;

// Operator symbols mapping
const operatorSymbols = {
    '+': '+',
    '-': '−',
    '*': '×',
    '/': '÷'
};

function appendNumber(num) {
    if (shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        if (currentInput === '0' && num !== '.') {
            currentInput = num;
        } else if (num === '.' && currentInput.includes('.')) {
            return;
        } else {
            currentInput += num;
        }
    }
    updateDisplay();
}

function appendOperator(op) {
    // If there's already an operator and we have input, calculate the result first
    if (operator !== null && currentInput !== '0' && !shouldResetDisplay) {
        calculate();
    }
    
    operator = op;
    previousValue = currentInput;
    shouldResetDisplay = true;
    updateOperationDisplay();
}

function calculate() {
    if (operator === null || previousValue === null) {
        return;
    }
    
    let result;
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentInput);

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = current !== 0 ? prev / current : 0;
            break;
        default:
            return;
    }

    // Format the result to avoid long decimals
    result = Math.round(result * 1000000) / 1000000;
    
    currentInput = result.toString();
    operator = null;
    previousValue = null;
    shouldResetDisplay = true;
    updateDisplay();
    operationDisplay.textContent = '';
}

function calculatePercentage() {
    const current = parseFloat(currentInput);
    
    if (operator === null) {
        // If no operator, divide by 100
        currentInput = (current / 100).toString();
    } else {
        // If there's an operator, calculate percentage of previous value
        const prev = parseFloat(previousValue);
        const percentage = (prev * current) / 100;
        currentInput = percentage.toString();
    }
    
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    operator = null;
    previousValue = null;
    shouldResetDisplay = false;
    operationDisplay.textContent = '';
    updateDisplay();
}

function deleteLastChar() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function updateDisplay() {
    // Format the number to remove unnecessary decimals
    let displayValue = currentInput;
    
    // Check if the number is a whole number
    if (!isNaN(displayValue) && displayValue !== '') {
        const num = parseFloat(displayValue);
        if (Number.isInteger(num)) {
            displayValue = Math.round(num).toString();
        }
    }
    
    display.textContent = displayValue;
}

function updateOperationDisplay() {
    if (operator && previousValue) {
        const symbol = operatorSymbols[operator] || operator;
        operationDisplay.textContent = `${previousValue} ${symbol}`;
    }
}

// Initialize display
updateDisplay();