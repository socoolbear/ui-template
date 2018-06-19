$(function () {
  /* 팝업 버튼 click 이벤트 등록  */
  $("#popup-button").click(
    function (event)  {
	  var pop_wrap = $("#pop-wrap");
	  if (eval(event.target.value) == 1) {
	    pop_wrap.hide();
	    event.target.value = 0;
	  }
	  else {
		pop_wrap.show();
		event.target.value = 1;
	  }
	}
  );
  
  /* 팝업 close 이벤트 등록  */
  $(".popup-close-anchor").click(
    function (event) {
      var pop_wrap = $("#pop-wrap");
      pop_wrap.hide();
      $("#popup-button").attr("value", 0);
    }
  );
});
