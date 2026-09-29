import { $ } from "./dom.js";

export function toggleModal(selector, show = true) {
  $(selector).classList.toggle("show", show);
  $("#overlay").classList.toggle("show", show);
}
