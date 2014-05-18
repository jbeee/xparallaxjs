$.fn.followMe3D  = function(base2D,base3D,noMouse,move3D,moveX,moveY) {
	
var b3D = document.getElementById(base3D);
var b3DStyle = b3D.style;
var transform3D = "WebkitTransform" in b3DStyle ? "Webkit" :
        "MozTransform" in b3DStyle ? "Moz" :
            "msTransform" in b3DStyle ? "ms" : false;
			
				
	
var dX; var dY;
var pStart = $('#'+base2D).position(); 
var pX = pStart.left; var OpX = pStart.left; var minPX = parseInt(pX*0.5); var maxPX = parseInt(pX*3);
var pY = pStart.top; var OpY = pStart.top; var minPY = parseInt(pY*0.5); var maxPY = parseInt(pY*3);
var cX;
var	cY;
var craX = 0;
var craY = 0;
var craZ = 0;
var moveBusy = false;
var timer2D; var timer3D;
if(noMouse && transform3D && move3D)
{
	var thrMobT = setInterval(execMobT,1000);
	var thrMobTBusy = false;
	var ea; var eb; var eg;
	var dvcY; var dvcX; var dvcZ;
	window.addEventListener("deviceorientation", function(e) {
		ea=e.alpha; eb=e.beta; eg=e.gamma;});
		
	function execMobT()
	{
		if(!thrMobTBusy)
		{
		thrMobTBusy = true;
		dvcY = eg;
		dvcX = (-eb)*0.3;
		dvcZ = ea;
		if ((dvcZ>90)&&(dvcZ <= 180)){dvcZ= (eg - 90)*0.02;}
		else if((dvcZ>0)&&(dvcZ <= 90)){dvcZ= (eg)*0.02;}
		else {dvcZ = (eg-180)*0.02;}
		if(dvcY<-20){dvcY = -10;}
		else if(dvcY>20){dvcY = 10};
	b3DStyle[transform3D+'Transform'] = "rotateY("+(dvcY)+"deg) rotateX("+dvcX+"deg) rotateZ("+dvcZ+"deg)";
		$('#shft1').html(transform3D +"  rotateY("+(dvcY)+"deg) rotateX("+dvcX+"deg) rotateZ("+dvcZ+"deg)");		
		$('#shft2').html(transform3D +"  rotateY("+(eg)+"deg) rotateX("+eb+"deg) rotateZ("+ea+"deg)");
		
		thrMobTBusy = false;
		}
	}

}
else
{
if(transform3D){transform3D = '-'+transform3D.toLowerCase()+'-';} else {move3D = false;}
$(window).on("mouseover", function(e) {cX = Math.ceil(winW / 2.0);cY = Math.ceil(winH / 2.0);pStart = $('#'+base2D).position();pX = pStart.left; pY = pStart.top;timer2D = setInterval(update2Dpos,20);if(move3D){timer3D = setInterval(update3Dpos,20)};

});


$(window).on("mouseout", function(e) { 
	clearTimeout(timer2D); timer2D = undefined;
	clearTimeout(timer3D); timer3D = undefined;
	moveBusy = true;	
	$('#'+base2D).animate({top: OpY+"px",left: OpX+"px"}, 900,function(){moveBusy = false}); 
});

$(window).on('mousemove', function(e) {
		mpX = event.pageX ? event.pageX:event.clientX;
		mpY = event.pageY ? event.pageY:event.clientY;
       dX = mpX - cX;
       dY = mpY - cY;
    });	
}

var update3Dpos = function(){ 
        var raX =  -(dY / cY);
        var raY = (dX / cX);
		craX = follow3D(raX,craX);	
		craY = follow3D(raY,craY);
		craZ = (Math.sqrt(Math.pow(craX,2) + Math.pow(craY,2)) * 19);			
	$('#'+base3D).css(transform3D+'transform','rotate3d(' + craX+ ', ' + craY + ', 0, ' + craZ + 'deg)');
	
		
}

var update2Dpos = function () {	
		if(moveBusy){return}	
		if(moveY){			 				
			var adjDY = parseFloat((dY*moveY).toFixed(2)); 
			console.log('pY: '+ dY + '      ' + moveY);
			pY = follow2D(adjDY,pY,minPY,maxPY)};			
		if(moveX){
			var adjDX = parseFloat((dX*moveX).toFixed(2));
			pX = follow2D(adjDX,pX,minPX,maxPX)}; 
			         
        $('#'+base2D).css({top: pY+"px",left: pX+"px"}); 
    }
	
	
function follow2D(adjD,p,minP,maxP)
{
		var speed, distance;		
        distance = parseFloat((Math.abs(adjD - p)).toFixed(2));
		if(distance < 0){return;}		
        if (distance < 1) {
            p = adjD;
        }
        else {
            speed = Math.round( distance/50, 0 );
            p = (p < adjD) ? p + speed : p - speed;
        }
		if(p < minP){p = minP;}
		if(p > maxP){p = maxP;}
		
		return p;
} 


function follow3D(raN,raO)
	{
		var speed, distance;
        distance = parseFloat((Math.abs(raN - raO)));
		speed = parseFloat((distance /20));		
            raO = (raO < raN) ? raO + speed : raO - speed;
		return raO;		
	}
		
}

$('#shftCM').followMe3D('shftPos','shft0',false,true,0,0);