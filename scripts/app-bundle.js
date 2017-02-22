var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var App = (function () {
        function App() {
            this.inputList = [
                "Chocolate",
                "Vanilla",
                "Orange"
            ];
            this.buttonList = [
                "Jump",
                "Run",
                "Skip",
                "Walk"
            ];
            this.message = 'Hello World!';
        }
        return App;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], App.prototype, "inputValue", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], App.prototype, "buttonValue", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], App.prototype, "inputList", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], App.prototype, "buttonList", void 0);
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
        config.globalResources(['resources/attributes/picker']);
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/attributes/picker',["require", "exports", "aurelia-framework", "aurelia-pal"], function (require, exports, aurelia_framework_1, aurelia_pal_1) {
    "use strict";
    var PickerCustomAttribute = (function () {
        function PickerCustomAttribute(element, container, viewEngine) {
            var _this = this;
            this.element = element;
            this.container = container;
            this.viewEngine = viewEngine;
            this.show = false;
            this.mouseupListener = function (e) { return _this.handleMouseUp(e); };
            this.focusListener = function (e) { return _this.handleFocus(e); };
        }
        PickerCustomAttribute.prototype.attached = function () {
            if (this.isInputElement()) {
                this.element.addEventListener('focus', this.focusListener);
                this.element.addEventListener('blur', this.focusListener);
            }
            else {
                this.element.addEventListener('click', this.mouseupListener);
            }
        };
        PickerCustomAttribute.prototype.detached = function () {
            if (this.isInputElement) {
                this.element.removeEventListener('focus', this.focusListener);
                this.element.removeEventListener('blur', this.focusListener);
            }
            else {
                this.element.removeEventListner('click', this.mouseupListener);
            }
            document.removeEventListener('mouseup', this.mouseupListener);
        };
        PickerCustomAttribute.prototype.pick = function (item) {
            this.value = item;
            if (this.isInputElement()) {
                this.element.value = item;
            }
            this.removePicker();
        };
        PickerCustomAttribute.prototype.handleMouseUp = function (e) {
            if (!this.isInputElement() && !this.show) {
                this.createPicker();
            }
            if (this.show) {
                var containerRect = this.divElement.getBoundingClientRect();
                var elementRect = this.element.getBoundingClientRect();
                var inContainerRect = e.clientX > containerRect.left && e.clientX < containerRect.right && e.clientY > containerRect.top && e.clientY < containerRect.bottom;
                var inElementRect = e.clientX > elementRect.left && e.clientX < elementRect.right && e.clientY > elementRect.top && e.clientY < elementRect.bottom;
                if (!inContainerRect && !inElementRect) {
                    this.removePicker();
                }
            }
        };
        PickerCustomAttribute.prototype.handleFocus = function (e) {
            if (e.type === 'focus' && !this.show) {
                this.createPicker();
            }
            if (e.type === 'blur') {
                if (this.isInputElement() && this.element.value !== this.value && typeof this.value !== "undefined") {
                    this.element.value = this.value;
                }
            }
        };
        PickerCustomAttribute.prototype.isInputElement = function () {
            return this.element.nodeType === 1 && this.element.tagName.toLowerCase() == 'input';
        };
        PickerCustomAttribute.prototype.createPicker = function () {
            var _this = this;
            this.viewEngine.loadViewFactory('resources/attributes/picker.html').then(function (factory) {
                var childContainer = _this.container.createChild();
                var view = factory.create(childContainer);
                view.bind(_this);
                _this.addElement(view);
                if (_this.isInputElement)
                    document.addEventListener('mouseup', _this.mouseupListener);
                _this.show = true;
            });
        };
        PickerCustomAttribute.prototype.removePicker = function () {
            var body = aurelia_pal_1.DOM.querySelectorAll('body')[0];
            body.removeChild(this.divElement);
            if (this.isInputElement)
                document.removeEventListener('mouseup', this.mouseupListener);
            this.show = false;
        };
        PickerCustomAttribute.prototype.addElement = function (view) {
            var body = aurelia_pal_1.DOM.querySelectorAll('body')[0];
            this.divElement = aurelia_pal_1.DOM.createElement('div');
            view.appendNodesTo(this.divElement);
            var elementRect = this.element.getBoundingClientRect();
            var left = elementRect.left + window.scrollX;
            var height = this.divElement.getBoundingClientRect().height;
            var top = elementRect.top + elementRect.height;
            top = ((top + height) < window.innerHeight) ? top + window.scrollY : (elementRect.top - height + window.scrollY);
            this.divElement.style.top = top + 'px';
            this.divElement.style.left = left + 'px';
            this.divElement.style.position = 'absolute';
            this.divElement.style.zIndex = '2001';
            body.insertBefore(this.divElement, body.firstChild);
        };
        return PickerCustomAttribute;
    }());
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], PickerCustomAttribute.prototype, "value", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Array)
    ], PickerCustomAttribute.prototype, "items", void 0);
    PickerCustomAttribute = __decorate([
        aurelia_framework_1.inject(Element, aurelia_framework_1.Container, aurelia_framework_1.ViewEngine),
        __metadata("design:paramtypes", [Object, aurelia_framework_1.Container, aurelia_framework_1.ViewEngine])
    ], PickerCustomAttribute);
    exports.PickerCustomAttribute = PickerCustomAttribute;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <h1>Custom Attribute with a View</h1>\n  <button picker=\"value.bind:buttonValue; items.bind:buttonList\">Click me</button>\n  <p>The value of button is: ${buttonValue}</p>\n  <input type=\"text\" picker=\"value.bind:inputValue; items.bind:inputList\">\n  <p>the value of input is: ${inputValue}</p>\n</template>\n"; });
define('text!resources/attributes/picker.css', ['module'], function(module) { module.exports = ".picker {\r\n  background-color: #fff;\r\n  box-shadow: 0px 0px 10px 2px rgba(40,40,40,0.25);\r\n  border: 1px solid #e4e4e4;\r\n}\r\n.picker > ul {\r\n  list-style: none;\r\n  margin: 0px;\r\n  padding: 0px;\r\n}\r\n.picker > ul > li {\r\n  line-height: 1.5em;\r\n  cursor: pointer;\r\n  padding: 0.5em\r\n}\r\n.picker > ul > li:hover, .picker > ul > li.active {\r\n  background: #c7c7c7;\r\n}\r\n"; });
define('text!resources/attributes/picker.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./picker.css\"></require>\r\n  <div class=\"picker\">\r\n    <ul>\r\n      <li repeat.for=\"item of items\" click.trigger=\"pick(item)\" class=\"${value === item ? 'active' : ''}\">${item}</li>\r\n    </ul>\r\n  </div>\r\n</template>\r\n"; });
//# sourceMappingURL=app-bundle.js.map