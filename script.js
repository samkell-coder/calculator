let display = document.getElementById('display');
let currentInput = '0';
let operator = null;
let previousValue = null;
function appendNumber(num) {
    if (currentInput === '0' && num !== '.') {
        currentInput = num;
    } else if (num === '.' && currentInput.includes('.')) {
        return;
    } else {
        currentInput += num;
    }
    updateDisplay();
}
function appendOperator(op) {
    if (operator !== null && currentInput !== '') {
        calculate();
    }
    operator = op;
    previousValue = currentInput;
    currentInput = '0';
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
    currentInput = result.toString();
    operator = null;
    previousValue = null;
    updateDisplay();
}
function clearDisplay() {
    currentInput = '0';
    operator = null;
    previousValue = null;
    updateDisplay();
}
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}
function updateDisplay() {
    display.textContent = currentInput;
}