function switching_left_side_bar() {
  var left_side_bar = $("#left-side-bar");
  var container = $("#container");

  var className = left_side_bar.attr("class");
  if (className == "left-side-bar open") {
	left_side_bar.attr("class","left-side-bar close");
	container.css("padding-left","57");
  } 
  else {
	left_side_bar.attr("class","left-side-bar open");
	container.css("padding-left","200");
  }
}

function switching_right_side_bar() {
  var right_side_bar = $("#right-side-bar");
  var container = $("#container");

  var className = right_side_bar.attr("class");
  if (className == "right-side-bar open") {
	right_side_bar.attr("class","right-side-bar close");
	container.css("padding-right","57");
  } 
  else {
	right_side_bar.attr("class","right-side-bar open");
	container.css("padding-right","200");
  }
}