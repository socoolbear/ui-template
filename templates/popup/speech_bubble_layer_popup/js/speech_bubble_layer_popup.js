$(function () {
  /* 팝업 버튼 click 이벤트 등록  */
  $("#popup-button").click(
    function (event)  {
	  var speech_bubble_div = $(".speech-bubble-div");
	  if (eval(event.target.value) == 1) {
		speech_bubble_div.hide();
	    event.target.value = 0;
	  }
	  else {
		speech_bubble_div.show();
		event.target.value = 1;
	  }
	}
  );
  
  /* 팝업 close 이벤트 등록  */
  $(".popup-close-anchor").click(
    function (event) {
      var speech_bubble_div = $(".speech-bubble-div");
      speech_bubble_div.hide();
      $("#popup-button").attr("value", 0);
    }
  );
});
