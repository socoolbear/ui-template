$(document).ready(function() {
  $("#startDate").datepicker( 
    {  
	  dayNamesMin : ['일','월','화','수','목','금','토'],
	  monthNamesShort : ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
	  changeMonth : true,
	  changeYear : true,
	  dateFormat : 'yy-mm-dd',
	  autoSize : true,
	  onSelect : function (dateText, inst) {
    	var startDate = $(this).datepicker("getDate");
    	$("#endDate").datepicker("option", "minDate", startDate);
      }
	  //maxDate: '+1m +1w +1d',
	  //minDate: new Date(2011, 0, 1)
    }
  );
  $("#endDate").datepicker(
    {  
	  dayNamesMin : ['일','월','화','수','목','금','토'],
	  monthNamesShort : ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
	  changeMonth : true,
	  changeYear : true,
	  dateFormat : 'yy-mm-dd',
	  autoSize : true,
	  onSelect : function (dateText, inst) {
    	var endDate = $(this).datepicker("getDate");
    	$("#startDate").datepicker("option", "maxDate", endDate);
      }
	  //maxDate: '+1m +1w +1d',
	  //minDate: new Date(2011, 0, 1)
    }
  );
  
  
});
