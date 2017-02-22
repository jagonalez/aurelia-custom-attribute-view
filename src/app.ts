import { bindable } from 'aurelia-framework';

export class App {
  @bindable inputValue: any;
  @bindable buttonValue: any;
  @bindable inputList = [
    "Chocolate",
    "Vanilla",
    "Orange"
  ]
  @bindable buttonList = [
    "Jump",
    "Run",
    "Skip",
    "Walk"
  ]
  message = 'Hello World!';
}
