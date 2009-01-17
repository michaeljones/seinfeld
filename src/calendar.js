
function daysInMonth( month )
{
	if ( month == 0 )
		return 31;
}


function drawTable()
{
	document.write("Table")
}

function today()
{
	var date = new Date();
	var first_day = new Date( date.getFullYear(), date.getMonth(), 1 );
	
	var start = first_day.getDay();
	var id = "#day_0_" + start;

	var week = 0;
	var day = start;
	var dayOfMonth = 1;
	var today = date.getDate();

	while ( week < 5 )
	{
		while ( day < 7 )
		{
			var id = "#day_" + week + "_" + day;
			$(id).html("<a href='#'>" + dayOfMonth + "</a>");
			$(id + " a").click(function(){
					$(id).css("background-color", "#990000")
					});
			day += 1;
			dayOfMonth += 1;

			if ( dayOfMonth == today )
			{
				$(id).css("border","3px solid red");
			}
		}

		day = 0;

		week += 1;
	}
}

