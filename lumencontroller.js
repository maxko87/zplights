var PX = 0.5;
var PY = 0.5;

var ROT_ = 0;
var RED_ = 0;
var GRN_ = 0;
var BLU_ = 0;
var WHT_ = 0;
var MSTR_ = 255;//parseInt(LUM);
var PROG_ = 0;
var MISC_ = 0;


// var ping = new io.connect('http://' + window.location.host);

// ping.on('disconnect', function() {
//     ping.socket.reconnect();
// });

// function sendDMX(id, msg){
//   ping.emit('responder', id, msg, function(response) {
//     $('#responder').html('Response: ' + response);
//   });
// }

// function sendDMXArray(data){
//   ping.emit('getDMXArray', data, function(response) {});
// }

$(document).ready( function() {
	$(document).mousemove( function(evt) {
		var width = $(document).width();
		var height = $(document).height();
		var px = evt.pageX/width;
		var py = evt.pageY/height;
		PX = px;
		PY = py;
		var samp = getRGBW(px,py);
		var r = Math.round(samp[0]);
		var g = Math.round(samp[1]);
		var b = Math.round(samp[2]);
		var w = Math.round(samp[3]);
		$("body").css("background-color","rgb("+r+","+g+","+b+")");
		RED_ = parseInt(r);
		BLU_ = parseInt(b);
		GRN_ = parseInt(g);
		WHT_ = parseInt(w);
		sendSignal(RED_,GRN_,BLU_,WHT_,ROT_);
	});

	$(document).keydown(function(e) { //rotations
		var mid  = 128;

		var code = (e.keyCode ? e.keyCode : e.which);

		if(code == 81) { //q (fast left)
			rot = mid-100;
	 	}
	 	else if(code == 69) { //e (fast right)
			rot = mid+100;
	 	}
	 	else if(code == 65) { //a (medium left)
			rot = mid-60;
	 	}
	 	else if(code == 68) { //d (medium right)
			rot = mid+60;
	 	}
	 	else if(code == 90) { //z (slow left)
			rot = mid-30;
	 	}
	 	else if(code == 67) { //c (slow right)
			rot = mid+30;
	 	}
	 	else if(code == 87 || code == 83 || code == 88) { //w, s, or x (stop)
			rot = 0;
	 	}
	 	ROT_ = rot;
	 	sendSignal(RED_,GRN_,BLU_,WHT_,ROT_);
	});
});


function DMXtransmit() {
	var rgbw = getRGBW(PX,PY);
}

function getRGBW(a,b) {
	var red = (decay(a,b,0,0));
	var blue = (decay(a,b,1,0));
	var white = (decay(a,b,0,1));
	var green = (decay(a,b,1,1));
	red = clip(red);
	blue = clip(blue);
	green = clip(green);
	white = clip(white);
	return [red,green,blue,white];
}

function clip( a ) {
	if ( a<0 ) a = 0;
	if ( a>1 ) a = 1;
	return a*255;
}

function decay(a,b,x,y) {
	var d = (a-x)*(a-x)+(b-y)*(b-y);
	return Math.exp( - 9.45*Math.pow(d,2) );
}

function sendSignal(r,g,b,w,rot){
	
	ROT_ = rot;
	RED_ = r;
	GRN_ = g;
	BLU_ = b;
	WHT_ = w;
	MSTR_ = 255;//parseInt(LUM);
	PROG_ = 0;
	MISC_ = 0;
	
	ROT_faded = false;
	ROT_jitter = false;
	COL_blended = false;
	
	$("#console").html("signal sent: "+ROT_+" "+RED_+" "+GRN_+" "+BLU_+" "+WHT_);
	//sendDMXArray([ROT_,RED_,GRN_,BLU_,WHT_,MSTR_,PROG_,MISC_]);

}




