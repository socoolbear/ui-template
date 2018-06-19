$(function () {
  $("#modal-close-button").click(function () {
	var modal_widnow = $("#modal-window");
	modal_widnow.css("display", "none");
  });
  $("#modal-open-button").click(function () {
	var modal_widnow = $("#modal-window");
	modal_widnow.css("display", "block");
  });
});