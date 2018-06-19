$(function () {
  /* 팝업 버튼 click 이벤트 등록  */
  $("#popup-button").click(
    function (event)  {
	  var pop_content = $(".pop-content");
	  if (eval(event.target.value) == 1) {
	    pop_content.hide();
	    event.target.value = 0;
	  }
	  else {
		pop_content.show();
		event.target.value = 1;
	  }
	}
  );
  
  /* 팝업 close 이벤트 등록  */
  $(".popup-close-anchor").click(
    function (event) {
      var pop_content = $(".pop-content");
      pop_content.hide();
      $("#popup-button").attr("value", 0);
    }
  );
  
  /* Drag & Drop 이벤트 등록 title-bar 를 클릭 했을 때만 활성화 됨.*/
  $(".pop-content-header").mousedown(
	function () {
	  $(".pop-content").draggable({ disabled : false });
	}
  );
  $(".pop-content-header").mouseup(
	function () {
	  $(".pop-content").draggable({ disabled : true });
	}
  );
  
});
