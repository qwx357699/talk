const $ = function (selector) {
  return document.querySelector(selector);
}
const $$ = (selector) => document.querySelectorAll(selector);
const $$$ = (tagName) => document.createElement(tagName);