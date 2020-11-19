(function (win) {
    var doc = win.document;
    win.$ = function (str) {
        return doc.querySelector(str);
    };
    win.Util = {
        css: function (_ele, _name, value) {
            if (arguments.length == 2 && _name) {
                return _ele.style[_name] || doc.defaultView.getComputedStyle(_ele, null)[_name];
            }
            else if (arguments.length == 3 && value)
                _ele.style[_name] = value;
        },
        addClass: function (_ele, _name) {
            var className = _ele.class || _ele.className;
            var reg = reg = new RegExp('(\\s|^)' + _name + '(\\s|$)');
            if (!className.match(reg)) {
                className = className + (className ? ' ' : '') + _name;
                _ele.className = className;
            }
        },
        remove:function (_ele) {
            while (_ele.firstChild){
                _ele.removeChild(_ele.firstChild);
            }
        },
        alert:function (msg) {
            doc.getElementById("alertContent").innerHTML = msg;
            doc.getElementById("alert").style['display'] = 'block';
        }
    }
})(window);