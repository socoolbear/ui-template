$(function () {
  var select = $(".select");
  select.click(function () {
	$(this).toggleClass("open");
  });
  
  var select_a_list = $(".select > ul.select-a-list > li > a");
  select_a_list.click(function () {
	var v = $(this).text();
	var selected_value = $(".selected-value");
	selected_value.text(v);
	selected_value.addClass('selected');
	
	$(".select > ul.select-a-list > li > a").css("font-weight", "normal");
	$(this).css("font-weight", "bold");
  });
  
  $("*:not('div.select')").focus(function(){
    $('.select-a-list').parent('.select').removeClass('open');
  });
  
});