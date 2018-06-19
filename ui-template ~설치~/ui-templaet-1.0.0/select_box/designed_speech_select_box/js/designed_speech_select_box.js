$(function () {
  var select_label = $(".select_label");
  select_label.click(function () {
	$(".select").toggleClass("open");
  });
  
  var items = $(".select_layer > ul > li");
  items.click(function () {
	var v = $(this).find("span").text();
	$(".select_label").find("span").text(v);
	$('.select').removeClass('open');
  });
  
  $("*:not('div.select *')").focus(function () {
	$('.select').removeClass('open');
  });
});