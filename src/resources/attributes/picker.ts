import { inject, bindable, Container, ViewEngine, View, bindingMode} from 'aurelia-framework';
import { DOM } from 'aurelia-pal';

@inject(Element, Container,  ViewEngine)
export class PickerCustomAttribute {
  show = false;
  mouseupListener: EventListener;
  focusListener: EventListener;
  divElement: HTMLElement;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) value: any;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) items: Array<any>;

  constructor(private element: any, private container: Container, private viewEngine: ViewEngine) {
    this.mouseupListener = e => this.handleMouseUp(e);
    this.focusListener = e => this.handleFocus(e);
  }

  isInputElement() {
    return this.element.nodeType === 1 && this.element.tagName.toLowerCase() == 'input';
  }
  inElement(e) {
    let containerRect = this.divElement.getBoundingClientRect();
    let elementRect = this.element.getBoundingClientRect();
    let inContainerRect = e.clientX > containerRect.left && e.clientX < containerRect.right && e.clientY > containerRect.top && e.clientY < containerRect.bottom;
    let inElementRect = e.clientX > elementRect.left && e.clientX < elementRect.right && e.clientY > elementRect.top && e.clientY < elementRect.bottom;
    return inContainerRect && inElementRect
  }
  pick(item) {
    this.value = item;
    if (this.isInputElement()) {
      //Since we're not binding the value on the input element we update it here.
      this.element.value = item;
    }

    this.removePicker();
  }
  handleMouseUp(e) {
    if (!this.isInputElement() && !this.show) {
      this.createPicker();
    }
    if (this.show && !this.inElement(e)) {
        this.removePicker();
    }
  }

  handleFocus(e) {
    if (e.type === 'focus' && !this.show) {
      this.createPicker();
    }
    if (e.type === 'blur') {
      if (this.isInputElement() && this.element.value !== this.value && typeof this.value !== "undefined") {
        this.element.value = this.value;
      }
    }
  }

  createPicker() {
    this.viewEngine.loadViewFactory('resources/attributes/picker.html').then(factory => {
      const childContainer = this.container.createChild();
      const view = factory.create(childContainer);

      view.bind(this);

      this.createElement(view)
      this.setPosition()

      if (this.isInputElement)
        document.addEventListener('mouseup', this.mouseupListener);

      this.show = true;
    })

  }

  removePicker() {
    const body = DOM.querySelectorAll('body')[0];
    body.removeChild(this.divElement);

    if (this.isInputElement)
      document.removeEventListener('mouseup', this.mouseupListener);

    this.show = false;

  }

  createElement(view: View) {
    const body = DOM.querySelectorAll('body')[0];

    this.divElement = <HTMLElement>DOM.createElement('div');
    view.appendNodesTo(this.divElement);
    body.insertBefore(this.divElement, body.firstChild);
  }

  setPosition() {
    const elementRect = this.element.getBoundingClientRect();
    const left = elementRect.left + window.scrollX;
    const height = this.divElement.getBoundingClientRect().height;
    var top = elementRect.top + elementRect.height;

    top = ((top+height) < window.innerHeight) ? top + window.scrollY : (elementRect.top - height + window.scrollY);

    this.divElement.style.top = top + 'px';
    this.divElement.style.left = left + 'px';
    this.divElement.style.position = 'absolute';
    this.divElement.style.zIndex = '2001';
  }

  attached() {
    if (this.isInputElement()) {
      this.element.addEventListener('focus', this.focusListener);
      this.element.addEventListener('blur', this.focusListener);
    } else {
      this.element.addEventListener('click', this.mouseupListener);
    }
  }

  detached() {
    if (this.isInputElement) {
      this.element.removeEventListener('focus', this.focusListener);
      this.element.removeEventListener('blur', this.focusListener);
    } else {
      this.element.removeEventListner('click', this.mouseupListener);
    }
    document.removeEventListener('mouseup', this.mouseupListener);
  }
}
