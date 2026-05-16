class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('不能除以零！');
                    this.clear();
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        // 处理浮点数精度问题
        computation = Math.round(computation * 1000000000) / 1000000000;
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// 获取DOM元素
const previousOperandTextElement = document.querySelector('.previous-operand');
const currentOperandTextElement = document.querySelector('.current-operand');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('.equals');
const deleteButton = document.querySelector('.delete');
const allClearButton = document.querySelector('.clear');

// 创建计算器实例
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// 添加数字按钮事件监听
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.getAttribute('data-number'));
        calculator.updateDisplay();
    });
});

// 添加运算符按钮事件监听
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.getAttribute('data-operator'));
        calculator.updateDisplay();
    });
});

// 添加等号按钮事件监听
equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
});

// 添加清除按钮事件监听
allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
});

// 添加删除按钮事件监听
deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
});

// 添加键盘支持
document.addEventListener('keydown', event => {
    if ((event.key >= 0 && event.key <= 9) || event.key === '.') {
        calculator.appendNumber(event.key);
        calculator.updateDisplay();
    }
    if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        let operator = event.key;
        if (operator === '*') operator = '×';
        if (operator === '/') operator = '÷';
        calculator.chooseOperation(operator);
        calculator.updateDisplay();
    }
    if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculator.compute();
        calculator.updateDisplay();
    }
    if (event.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    }
    if (event.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }
});
