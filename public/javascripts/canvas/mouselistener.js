function setMouseEvent(typeofshape)
{
	var i_shape = document.commonProperties.typeofshape;
	i_shape.value=typeofshape;
	switch (typeofshape) {
	case "line":
		document.getElementById("boardCanvas").onmousedown = startDrawLine;
		document.getElementById("boardCanvas").onmouseup = endDrawLine;
		document.getElementById("boardCanvas").onmousemove= dragLine;
		document.getElementById("boardCanvas").onmouseout= dragOutLine;
		break;
	case "text":
		document.getElementById("boardCanvas").onmousedown = startTextArea;
		document.getElementById("boardCanvas").onmouseup = settleTextArea;
		document.getElementById("boardCanvas").onmousemove= moveTextArea;
		document.getElementById("boardCanvas").onmouseout= nolistener;
		break;
	case "freehand":
		document.getElementById("boardCanvas").onmousedown = startFreehand;
		document.getElementById("boardCanvas").onmouseup = endFreehand;
		document.getElementById("boardCanvas").onmousemove= drawFreehand;
		document.getElementById("boardCanvas").onmouseout= dragOutFreehand;
		break;
	default:
		break;
	}
}

var isMouseDown=false;
var isMouseOut=false;
var point_x_old=0;
var point_y_old=0;

//line
function startDrawLine(event)
{
	isMouseDown=true;
	var i_posx = document.commonProperties.pos_x;
	var i_posy = document.commonProperties.pos_y;
	var canvasRect = event.target.getBoundingClientRect();
	i_posx.value= event.clientX - canvasRect.left;
	i_posy.value= event.clientY - canvasRect.top;
}
function endDrawLine(event)
{
	isMouseDown=false;
	var canv = document.getElementById("boardCanvas");
	var ctx = canv.getContext('2d');
	var canvasRect = event.target.getBoundingClientRect();
	var x = event.clientX - canvasRect.left;
	var y = event.clientY - canvasRect.top;
	var i_width = document.ShapeProperties.width;
	var i_color = document.ShapeProperties.color;
	var i_data  = document.commonProperties.data;

	i_data.value ="{\"end_x\":\""+x+"\",\"end_y\":\""+y+"\",\"width\":\""+i_width.value+"\",\"color\":\""+i_color.value+"\"}";
	ctx.beginPath();
	ctx.moveTo( document.commonProperties.pos_x.value, document.commonProperties.pos_y.value);
	ctx.lineTo(x, y);
    ctx.lineWidth = i_width.value;
    ctx.strokeStyle = i_color.value;
	ctx.closePath();
	ctx.stroke();

	sendPiece(i_data.value);
}
function dragLine(event)
{
	if(isMouseDown){
		var canv = document.getElementById("boardCanvas");
		var ctx = canv.getContext('2d');

		var canvasRect = event.target.getBoundingClientRect();
		var x = event.clientX - canvasRect.left;
		var y = event.clientY - canvasRect.top;
		var i_width = document.ShapeProperties.width;
		var i_color = document.ShapeProperties.color;

		ctx.beginPath();
		ctx.moveTo( document.commonProperties.pos_x.value, document.commonProperties.pos_y.value);
		ctx.lineTo(x, y);
        ctx.lineWidth = i_width.value;
        ctx.strokeStyle = i_color.value;
		ctx.closePath();
		ctx.stroke();
	}
}
function dragOutLine(event)
{
}


//text
function startTextArea(event)
{
	isMouseDown=true;
}
function settleTextArea()
{
	isMouseDown=false;
}
function moveTextArea(evt)
{
}


//freehand
function startFreehand(event)
{
	isMouseDown=true;

	var i_posx = document.commonProperties.pos_x;
	var i_posy = document.commonProperties.pos_y;
	var canvasRect = event.target.getBoundingClientRect();
	i_posx.value = event.clientX - canvasRect.left;
	i_posy.value = event.clientY - canvasRect.top;
	point_x_old = i_posx.value;
	point_y_old = i_posy.value;

	var i_data  = document.commonProperties.data;

	var width =    document.ShapeProperties.width.value;
	var color =    document.ShapeProperties.color.value;
    i_data.value ="{\"width\":\""+width+"\",\"color\":\""+color+"\",";
	if( document.ShapeProperties.shadow.value === "checked" )
	{
		var offset_X = document.ShapeProperties.offset_X.value;
	    var offset_Y = document.ShapeProperties.offset_Y.value;
	    var s_color =  document.ShapeProperties.s_color.value!=null? document.ShapeProperties.s_color.value:"#000000";
	    var blur =     document.ShapeProperties.blur.value;
		i_data.value +="\"shadow\":{\"offset_X\":\""+offset_X+"\",\"offset_Y\":\""+offset_X+"\",\"color\":\""+s_color+"\",\"blur\":\""+blur+"\"},";
	}
    i_data.value +="\"points\":[";
}
function endFreehand(event)
{
	isMouseDown=false;
	var i_data  = document.commonProperties.data;
	var canvasRect = event.target.getBoundingClientRect();
	var x = event.clientX - canvasRect.left;
	var y = event.clientY - canvasRect.top;
	i_data.value+= "{\"x\":"+parseInt(x)+",\"y\":"+parseInt(y)+"}]}";
	sendPiece(i_data.value);
}
function drawFreehand(event)
{
	if(isMouseDown){
		var canv = document.getElementById("boardCanvas");
		var ctx = canv.getContext('2d');
		var i_data  = document.commonProperties.data;

        var canvasRect = event.target.getBoundingClientRect();
		var x = event.clientX - canvasRect.left;
		var y = event.clientY - canvasRect.top;
		i_data.value += "{\"x\":"+parseInt(x)+",\"y\":"+parseInt(y)+"},";

		ctx.lineWidth = document.ShapeProperties.width.value;
        ctx.strokeStyle = document.ShapeProperties.color.value;

		ctx.beginPath();
		ctx.moveTo(point_x_old, point_y_old);
		ctx.lineTo(x, y);
		ctx.closePath();
		ctx.stroke();

		point_x_old=x;
		point_y_old=y;
	}
}
function dragOutFreehand()
{
}


function nolistener()
{
}

function sendPiece(data)
{
    var form = document.createElement( "form" );
    document.body.appendChild( form );

    var i_board_id = document.createElement( "input" );
    i_board_id.setAttribute( "type" , "hidden" );
    i_board_id.setAttribute( "name" , "piece[board_id]" );
    i_board_id.setAttribute( "value" , document.commonProperties.board.value);
    form.appendChild( i_board_id );

    var i_pos_x = document.createElement( "input" );
    i_pos_x.setAttribute( "type" , "hidden" );
    i_pos_x.setAttribute( "name" , "piece[pos_x]" );
    i_pos_x.setAttribute( "value" ,  document.commonProperties.pos_x.value);
    form.appendChild( i_pos_x );

    var i_pos_y = document.createElement( "input" );
    i_pos_y.setAttribute( "type" , "hidden" );
    i_pos_y.setAttribute( "name" , "piece[pos_y]" );
    i_pos_y.setAttribute( "value" ,  document.commonProperties.pos_y.value);
    form.appendChild( i_pos_y );

    var i_type_of_shape = document.createElement( "input" );
    i_type_of_shape.setAttribute( "type" , "hidden" );
    i_type_of_shape.setAttribute( "name" , "piece[type_of_shape]" );
    i_type_of_shape.setAttribute( "value" ,  document.commonProperties.typeofshape.value);
    form.appendChild( i_type_of_shape );

    var i_data = document.createElement( "input" );
    i_data.setAttribute( "type" , "hidden" );
    i_data.setAttribute( "name" , "piece[data]" );
    i_data.setAttribute( "value" , data);
    form.appendChild( i_data );

    form.setAttribute( "action" , "../pieces" );
    form.setAttribute( "method" , "POST" );
    form.submit();
}