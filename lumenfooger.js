var WORKSHOP_SELECTED = -1;
var WORKSHOP_ROT_FRAMES = [];
var WORKSHOP_COL_FRAMES = [];
var LIVE_ROT_FRAMES = [];
var LIVE_COL_FRAMES = [];
var LED_CHANNEL_1 = 0;

var ping = new io.connect('http://' + window.location.host);

// Establish event handlers
ping.on('disconnect', function() {
    ping.socket.reconnect();
});

function sendDMX(id, msg){
  ping.emit('responder', id, msg, function(response) {
    $('#responder').html('Response: ' + response);
  });
}

function sendDMXArray(data){
  ping.emit('getDMXArray', data, function(response) {});
}

function sendDMXTween(channel, startVal, endVal, length){
  ping.emit('getDMXTween', channel, startVal, endVal, length, function(response) {});
}

function sendDMXTweenArray(channels, startVals, endVals, lengths){
  ping.emit('getDMXTweenArray', channels, startVals, endVals, lengths, function(response) {});
}

$(window).load(function() {
	//trash button
	$("#trash").click( function(){
		if ( WORKSHOP_SELECTED==-1 ) {
			if ( confirm("Delete ALL slots in template?") ){
				deleteAllTemplate();
			}
		}
		else {
			deleteSelectedBlock();
		}
	});
	
	//fade button
	$("#fade").click( function(){
		if ( WORKSHOP_SELECTED==-1 ) {
			alert("You must first select a block element to apply fadeout!");
		}
		else {
			applyFadeToSelected();
			updateWorkshopView();
		}
	});
	
	//blend button
	$("#blend").click( function(){
		if ( WORKSHOP_SELECTED==-1 ) {
			alert("You must first select a block element to apply blend!");
		}
		else {
			if ( $(".selected").hasClass("rotation") ) {
				alert("Blend can only be applied to colors, not rotations.");
			}
			else {
				applyBlendToSelected();
			}
		}
	});

	//components
	$(".toolbox .desc").each( function( idx, elem ){
		$(elem).click(function(){
			if ( WORKSHOP_SELECTED==-1 ) {
				appendToTemplate(elem);
				updateWorkshopView();
			}
			else {
				swapTemplateBlock(elem);
			}
		});
	});
	
	channelStates = [0, 0, 0, 0];
	StartChannel = 15;

	//enter push to live
	$(document).keypress(function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
		//alert(keycode);
		if( keycode=='13'){
			pushToLive();
		}

		//Space bar sync
		else if (keycode=='32') {
			beatSync();
		}

		//STEPPER
		else if (keycode=='122') {
			beatStep();
		}
		
		
		//WHAT ARE YOU?!
		//Toggle channels - asdf
		else if ( keycode=='97' || keycode=='115' || keycode=='100' || keycode=='102' ) {
			switch(parseInt(keycode)){
				case 97:
					channelStates[0] = 1-channelStates[0];
					sendDMX(StartChannel, 255*channelStates[0]);
					break;
				case 115:
					channelStates[1] = 1-channelStates[1];
					sendDMX(StartChannel+1, 255*channelStates[1]);
					break;
				case 100:
					channelStates[2] = 1-channelStates[2];
					sendDMX(StartChannel+2, 255*channelStates[2]);
					break;
				case 102:
					channelStates[3] = 1-channelStates[3];
					sendDMX(StartChannel+3, 255*channelStates[3]);
					break;
			}
		}
		

		//RED BLINKER
		else if ( keycode=='113' ) {
			deleteAllTemplate();
			$("[name='+slow']").click();
			$("[name='-fast']").click();
			$("[name='+med']").click();
			$("[name='-slow']").click();
			$("[name='+ultra']").click();
			$("[name='-med']").click();
			$("[name='jitter']").click();
			$("[name='col1']").click();
			$("#workshop_col").children().first().children().first().click();
			applyFadeToSelected();
		}
		//BLUE-GREEN CYCLE
		else if ( keycode=='119' ) {
			deleteAllTemplate();
			$("[name='+slow']").click();
			$("[name='+fast']").click();
			$("[name='+slow']").click();
			$("[name='+ultra']").click();
			$("[name='stop']").click();
			$("[name='jitter']").click();
			$("[name='-ultra']").click();
			$("[name='-slow']").click();
			$("[name='stop']").click();
			
			$("[name='col7']").click();
			$("[name='col7']").click();
			$("[name='col4']").click();
			$("[name='col4']").click();
			$("[name='col7']").click();
			$("[name='col4']").click();
			
			$($("#workshop_col").children()[1]).children().first().click();
			applyBlendToSelected();
			$($("#workshop_col").children()[3]).children().first().click();
			applyBlendToSelected();
			$($("#workshop_col").children()[4]).children().first().click();
			applyBlendToSelected();
			$($("#workshop_col").children()[5]).children().first().click();
			applyBlendToSelected();
		}
		//HUE BLEND
		else if ( keycode=='101' ) {
			deleteAllTemplate();
			$("[name='col1']").click();
			$("[name='col2']").click();
			$("[name='col3']").click();
			$("[name='col4']").click();
			$("[name='col7']").click();
			$("[name='col8']").click();

			$($("#workshop_col").children()[0]).children().first().click();
                        applyBlendToSelected();
                        $($("#workshop_col").children()[1]).children().first().click();
                        applyBlendToSelected();
                        $($("#workshop_col").children()[2]).children().first().click();
                        applyBlendToSelected();
                        $($("#workshop_col").children()[3]).children().first().click();
                        applyBlendToSelected();
			$($("#workshop_col").children()[4]).children().first().click();
                        applyBlendToSelected();
                        $($("#workshop_col").children()[5]).children().first().click();
                        applyBlendToSelected();

			$("[name='auto']").click();
		}
                //PURPLE SHIFT
                else if ( keycode=='114' ) {
               		deleteAllTemplate();
			$("[name='+slow']").click();
			$("[name='-fast']").click();
			$("[name='+med']").click();
			$("[name='-ultra']").click();
			$("[name='jitter']").click();

			
			$("[name='col1']").click();
			$("[name='col8']").click();
			$("[name='col8']").click();
			$("[name='col7']").click();

			$($("#workshop_col").children()[0]).children().first().click();
                        applyBlendToSelected();
                        $($("#workshop_col").children()[1]).children().first().click();
                        applyBlendToSelected();
                        $($("#workshop_col").children()[2]).children().first().click();
                        applyBlendToSelected();
                        $($("#workshop_col").children()[3]).children().first().click();
                        applyBlendToSelected();	

                }
                //HEAVEN
                else if ( keycode=='116' ) {
                	deleteAllTemplate();
			$("[name='auto']").click();

			$("[name='col6']").click();
			$("[name='col9']").click();
			$("[name='col8']").click();
			$("[name='aut7']").click();
			                        
			$($("#workshop_col").children()[0]).children().first().click();
                        applyBlendToSelected();
                        $($("#workshop_col").children()[1]).children().first().click();
                        applyBlendToSelected();
                        $($("#workshop_col").children()[2]).children().first().click();
                        applyBlendToSelected();
                        $($("#workshop_col").children()[3]).children().first().click();
                        applyBlendToSelected();  
                }
                //HELL
                else if ( keycode=='121' ) {
                	deleteAllTemplate();
			$("[name='auto']").click();

			$("[name='col1']").click();
			$("[name='col3']").click();

			$($("#workshop_col").children()[0]).children().first().click();
                        applyBlendToSelected();
                        $($("#workshop_col").children()[1]).children().first().click();
                        applyBlendToSelected();
                }
                //FOREST
                else if ( keycode=='117' ) {
			deleteAllTemplate();
			$("[name='+ultra']").click();
			$("[name='-ultra']").click();
			$("[name='+ultra']").click();
			$("[name='-ultra']").click();
			$("[name='auto']").click();
			$("[name='auto']").click();
			$("[name='auto']").click();
			$("[name='auto']").click();
			$("[name='auto']").click();

			$("[name='col10']").click();
			$("[name='col9']").click();
                	$("[name='col4']").click();
			$("[name='col5']").click();

                        $($("#workshop_col").children()[0]).children().first().click();
                        applyBlendToSelected();
                        $($("#workshop_col").children()[1]).children().first().click();
                        applyBlendToSelected();
                        $($("#workshop_col").children()[2]).children().first().click();
                        applyBlendToSelected();
                        $($("#workshop_col").children()[3]).children().first().click();
                        applyBlendToSelected();                  
		  }
                //SWATCHER
                else if ( keycode=='105' ) {
                        deleteAllTemplate();
			$("[name='+ultra']").click();
			$("[name='-fast']").click();
			$("[name='+slow']").click();
                        
                        $("[name='col10']").click();
                        $("[name='col5']").click();
                        $("[name='col9']").click();
                        $("[name='col5']").click();
                }

		updateWorkshopView();
		WORKSHOP_SELECTED = -1;
		$(".selected").each(function(idx,elem){$(elem).removeClass("selected");});
	});
	
	//timer
	setInterval("timeSync()",25);
	
});

function pushToLive() {
	no_advance = false;

	if ( WORKSHOP_ROT_FRAMES.length==0 || WORKSHOP_COL_FRAMES.length==0 )
		return;

	//visual fix
	var LRS = $("#live_rot").children();
	var LCS = $("#live_col").children();
	for ( var i = 0; i < 12; i++ ) {
		$(LRS[i]).html("");
		$(LCS[i]).html("");
	}


	PTR_ROT = 0;
	PTR_COL = 0;
	prev_time = (new Date()).getTime();
	drawBeatPtrs();
	WORKSHOP_SELECTED = -1;
	$(".selected").removeClass("selected");
	//push!
	LIVE_ROT_FRAMES = WORKSHOP_ROT_FRAMES.slice();
	for ( var i = 0; i < WORKSHOP_ROT_FRAMES.length; i++ ) {
		$(LRS[i]).html(WORKSHOP_ROT_FRAMES[i][3]);
		$($(LRS[i]).children()[0]).unbind('click');
	}
	LIVE_COL_FRAMES = WORKSHOP_COL_FRAMES.slice();
	for ( var i = 0; i < WORKSHOP_COL_FRAMES.length; i++ ) {
		$(LCS[i]).html(WORKSHOP_COL_FRAMES[i][3]);
		$($(LCS[i]).children()[0]).unbind('click');
	}
	deleteAllTemplate();
}

var prev_sync = 0;
var avg_bpm;
var bpm_data = [120,120,120,120,120,120,120,120];
function beatSync() {
	no_advance = false;
	var d = new Date();
	var time = d.getTime();
	if ( time-prev_sync<=2000 ) {
		// this -5 accounts for human lag sync.  This may very per person but I'm not sure...
		var gap = time-prev_sync-5;
		var bpm = 1000.0*60.0/gap;

		var net = 0;
		for ( var q = 0; q < bpm_data.length; q++ ) {
			net += bpm_data[q];
		}
		net /= bpm_data.length;

		var epsilon = Math.abs(net-BPM);
		var alpha = 0.7;
		if ( epsilon>15 ) {
			net = bpm;
		}

		avg_bpm = net;//BPM*alpha + (1.0-alpha)*net;
		bpm_data.splice(0,1);
		bpm_data.push(bpm);

		$("#tune_bpm").val(""+avg_bpm);
	}
	prev_sync = time;
	if ( time-prev_time>100 && time-prev_time<900 )
		prev_time = time-1000.0*60.0/BPM; //sync the current downbeat
}

var no_advance = false;
var forced_beat = false;
function beatStep() {
	no_advance = true;
	$("#tune_bpm").val("90");
	forced_beat = true;
	var d = new Date();
	var time = d.getTime();
	prev_time = time-1000.0*60.0;
}

function rotateKnob( elem, deg ) {
	elem.css("transform","rotate("+deg+"deg)");
	elem.css("-ms-transform","rotate("+deg+"deg)"); /* IE 9 */
	elem.css("-moz-transform","rotate("+deg+"deg)"); /* Firefox */
	elem.css("-webkit-transform","rotate("+deg+"deg)"); /* Safari and Chrome */
	elem.css("-o-transform","rotate("+deg+"deg)"); /* Opera */
}

var PTR_ROT = 0;
var PTR_COL = 0;
var BPM = 120.0;
var LUM = 255;
var prev_time = (new Date()).getTime();
function timeSync() {
	//KNOBS
	BPM = $("#tune_bpm").val();
	if ( BPM>300 ) {
		$("#tune_bpm").val("300");
		BPM = 300;
	}
	var bpmknob = $("#BPMKNOB");
	var deg = -parseInt(Math.round((BPM-120)*2));
	rotateKnob(bpmknob,deg);
	LUM = $("#tune_lum").val();
	var lumknob = $("#LUMKNOB");
	var deg2 = -parseInt(Math.round(LUM-255));
	rotateKnob(lumknob,deg2);
	
	var d = new Date();
	var time = d.getTime();
	
	//BEAT FADE
	var perc = Math.round((1.0-(time-prev_time)/(1000.0*60.0/BPM))*40)+2;
	if ( perc<2 )
		perc = 2;
	$("#live_rot .beatlight").css("box-shadow","0px 0px "+(parseInt(perc))+"px #ff8");
	$("#live_col .beatlight").css("box-shadow","0px 0px "+(parseInt(perc))+"px #8f8");
	//
	
	
	if ( time-prev_time>=1000.0*60.0/BPM && !no_advance || forced_beat ) {
		forced_beat = false;
		while ( time-prev_time>=1000.0*60.0/BPM ) {
			prev_time += 1000.0*60.0/BPM;
		}
		if ( LIVE_ROT_FRAMES.length==0 ) {
			PTR_ROT = (PTR_ROT+1)%12;
		}
		else {
			PTR_ROT = (PTR_ROT+1)%LIVE_ROT_FRAMES.length;
		}
		////
		if ( LIVE_COL_FRAMES.length==0 ) {
			PTR_COL = (PTR_COL+1)%12;
		}
		else {
			PTR_COL = (PTR_COL+1)%LIVE_COL_FRAMES.length;
		}
		////
		drawBeatPtrs();
		triggerBeat();
	}
}

function drawBeatPtrs() {
	$(".beatlight").css("box-shadow","");
	$(".beatlight").removeClass("beatlight");
	$($("#live_rot").children()[PTR_ROT]).addClass("beatlight");
	$($("#live_col").children()[PTR_COL]).addClass("beatlight");
}

function triggerBeat() {
	var something = false;
	
	var ROT_ = 0;
	var RED_ = 0;
	var GRN_ = 0;
	var BLU_ = 0;
	var WHT_ = 0;
	var MSTR_ = parseInt(LUM);
	var PROG_ = 0;
	var MISC_ = 0;
	
	var ROT_faded = false;
	var ROT_jitter = false;
	var COL_blended = false;
	
	var ROT2_ = 0;
	var RED2_ = 0;
	var GRN2_ = 0;
	var BLU2_ = 0;
	var WHT2_ = 0;

	//get rotation params (CHANNEL 1 / CHANNEL 8)
	if ( LIVE_ROT_FRAMES.length>0 ) {
		something |= true;
		var param = LIVE_ROT_FRAMES[PTR_ROT][0];
		if ( param=="+slow" ) ROT_ = 25;
		else if ( param=="+med" ) ROT_ = 25+33;
		else if ( param=="+fast" ) ROT_ = 25+66;
		else if ( param=="+ultra" ) ROT_ = 125;
		else if ( param=="-slow" ) ROT_ = 230;
		else if ( param=="-med" ) ROT_ = 130+66;
		else if ( param=="-fast" ) ROT_ = 130+33;
		else if ( param=="-ultra" ) ROT_ = 130;
		else if ( param=="auto" ) {MISC_ = 255; PROG_ = 255;}

		ROT2_ = ROT_;
		
		var type = LIVE_ROT_FRAMES[PTR_ROT][2];
		if ( type=="fadeout" ) {
			ROT_faded = true;
			if(ROT_ <= 127) ROT2_ = 0;
			else ROT2_ = 255;
		}
		if ( param=="jitter" ) {ROT_ = 0; ROT2_ = 255; ROT_jitter = true;}
		if ( param=="stop" ) {ROT_ = 0; ROT2_ = 0;} 
	}
	
	//get color params (CHANNELS 2-5)
	if ( LIVE_COL_FRAMES.length>0 ) {
		something |= true;
		var param = LIVE_COL_FRAMES[PTR_COL][0];
		var colors = nameToColors(param);
		RED_ = colors[0];
		GRN_ = colors[1];
		BLU_ = colors[2];
		WHT_ = colors[3];
		RED2_ = RED_;
		GRN2_ = GRN_;
		BLU2_ = BLU_;
		WHT2_ = WHT_;
		
		var type = LIVE_COL_FRAMES[PTR_COL][2];
		if ( type=="fadeout" ) {
			COL_blended = true;
			RED2_ = 0;
			GRN2_ = 0;
			BLU2_ = 0;
			WHT2_ = 0;
		}
		else if ( type=="blend" ) {
			COL_blended = true;
			var colors2 = nameToColors(LIVE_COL_FRAMES[(PTR_COL+1)%(LIVE_COL_FRAMES.length)][0]);
			RED2_ = colors2[0];
			GRN2_ = colors2[1];
			BLU2_ = colors2[2];
			WHT2_ = colors2[3];
		}
	}
	
	if ( something ) {
		var length = parseInt(Math.round(0.7*60000.0/BPM));
		if(!COL_blended){
			//console.debug("{"+ROT_+","+RED_+","+GRN_+","+BLU_+","+WHT_+","+MSTR_+","+PROG_+","+MISC_+"}");
			sendDMXArray([ROT_,RED_,GRN_,BLU_,WHT_,MSTR_,PROG_,MISC_]);
		}else{
			//sendDMXTween(1, RED_, RED2_, length);
			//sendDMXTween(2, GRN_, GRN2_, length);
			//sendDMXTween(3, BLU_, BLU2_, length);
			//sendDMXTween(4, WHT_, WHT2_, length);
			
			sendDMXTweenArray([0,1,2,3,4,5], [ROT_, RED_,GRN_,BLU_,WHT_,MSTR_], [ROT2_, RED2_,GRN2_,BLU2_,WHT2_,MSTR_], [length,length,length,length,length,length]);
		}
	}
}

function nameToColors( param ) {
	var RED_ = 0; var GRN_ = 0; var BLU_ = 0; var WHT = 0;
	if ( param=="col1" ) 		{ RED_ = 255; GRN_ = 0;   BLU_ = 0;   WHT_ = 0; }
	else if ( param=="col2" ) 	{ RED_ = 255; GRN_ = 128; BLU_ = 0;   WHT_ = 0; }
	else if ( param=="col3" ) 	{ RED_ = 255; GRN_ = 255; BLU_ = 0;   WHT_ = 0; }
	else if ( param=="col4" ) 	{ RED_ = 0;   GRN_ = 255; BLU_ = 0;   WHT_ = 0; }
	else if ( param=="col5" ) 	{ RED_ = 0;   GRN_ = 0;   BLU_ = 0;   WHT_ = 0; }
	else if ( param=="col6" ) 	{ RED_ = 0;   GRN_ = 255; BLU_ = 255; WHT_ = 0; }
	else if ( param=="col7" ) 	{ RED_ = 0;   GRN_ = 0;   BLU_ = 255; WHT_ = 0; }
	else if ( param=="col8" ) 	{ RED_ = 255; GRN_ = 0;   BLU_ = 255; WHT_ = 0; }
	else if ( param=="col9" ) 	{ RED_ = 255; GRN_ = 255; BLU_ = 255; WHT_ = 255; }
	else if ( param=="col10" ) 	{ RED_ = 0;   GRN_ = 0;   BLU_ = 0;   WHT_ = 255; }
	return [RED_,GRN_,BLU_,WHT_];
}

function applyBlendToSelected() {
	var sel = $(".selected");
	if ( sel.hasClass("color") ) {
		if ( WORKSHOP_COL_FRAMES[WORKSHOP_SELECTED][2]=="blend" ) {
			sel.removeClass("blend");
			WORKSHOP_COL_FRAMES[WORKSHOP_SELECTED][2] = "normal";
		}
		else {
			sel.removeClass("fadeout");
			sel.addClass("blend");
			WORKSHOP_COL_FRAMES[WORKSHOP_SELECTED][2] = "blend";
		}
	}
	
	updateWorkshopView();
}

function updateBlendVisuals() {
	var slots = $("#workshop_col").children();
	var first_ = $($(slots[0]).children()[0]).css("background-color");
	for ( var i = 0; i < WORKSHOP_COL_FRAMES.length; i++ ) {
		if ( WORKSHOP_COL_FRAMES[i][2]!="blend" )
			continue;
		var curr_ = $($(slots[i]).children()[0]).css("background-color");
		var next_ = $($(slots[(i+1)%WORKSHOP_COL_FRAMES.length]).children()[0]).css("background-color");
		if ( (i+1)%WORKSHOP_COL_FRAMES.length==0 )
			next_ = first_;
		var block = $($(slots[i]).children()[0]);
		
		block.css("background", curr_);
		block.css("background", "-moz-linear-gradient(left,  "+curr_+" 1%, "+next_+" 100%)");
		block.css("background", "-webkit-gradient(linear, left top, right top, color-stop(1%,"+curr_+"), color-stop(100%,"+next_+"))");
		block.css("background", "-webkit-linear-gradient(left,  "+curr_+" 1%,"+next_+" 100%)");
		block.css("background", "-o-linear-gradient(left,  "+curr_+" 1%, "+next_+" 100%)");
		block.css("background", "-ms-linear-gradient(left,  "+curr_+" 1%, "+next_+" 100%)");
		block.css("background", "linear-gradient(to right,  "+curr_+" 1%, "+next_+" 100%)");
		block.css("filter", "progid:DXImageTransform.Microsoft.gradient( startColorstr='"+curr_+"', endColorstr='"+next_+"',GradientType=1 )");
	}
}

function applyFadeToSelected() {
	var sel = $(".selected");
	if ( sel.hasClass("rotation") ) {
		if ( WORKSHOP_ROT_FRAMES[WORKSHOP_SELECTED][2]=="fadeout" ) {
			sel.removeClass("fadeout");
			WORKSHOP_ROT_FRAMES[WORKSHOP_SELECTED][2] = "normal";
		}
		else {
			sel.removeClass("blend");
			sel.addClass("fadeout");
			WORKSHOP_ROT_FRAMES[WORKSHOP_SELECTED][2] = "fadeout";
		}
	}
	else if ( sel.hasClass("color") ) {
		if ( WORKSHOP_COL_FRAMES[WORKSHOP_SELECTED][2]=="fadeout" ) {
			sel.removeClass("fadeout");
			WORKSHOP_COL_FRAMES[WORKSHOP_SELECTED][2] = "normal";
		}
		else {
			sel.removeClass("blend");
			sel.addClass("fadeout");
			sel.css("background","");
			sel.css("filter","");
			WORKSHOP_COL_FRAMES[WORKSHOP_SELECTED][2] = "fadeout";
		}
	}
}

function swapTemplateBlock(elem) {
	var orig = WORKSHOP_SELECTED;
	var hasRot = $(".selected").hasClass("rotation");
	var hasCol = $(".selected").hasClass("color");
	
	if ( $(elem).hasClass("wkshp-rotation") && hasRot ) {
		var temp_rot = WORKSHOP_ROT_FRAMES.slice();
		var last = WORKSHOP_ROT_FRAMES[WORKSHOP_ROT_FRAMES.length-1];
		WORKSHOP_SELECTED = WORKSHOP_ROT_FRAMES.length-1;
		deleteSelectedBlock();
		appendToTemplate(elem);
		var swap = WORKSHOP_ROT_FRAMES[WORKSHOP_ROT_FRAMES.length-1];
		WORKSHOP_ROT_FRAMES[orig] = swap;
		if ( orig!=WORKSHOP_ROT_FRAMES.length-1 )
			WORKSHOP_ROT_FRAMES[WORKSHOP_ROT_FRAMES.length-1] = last;
	}
	else if ( $(elem).hasClass("wkshp-color") && hasCol ) {
		var temp_rot = WORKSHOP_COL_FRAMES.slice();
		var last = WORKSHOP_COL_FRAMES[WORKSHOP_COL_FRAMES.length-1];
		WORKSHOP_SELECTED = WORKSHOP_COL_FRAMES.length-1;
		deleteSelectedBlock();
		appendToTemplate(elem);
		var swap = WORKSHOP_COL_FRAMES[WORKSHOP_COL_FRAMES.length-1];
		WORKSHOP_COL_FRAMES[orig] = swap;
		if ( orig!=WORKSHOP_COL_FRAMES.length-1 )
			WORKSHOP_COL_FRAMES[WORKSHOP_COL_FRAMES.length-1] = last;
	}
	else {
		WORKSHOP_SELECTED = -1;
		$(".proto").each(function(idx,elem){
			$(elem).removeClass("selected")
		});
		appendToTemplate(elem);
	}
	
	updateWorkshopView();
}

function deleteSelectedBlock() {
	if ( $(".proto.selected").hasClass("rotation") ) {
		WORKSHOP_ROT_FRAMES.splice(WORKSHOP_SELECTED,1);
	}
	else {
		WORKSHOP_COL_FRAMES.splice(WORKSHOP_SELECTED,1);
	}
	WORKSHOP_SELECTED = -1;
	updateWorkshopView();
}

function updateWorkshopView() {
	$("#workshop_rot div").each(function(idx,elem){$(elem).html("");});
	$("#workshop_col div").each(function(idx,elem){$(elem).html("");});
	
	var temp_rot = WORKSHOP_ROT_FRAMES.slice();
	var temp_col = WORKSHOP_COL_FRAMES.slice();
	WORKSHOP_SELECTED = -1;
	WORKSHOP_ROT_FRAMES = [];
	WORKSHOP_COL_FRAMES = [];
	
	var WR = $("#workshop_rot");
	for ( var i = 0; i < temp_rot.length; i++ ) {
		appendToTemplate(temp_rot[i][1]);
		if ( temp_rot[i][2]=="fadeout" ) {
			$($(WR.children()[i]).children()[0]).addClass("selected");
			WORKSHOP_SELECTED = i;
			applyFadeToSelected();
		}
	}
	var WC = $("#workshop_col");
	for ( var i = 0; i < temp_col.length; i++ ) {
		appendToTemplate(temp_col[i][1]);
		if ( temp_col[i][2]=="blend" ) {
			$($(WC.children()[i]).children()[0]).addClass("blend");
			WORKSHOP_COL_FRAMES[i][2] = "blend";
		}
	}
	updateBlendVisuals();
	for ( var i = 0; i < temp_col.length; i++ ) {
		if ( temp_col[i][2]=="fadeout" ) {
			$($(WC.children()[i]).children()[0]).addClass("selected");
			WORKSHOP_SELECTED = i;
			applyFadeToSelected();
		}
	}
}

function deleteAllTemplate() {
	WORKSHOP_SELECTED = -1;
	WORKSHOP_ROT_FRAMES = [];
	WORKSHOP_COL_FRAMES = [];
	updateWorkshopView();
}

function appendToTemplate( elem ) {
	var workshop_rot = $("#workshop_rot");
	var workshop_col = $("#workshop_col");
	
	//div innerHtml
	var divGuts = $(elem).html();
	var SLOT = 0;
	var box = null;	


	//place in rotation bins
	if ( $(elem).hasClass("wkshp-rotation") ) {
		var frames = workshop_rot.children();
		if ( WORKSHOP_ROT_FRAMES.length==frames.length ) {
			alert("No rotation frames are left!");
			return;
		}
		box = $("<div class='rotation desc proto'>" + divGuts +"</div>");
		SLOT = WORKSHOP_ROT_FRAMES.length;
		$(frames[SLOT]).html(box);
		WORKSHOP_ROT_FRAMES.push([$(elem).attr("name"),elem,"normal",box]);
	}
	//place in color bins
	else if ( $(elem).hasClass("wkshp-color") ) {
		var frames = workshop_col.children();
		if ( WORKSHOP_COL_FRAMES.length==frames.length ) {
			alert("No color frames are left!");
			return;
		}
		box = $("<div class='color desc proto " + $(elem).attr("name") + "'>" + divGuts +"</div>");
		SLOT = WORKSHOP_COL_FRAMES.length;
		$(frames[SLOT]).html(box);
		WORKSHOP_COL_FRAMES.push([$(elem).attr("name"),elem,"normal",box]);
	}
	
	box.click( function() {
		WORKSHOP_SELECTED = -1;
		var sel = $(box).hasClass("selected");
		$(".proto").each(function(idx,elem){
			$(elem).removeClass("selected")
		});
		if ( !sel ) {
			$(box).addClass("selected");
			WORKSHOP_SELECTED = SLOT;
		}
	});
}
