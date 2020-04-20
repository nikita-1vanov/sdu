'use strict';
var multiItemSlider = (function () {
    return function (selector, config) {
        var
            _mainElement = document.querySelector(selector), // основный элемент блока
            _sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
            _sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
            _sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
            _sliderControlLeft = _mainElement.querySelector('.slider__control_left'), // кнопка "LEFT"
            _sliderControlRight = _mainElement.querySelector('.slider__control_right'), // кнопка "RIGHT"
            _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
            _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента
            _positionLeftItem = 0, // позиция левого активного элемента
            _transform = 0, // значение транфсофрмации .slider_wrapper
            _step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
            _items = []; // массив элементов
        // наполнение массива _items

        if (!Array.prototype.forEach) {

            Array.prototype.forEach = function (callback, thisArg) {

                var T, k;

                if (this == null) {
                    throw new TypeError(" this is null or not defined");
                }

                // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
                var O = Object(this);

                // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
                // 3. Let len be ToUint32(lenValue).
                var len = O.length >>> 0;

                // 4. If IsCallable(callback) is false, throw a TypeError exception.
                // See: http://es5.github.com/#x9.11
                if (typeof callback !== "function") {
                    throw new TypeError(callback + " is not a function");
                }

                // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (arguments.length > 1) {
                    T = thisArg;
                }

                // 6. Let k be 0
                k = 0;

                // 7. Repeat, while k < len
                while (k < len) {

                    var kValue;

                    // a. Let Pk be ToString(k).
                    //   This is implicit for LHS operands of the in operator
                    // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
                    //   This step can be combined with c
                    // c. If kPresent is true, then
                    if (k in O) {

                        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                        kValue = O[k];

                        // ii. Call the Call internal method of callback with T as the this value and
                        // argument list containing kValue, k, and O.
                        callback.call(T, kValue, k, O);
                    }
                    // d. Increase k by 1.
                    k++;
                }
                // 8. return undefined
            };
        }

        _sliderItems.forEach(function (item, index) {
            _items.push({ item: item, position: index, transform: 0 });
        });


        var position = {
            getMin: 0,
            getMax: _items.length - 1,
        }

        var _transformItem = function (direction) {
            if (direction === 'right') {
                if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) >= position.getMax) {
                    return;
                }
                if (!_sliderControlLeft.classList.contains('slider__control_show')) {
                    _sliderControlLeft.classList.add('slider__control_show');
                }
                if (_sliderControlRight.classList.contains('slider__control_show') && (_positionLeftItem + _wrapperWidth / _itemWidth) >= position.getMax) {
                    _sliderControlRight.classList.remove('slider__control_show');
                }
                _positionLeftItem++;
                _transform -= _step;
            }
            if (direction === 'left') {
                if (_positionLeftItem <= position.getMin) {
                    return;
                }
                if (!_sliderControlRight.classList.contains('slider__control_show')) {
                    _sliderControlRight.classList.add('slider__control_show');
                }
                if (_sliderControlLeft.classList.contains('slider__control_show') && _positionLeftItem - 1 <= position.getMin) {
                    _sliderControlLeft.classList.remove('slider__control_show');
                }
                _positionLeftItem--;
                _transform += _step;
            }
            _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
        }

        // обработчик события click для кнопок "назад" и "вперед"
        var _controlClick = function (e) {
            if (e.target.classList.contains('slider__control')) {
                e.preventDefault();
                var direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
                _transformItem(direction);
            }
        };

        var _setUpListeners = function () {
            // добавление к кнопкам "назад" и "вперед" обрботчика _controlClick для событя click
            _sliderControls.forEach(function (item) {
                item.addEventListener('click', _controlClick);
            });
        }

        // инициализация
        _setUpListeners();

        return {
            right: function () { // метод right
                _transformItem('right');
            },
            left: function () { // метод left
                _transformItem('left');
            }
        }

    }
}());

var slider = multiItemSlider('.slider')