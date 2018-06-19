function switching_left_side_bar() {
  var left_side_bar = $("#left-side-bar");
  var content = $("#content");
  var className = left_side_bar.attr("class");
  if (className == "left-side-bar open") {
	left_side_bar.attr("class","left-side-bar close");
	content.css("margin-left","47px");
  }
  else {
	left_side_bar.attr("class","left-side-bar open");
	content.css("margin-left","187px");
  }
  
}