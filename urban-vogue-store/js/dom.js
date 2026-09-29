export const $ = (selector, ctx = document) => ctx.querySelector(selector);
export const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];
