

function debug( desc, text )
{
	$("#debug").text(desc + " " + text + "\n");
}


function Month( year, month )
{
	this.month = month;
	this.year = year;

	this.year.project.store.current_month = this;

	var dates_string = $( year.project.store.id + " div[project=" + year.project.name + "] div[year=" + year.year + "] div[month=" + month + "]" ).text();

	this.dates = dates_string.split( " " );
}


Month.prototype.toString = function()
{
	var str = "<div month='" + this.month + "'>";

		str += this.dates.join( " " );

	str += "</div>";

	return str;
};

Month.month_to_string = function( month )
{
	months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
		]

	return months[month];
};

Month.previous_month_year = function( month, year )
{
	month -= 1;

	if ( month == -1 )
	{
		year -= 1;
		month = 11;
	}

	return [ month, year ]
}

Month.next_month_year = function( month, year )
{
	month += 1;

	if ( month == 12 )
	{
		year += 1;
		month = 0;
	}

	return [ month, year ]
}





function Year( project, year )
{
	this.year = year;
	this.project = project;
	this.months = new Array();

	this.project.store.current_year = this;

	var months = $( project.store.id + " div[project=" + project.name + "] div[year=" + year + "]" ).children();

	for ( var i = 0; i < months.length; i++ )
	{
		var month = months[i].getAttribute( "month" );
		this.months.push( new Month( this, month ) );
	}
}

Year.prototype.toString = function()
{
	var str = "<div year='" + this.year + "'>\n";

	for ( var i = 0; i < this.months.length; i++ )
	{
		str += this.months[i].toString();
	}

	str += "</div>\n";

	return str;
};

function Project( store, name, _default )
{
	this.name = name;
	this._default = _default;
	this.store = store;
	this.years = new Array();

	if ( _default )
	{
		this.store.current_project = this;
	}

	var years = $( store.id + " div[project=" + name + "]" ).children();

	for ( var i = 0; i < years.length; i++ )
	{
		var year = years[i].getAttribute( "year" );
		this.years.push( new Year( this, year ) );
	}
}

Project.prototype.toString = function()
{
	var _default = "";
	if ( this._default )
		_default = " default='true'";

	var str = "<div project='" + this.name + "'" + _default + ">\n";

	for ( var i = 0; i < this.years.length; i++ )
	{
		str += this.years[i].toString();
	}

	str += "</div>\n";

	return str;
};

function Store( id )
{
	this.id = id;
	this.projects = new Array();
	this._date = new Date();
	this.current_project = null;
	this.current_year = null;
	this.current_month = null;

	var projects = $(id).children();
	var default_project = $(id + " div[default=true]").attr( "project" );

	for ( var i = 0; i < projects.length; i++ )
	{
		var project_name = projects[i].getAttribute( "project" );
		this.projects.push( new Project( this, project_name, project_name == default_project ) );
	}
}

Store.prototype.toString = function()
{

	var str = "<div id='data_store'>\n";

	for ( var i = 0; i < this.projects.length; i++ )
	{
		str += this.projects[i].toString();
	}

	str += "</div>\n";

	return str;
};

Store.prototype.create_year = function()
{
	var year = new Year( this.current_project, this._date.getFullYear() );
	this.current_project.years.push( year );
	this.current_year = year;

	return year;
};


Store.prototype.create_month = function()
{
	var month = new Month( this.current_year, this._date.getMonth() );
	this.current_year.months.push( month );

	return month;
};

function highlight( highlight_day, first_day )
{
	var week = 0;
	var day = first_day;
	var dayOfMonth = 1;

	while ( week < 5 )
	{
		while ( day < 7 )
		{
			var id = "#day_" + week + "_" + day;
			day += 1;

			if ( dayOfMonth == highlight_day )
			{
				$(id).css("border","3px solid red");
				return;
			}
			
			dayOfMonth += 1;
		}

		day = 0;
		week += 1;
	}
}

function next_month( index )
{
	var next = Month.next_month_year( store._date.getMonth(), store._date.getFullYear() );
	store._date = new Date( next[1], next[0], 1 );

	load_project( index );
}

function previous_month( index )
{
	var prev = Month.previous_month_year( store._date.getMonth(), store._date.getFullYear() );
	store._date = new Date( prev[1], prev[0], 1 );
	
	load_project( index );
}

function load_nav( index )
{
	$("#project_nav").html("");
	$("#project_nav").append("<ul id='navlist'>");

	for ( var i = 0; i < store.projects.length; i++ )
	{
		var _default = "";

		if ( i == index )
			_default = " id='current'";

		$("#project_nav #navlist").append( "<li><a " + _default + " onclick=\"load_project('" + i + "')\">" + store.projects[i].name + "</a></li>" );
	}

	$("#project_nav #navlist").append( "<li><a onclick=\"new_project()\">+</a></li>" );

	$("#project_nav").append("</ul>");
}

function load_project( index )
{
	var year = null;
	var project = store.projects[index];
	store.current_project = project;

	load_nav( index );

	for ( var y = 0; y < project.years.length; y++ )
	{
		if ( project.years[y].year == store._date.getFullYear() )
		{
			year = project.years[y];
			store.current_year = year;
		}
	}

	if ( year == null )
		year = store.create_year();

	var month = null;

	for ( var m = 0; m < year.months.length; m++ )
	{
		if ( year.months[m].month == store._date.getMonth() )
		{
			month = year.months[m];
			store.current_month = month;
		}
	}

	if ( month == null )
		month = store.create_month();

	$("#project").text( project.name );
	$("#month").text( Month.month_to_string( store._date.getMonth() ) );

	var previous = Month.previous_month_year( store._date.getMonth(), store._date.getFullYear() );
	var next = Month.next_month_year( store._date.getMonth(), store._date.getFullYear() );

	debug("prev", previous );
	debug("next", next );

	$("#previous") .html( "<a onclick='previous_month(\"" + index + "\")'>" + Month.month_to_string( previous[0] ) + "</a>"); 
	$("#next").html( "<a onclick='next_month(\"" + index + "\")'>" + Month.month_to_string( next[0] ) + "</a>" );

	display_month();

	var new_date = new Date( store._date.getFullYear(), store._date.getMonth(), 1 );
	var first_day = new_date.getDay();

	$("#calendar tr td").css("border", "3px solid #eee");

	for ( day in month.dates )
	{
		highlight( month.dates[day], first_day ); 
	}
}

var store = null;

function loadStore()
{
	store = new Store( "#data_store" );

	// default project index
	var dpi = -1;

	for ( var i = 0; i < store.projects.length; i++ )
	{
		if ( store.projects[i]._default == true )
		{
			dpi = i;
			break;
		}
	}

	if ( dpi == -1 ) return;

	load_project( dpi );
}

// Returns null if it can't do it, false if there's an error, true if it saved OK
function mozillaSaveFile(filePath,content)
{
	if(window.Components) {
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filePath);
			if(!file.exists())
				file.create(0,0664);
			var out = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
			out.init(file,0x20|0x02,00004,null);
			out.write(content,content.length);
			out.flush();
			out.close();
			return true;
		} catch(ex) {
			return false;
		}
	}
	return null;
}


function mozillaLoadFile(filePath)
{
	if(window.Components) {
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filePath);
			if(!file.exists())
				return null;
			var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
			inputStream.init(file,0x01,00004,null);
			var sInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
			sInputStream.init(inputStream);
			var contents = sInputStream.read(sInputStream.available());
			sInputStream.close();
			inputStream.close();
			return contents;
		} catch(ex) {
			return false;
		}
	}
	return null;
}

// Returns array with start and end index of chunk between given start and end marker, or undefined.
function getChunkRange( str, start, end )
{
	var s = str.indexOf(start);
	if(s != -1) {
		s += start.length;
		var e = str.indexOf(end,s);
		if(e != -1)
			return [s,e];
	}
};

// Replace a chunk of a string given start and end markers
function replaceChunk( str, start, end, sub )
{
	var r = getChunkRange( str, start, end );
	return r ? str.substring(0,r[0]) + sub + str.substring(r[1]) : str;
};

function saveFile()
{
	var filepath = document.location.toString();
	filepath = filepath.substring( 7 );

	debug("location", filepath );

	var contents = mozillaLoadFile( filepath );

	contents = replaceChunk(
			contents,
			"<!-- begin data store section -->",
			"<!-- end data store section -->",
			store.toString()
			);

	mozillaSaveFile( filepath, contents );
}

function toggle(id, _date)
{
	var on = null;
	var index = -1;

	for ( var i = 0; i < store.current_month.dates.length; i++ )
	{
		if ( store.current_month.dates[i] == _date )
		{
			on = true;
			index = i;
		}
	}

	if ( on )
	{
		$(id).css("border", "3px solid #eee");

		// Remove the entry
		store.current_month.dates.splice( index, 1 );
	}
	else
	{
		$(id).css("border", "3px solid red");

		store.current_month.dates.push( _date );
	}
}

function display_month()
{
	var date = store._date;
	var first_day = new Date( date.getFullYear(), date.getMonth(), 1 );
	
	var start = first_day.getDay();
	var id = "#day_0_" + start;

	$("#calendar tr td").html("");

	var week = 0;
	var day = start;
	var dayOfMonth = 1;
	var today = date.getDate();

	while ( week < 5 )
	{
		while ( day < 7 )
		{
			var id = "#day_" + week + "_" + day;
			$(id).html("<a onclick='toggle(\""+id+"\",\""+dayOfMonth+"\")'>" + dayOfMonth + "</a>");
			day += 1;
			dayOfMonth += 1;

			if ( dayOfMonth == today )
			{
				$(id).css("background-color","#fee");
			}
		}

		day = 0;

		week += 1;
	}
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
			$(id).html("<a onclick='toggle(\""+id+"\",\""+dayOfMonth+"\")'>" + dayOfMonth + "</a>");
			day += 1;
			dayOfMonth += 1;

			if ( dayOfMonth == today )
			{
				$(id).css("background-color","#fee");
			}
		}

		day = 0;

		week += 1;
	}
}


