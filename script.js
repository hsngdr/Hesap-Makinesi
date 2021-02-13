(function () {
    'use strict';
    var result;
    var currNum;
    var prevResult;
    var history;
    var prevBtn;
    var mathOp;
    var prevMathOp;
    var mathOpCount;
    var mathOpPress;
    var isInit;
    var mainScreen = document.querySelector('#main');
    var historyScreen = document.querySelector('#history');

    Array.prototype.forEach.call(document.querySelectorAll('.button'), function (btn) {
        btn.addEventListener('click', function (e) {
            var btnClicked = e.currentTarget.getAttribute('data-value');
            input(btnClicked);
        });
    });

    function init() {
        result = null;
        currNum = 0;
        prevBtn = null;
        mathOp = null;
        prevMathOp = null;
        mathOpCount = 0;
        history = '';
        mathOpPress = false;
        isInit = true;
        updateMainScreen(0);
        updateHistoryScreen(history);
    }

    //
    function input(btn) {

        if (!isNaN(prevBtn) && btn !== '=' && btn !== 'C' && btn !== 'CE' && btn !== 'CS' && btn !== '.') {
            prevMathOp = mathOp;
        }

        switch (btn) {
            case '+': mathOpPress = true; mathOp = addition; break;
            case '-': mathOpPress = true; mathOp = subtraction; break;
            case '/': mathOpPress = true; mathOp = division; break;
            case '*': mathOpPress = true; mathOp = multiplication; break;
            case 'C': init(); break;
        }

        handler(btn);


        var fontSize = parseFloat(mainScreen.style.fontSize);
        if (fontSize < 3 && currNum.length < 11) {
            mainScreen.style.fontSize = '3rem';
        }

        console.log('Result: ' + result);
        console.log('Prev result: ' + prevResult);
        console.log('current number: ' + currNum);
        console.log('btn: ' + btn);
        console.log('Prev Math Op: ' + prevMathOp);
        console.log('Math Op Counter: ' + mathOpCount);
        console.log('Prev btn: ' + prevBtn);
        console.log('History: ' + history);
        console.log('Main Screen ' + mainScreen.value);
        console.log('*'.repeat(15));
    }

    function handler(btn) {
        if (btn !== 'C' && result === 'Result is undefined' || result === 'Cannot divide by zero') {
            return;
        }

        if (btn !== '=' && btn !== 'C' && btn !== 'CE' && btn !== 'CS') {
            history = (isNaN(prevBtn) && isNaN(btn)) ? history.slice(0, -1) + btn : history + btn;
        }

        if (!isNaN(btn) || btn === '.') {
            if (btn === '.' && /^\d+$/.test(currNum)) {
                currNum = currNum + btn;
            } else if (!isNaN(btn)) {
                currNum = (!isNaN(prevBtn) && prevBtn !== null && mainScreen.value !== '0') || prevBtn === '.' ? currNum + btn : btn;
            }
            mathOpPress = false;
            updateMainScreen(currNum);
        } else {

            if (btn === '-' || btn === '+' || btn === '*' || btn === '/') {
                if ((prevBtn === null || prevBtn === '=') && !isInit) {
                    history = '0' + btn;
                    mathOpCount++;
                }

                if (!historyScreen.value.length && mainScreen.value.length) {
                    history = mainScreen.value + btn;
                }
            }

            if (mathOp && result === null) {
                result = Number(currNum);
            }

            if (btn === '%') {
                history = history.slice(0, -(currNum.length + 1));
                currNum = percentage(currNum, result);
                history += currNum + ' ';
                updateMainScreen(currNum);
            } else if (btn === 'sqr' || btn === 'sqrt' || btn === '1/x') {
                history = history.slice(0, -(currNum.length + btn.length)) + (btn === '1/x' ? '1/(' + currNum + ') ' : btn + '(' + currNum + ') ');
                currNum = (btn === 'sqr') ? square(currNum) : (btn === 'sqrt') ? squareRoot(currNum) : fraction(currNum);
                updateMainScreen(currNum);
                updateHistoryScreen(history);
            }

            if (btn === '=') {
                if (mathOp) {
                    mathOpCount = 0;
                    if (mathOpPress) {
                        mathOp(prevResult);
                    } else {
                        mathOp(Number(currNum));
                    }

                    history = '';
                    prevBtn = btn;

                    updateMainScreen(result);
                    updateHistoryScreen(history);

                    return;
                }
            }


            if (isNaN(btn) && (!isNaN(prevBtn) || prevBtn === '%' || prevBtn === 'sqr' || prevBtn === 'sqrt' || prevBtn === '1/x') &&
                btn !== '=' && btn !== 'C' && btn !== 'CE' && btn !== 'CS' && btn !== '.' && btn !== '%' && btn !== 'sqr' & btn !== 'sqrt' && btn !== '1/x') {
                mathOpCount++;
            }

            if (mathOpCount >= 2 && (!isNaN(prevBtn) || prevBtn === 'sqrt' || prevBtn === 'sqr' || prevBtn === '1/x' || prevBtn === '%') && btn !== 'CE' && btn !== 'CS') {
                prevMathOp(Number(currNum));
                updateMainScreen(result);
            }

            if (btn === 'CE' && history.length > 0) {
                history = history.slice(0, -(currNum.length));
                currNum = '0';
                updateMainScreen(0);
            } else if (btn === 'CS') {
                if (result != mainScreen.value) {
                    currNum = currNum.slice(0, -1);
                    history = history.slice(0, -1);
                    if (!currNum.length) {
                        currNum = '0';
                    }
                    updateMainScreen(currNum);
                } else {
                    return;
                }
            }

            if (result !== null && btn !== 'CE' && btn !== 'CS') {
                updateHistoryScreen(history);
            }
        }

        prevBtn = btn;
        prevResult = result;
        isInit = false;
    }

    function updateMainScreen(val) {

        val = String(val);

        if (val.length > 10) {
            mainScreen.style.fontSize = '1.75rem';
            val = Math.round(val * 10000000000000000) / 10000000000000000;
        }

        mainScreen.value = val;
    }

    function updateHistoryScreen(history) {
        historyScreen.value = history;
    }

    function addition(val) {
        result += val;
    }

    function subtraction(val) {
        result -= val;
    }

    function division(val) {
        result /= val;
    }

    function multiplication(val) {
        result *= val;
    }

    function square(val) {
        return val * val;
    }

    function squareRoot(val) {
        return Math.sqrt(val);
    }

    function percentage(val, res) {
        return res * val / 100;
    }

    function fraction(val) {
        return 1 / val;
    }

    init();

})();
