//<link media="only screen and (max-device-width: 480px)" href="small.css" type= "text/css" rel="stylesheet">
//<link media="only screen and (min-device-width: 481px) and (max-device-width: 1024px)" href="medium.css" type="text/css" rel="stylesheet">
//<link media="screen and (min-device-width: 1025px)" href="large.css" type="text/css" rel="stylesheet">
//<link media="print" href="print.css" type="text/css" rel="stylesheet">


function fixedWorks ()   ///// relies on position:fixed, so polyfill necessary if !fixedWorks()
 {
    var test    = document.createElement('div'),
        control = test.cloneNode(false),
        fake = false,
        root = document.body || (function () {
            fake = true;
            return document.documentElement.appendChild(document.createElement('body'));
        }());
 
    var oldCssText = root.style.cssText;
    root.style.cssText = 'padding:0;margin:0';
    test.style.cssText = 'position:fixed;top:42px'; 
    root.appendChild(test);
    root.appendChild(control);
    
    var ret = test.offsetTop !== control.offsetTop;
 
    root.removeChild(test);
    root.removeChild(control);
    root.style.cssText = oldCssText;
    alert(ret);
    if (fake) {document.documentElement.removeChild(root);}
    return ret;
};

//////Checks if IE ----> if(false) uBr = 99 else uBr = Version Number
var uBr = 99; var userBrowser = navigator.userAgent;
if (RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})").exec(userBrowser) != null){ uBr = parseFloat( RegExp.$1 );}
else if((/(iPhone|iPod|iPad)/i.test(userBrowser))){uBr=50;}



function pPages(ps,pw,pt,pe)
{
	this.percentStart = ps;
	this.percentWidth = pw;
	this.pageTitle = pt;
	this.parentElement = pe;
}

////////////////////////////////////////////////////////////////////////////// PARALLAX FUNCTIONS
$.xParallax  = function(sel) {




////////////////////////////////////////////////////////////////////////////// DEBUG
var tTest = 0; var nTest = 0;
function debugStats(msg)
{
	$('#tTest').html(msg);
	
}
//////////////////////////////////////////////////////////////////////////////  DEBUG END

var pHeight=0;
if(typeof sel === 'Object' && sel.length > 0) {return;}
var elements = []; var pWidth  = 0; var currY;
var ogPercent = 0;
var scrollPercent = 0;	


function scrollDims()
{
	pHeight = pgW*6;
	$('#s2').width(pHeight);
		// Extract all selected elements from dom and save them into an array
	$.each(sel, function(i, val) {
	     $(val).each(function(e) {
	          var tmp = { width: $(this).width(), height: $(this).height(), el: $(this)}                
	          elements.push(tmp);                
	          if(pWidth  < tmp.width){pWidth  = tmp.width;}
	      });
	 });   

	$('body').css('height', pHeight+'px');   
	currY = $(window).scrollTop();

	var posP1 = pgW*2;
	var posP2 = pgW*5;
	$('.page').css({'width':pgW+'px', 'height':winH+'px'});
	$('#p2').css({'left':posP1+'px'});
	$('#p4').css({'left':posP2+'px'});
	$('#s0').width(pgW);
	$('#s1').width(pgW*4);
	$('#s2').width(pgW*6);
}
        
scrollDims();

$(window).on('scroll', function(e) {throttleScroll();});
//////////////////////////////////////////////////////////////////////////////  throttled scroll functions
var thrBusy = false; 
var stillScrolling = false;
var scrollThrottletimer; var scrollUpdatetimer;
var sTDelay = 10; 		 var sUDelay = 10;

function throttleScroll()
{
   
   if(uBr<20){currY = $(window).scrollTop(); execScroll(); return;}
   if(thrBusy){return;}
	else
	{
		currY = $(window).scrollTop();
		clearTimeout(scrollThrottletimer);
		scrollThrottletimer = undefined;
		thrBusy = true;
		 scrollThrottletimer = setTimeout(execScroll,sTDelay);
	}	
}
     
		
function execScroll()
{
	debugStats('scrolling!')
	scrollPercent = parseFloat((currY / (pHeight - winH)).toFixed(4));
	if(!stillScrolling){stillScrolling = true; scrollUpdatetimer = setInterval(tweenScroll, sUDelay);}
}

function tweenScroll()
{
		
    var speed = parseFloat((Math.abs(scrollPercent - ogPercent) * 0.1).toFixed(4));
	if(speed == 0.0000){finishScroll(); return;}
    if(ogPercent <= scrollPercent){ogPercent += speed;
	if(ogPercent > 1.0){finishScroll(); resetPositions(); return;}}
	else{ogPercent -= speed;if(ogPercent < 0.0){finishScroll(); return;}} 
	
	updateScrollPos(ogPercent);
 	thrBusy = false;	
} 

function updateScrollPos(nPercent)
{
	$('#dTest').html((nPercent*100).toFixed(2)+' %');
	$.each(elements, function(i, el) {var pos = Math.floor((el.width - winW) * nPercent) * -1; el.el.css('left', pos);});
}

 
function finishScroll()
{	
	stillScrolling = false;
	 thrBusy = false;
	debugStats('DONE!');
	clearTimeout(scrollThrottletimer); clearTimeout(scrollUpdatetimer);
	scrollThrottletimer = undefined; scrollUpdatetimer = undefined;
}


 $('.navLiI').click(function(e) {
        e.preventDefault();
        var goTo = $(this).attr('href').replace('#p', '');
        letsGo(goTo);
        if (uBr > 9) {
           history.pushState('object or string', 'xparallax', 'demos/xparallax/page' + goTo);
        }
    });


 function letsGo(goTo)
 {
 	
 	var where =((pWidth/5)*(goTo));


 	console.log(where);
 	 window.scrollTo(0,where); 
 }

$(window).resize(function(){
getUserDims();
scrollDims();
throttleScroll();
});

};



function getUserDims()
	{
		
		winW = $(window).width();
		pgW =  winW * 1.2; 	
		winH = $(window).height();
		docW = $( document ).width();
		docH = $( document ).height();
		
	}





  
  





getUserDims();

$.xParallax(['.animateScroll']);   //everything is loaded.... lets begin :)


