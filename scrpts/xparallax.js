
function fixedWorks ()   ///// relies on position:fixed, modernizer check, polyfill necessary if !fixedWorks()
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




////////////////////////////////////////////////////////////////////////////// PARALLAX FUNCTIONS
$.xParallax  = function(sel) {
getUserDims();
var currentPage = 0;
var pPages = []
function pPage(pw,pt,pe,id)
{
	this.percentWidth = pw;
	this.pageTitle = pt;
	this.parentElement = pe;
	this.id = id;
}

pPages[0]= new pPage(1.1,'pagezero','#s2','#p0');
pPages[1]= new pPage(1,'pageone','#s2','#p1');
pPages[2]= new pPage(1.2,'pagetwo','#s2','#p2');
pPages[3]= new pPage(1.5,'pagethree','#s2','#p3');
pPages[4]= new pPage(1,'pagefour','#s2','#p4');

////////////////////////////////////////////////////////////////////////////// DEBUG
var tTest = 0; var nTest = 0;
function debugStats(msg)
{
	//$('#tTest').html($('body').scrollTop());
	
}
//////////////////////////////////////////////////////////////////////////////  DEBUG END


if(typeof sel === 'Object' && sel.length > 0) {return;}
var elements = []; var pWidth  = 0; var currY;
var ogPercent = 0;
var scrollPercent = 0;	

var pHeight = 0; var totalWidth=0;
function scrollDims()
{
	var pageH = winH*1.2;
	$('.page').css({'width':pgW+'px', 'height':pageH+'px'});
	pHeight = 0;
	for(p in pPages)
	{
		var newWidth = pgW*pPages[p].percentWidth;
		pHeight += newWidth;
		$(pPages[p].id).css({'width':newWidth+'px'});		
	}

	
	$('#s0').width(pgW*1.1);
	$('#s1').width(pgW*4);
	$('#s2').width(pHeight);
	$('body').css('height', pHeight+'px'); 
	currY = $(window).scrollTop();
		// Extract all selected elements from dom and save them into an array
	$.each(sel, function(i, val) {
	     $(val).each(function(e) {
	          var tmp = { width: $(this).width(), height: $(this).height(), el: $(this)}                
	          elements.push(tmp);                
	          if(pWidth  < tmp.width){pWidth  = tmp.width;}
	      });
	 });   

	  
	

	var newPos = 0;
	totalWidth = $(document).height()-winW;
	for(p in pPages)
	{		
		pPages[p].percentStart = newPos/totalWidth;		
		$(pPages[p].id).css({'left':newPos+'px'});
		

newPos+=$(pPages[p].id).width();		
	}	

	$('#p6').css({left:(pgW*0.8)+'px'});
	$('#p7').css({left:(pgW*2.5)+'px'});
}
        

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
	console.log(scrollPercent);
	if(!stillScrolling){stillScrolling = true; scrollUpdatetimer = setInterval(tweenScroll, sUDelay);}
}

   function autoTweenScroll(goTo) {
        var newY =(pHeight-winH)*(goTo+0.01);
		 $('html,body').animate({
          scrollTop: newY
        }, 300);
    }
	
function tweenScroll()
{
		
    var speed = parseFloat((Math.abs(scrollPercent - ogPercent) * 0.1).toFixed(4));
	if(speed == 0.0000){finishScroll(); return;}
    if(ogPercent <= scrollPercent){ogPercent += speed;
	if(ogPercent > 1.0){finishScroll(); return;}}
	else{ogPercent -= speed;if(ogPercent < 0.0){finishScroll(); return;}} 
	
	updateScrollPos(ogPercent);
 	thrBusy = false;	
} 



	
function updateScrollPos(nPercent)
{
	$('#tTest').html(nPercent.toFixed(3));
	$.each(elements, function(i, el) {var pos = Math.floor((el.width - winW) * nPercent) * -1; el.el.css('left', pos);});
}


function finishScroll()
{	
	stillScrolling = false;
	 thrBusy = false;
	clearTimeout(scrollThrottletimer); clearTimeout(scrollUpdatetimer);
	scrollThrottletimer = undefined; scrollUpdatetimer = undefined;
	var curHeight=$('body').scrollTop()/$('body').height();	
	
	if(!ispopState)
	{
	  if (Modernizr.history){
			curHeight = curHeight + 0.07;
			for(p in pPages)
			{			
			p = parseInt(p);			
				if((p==0)&&(curHeight<pPages[1].percentStart))
				{
				console.log('firstPage')
					pushNewState(p);
					return;
					
				}
				else if((curHeight>=pPages[pPages.length-1].percentStart)&&(p==(pPages.length-1)))
				{
					console.log('lastPage')
					pushNewState(p);
					return;
				}
				else if((curHeight<pPages[p+1].percentStart)&&(curHeight>=pPages[p].percentStart))
				{
					pushNewState(p);
					return;
				}
			}  
      
        }
	}
	else
	{
		ispopState =false;
	}
}

function pushNewState(p)
{
  currentPage =p;	
  history.pushState('xparallax', 'xparallax', pPages[p].pageTitle);
}

  $('.navLiI').click(function(e) {
        e.preventDefault();
        var goTo = $(this).attr('href').replace('#', '');
       goToPage(goTo);
    });

 window.onpopstate = function() {
  if(event && event.state) {
 		popState();
		}
    };

 function popState()
{
	ispopState = true;
    var goTo = (location.href).substr((location.href).lastIndexOf('/') + 1);
        if (goTo.indexOf('xparallax') == -1) {
            goToPage(goTo);
     } 
     else{goToPage(0)}       
        
 }

 
	
 function goToPage(goTo)
 {
	var where = 0;
 	var thisPage = getPage('pageTitle',goTo);
	
	if(thisPage[0] != -1)
	{
		currentPage = thisPage[0];
		where =thisPage[1].percentStart;
	}
	
	autoTweenScroll(where);

 }
 
 function goPageSwipe(which)
 {
 console.log('swipe which'+currentPage+'  '+which)
	var newPage = parseInt(which) + parseInt(currentPage);
	console.log(newPage);
	if((newPage<0)||(newPage>=pPages.length))
	{
			return;
	}
	
	 autoTweenScroll(pPages[newPage].percentStart) ;
currentPage=newPage;		
	if (Modernizr.history){
        history.pushState('xparallax', 'xparallax', pPages[newPage].pageTitle);
        }
 }


 function getPage(by,val)
 {
   for(p in pPages)
 	{
 	  if (pPages[p][by]==val)
 			{
 				return [p,pPages[p]];
 			};
 	}
	return [-1,-1];
 }

 ///////////////////////////////The touch functions
 ////// checktouch
 function hastouch_test()
  {	
  	if(window.navigator.msPointerEnabled)
  	{
  		$(window).touchIt(false);
	}
	else if(('ontouchstart' in window)||(window.DocumentTouch && document instanceof DocumentTouch))
	{
		 $(window).touchIt(false);
	}
		
  }
$.fn.touchIt = function(isIE)
{
  
 var me = this;
 var tTime;
        var touchstart = !isIE ? 'touchstart': uBr < 11 ? 'MSPointerDown': 'pointerdown';
        var touchmove = !isIE ? 'touchmove': uBr < 11 ? 'MSPointerMove': 'pointermove';
        var touchcancel = !isIE ? 'touchcancel': uBr < 11 ? 'MSPointerCancel': 'pointercancel';
        var touchend = !isIE ? 'touchend': uBr < 11 ? 'MSPointerUp': 'pointerup';
        var timeTS = new Date(),
        timeTE = new Date();
        var tPos = {
            tS: new Date(),
            tE: new Date(),
            xS: 0,
            yS: 0,
            xC: 0,
            yC: 0,
            xN: 0,
            yN: 0
        };

        $(this).bind(touchstart, startTouch);

        function startTouch(event) {

            var eType = event.originalEvent.pointerType;
            if(isIE&&((eType == 4)||(eType == 'MSPOINTER_TYPE_MOUSE'))){return;};
            $('#preventSelect').css('z-index', 499);
            clearSelects();
            var t = isIE ? event.originalEvent: event.originalEvent.touches[0];
            if (tPos.tBusy) {
                return;
            }
            //var t = event.originalEvent.touches[0];
            tPos.yS = t.pageY;
            tPos.yC = t.pageY;
            tPos.xS = t.pageX;
            tPos.xC = t.pageX;
            clearTimeout(tTime);

            tTime = setTimeout(function() {
                swipeMe();
            }, 400);
            $(document).bind(touchmove, tScroll).bind(touchend, stopTScroll).bind(touchcancel, stopTScroll);
        }

        function tScroll(event) {
            clearSelects();			
            var t = isIE ? event.originalEvent: event.originalEvent.touches[0];
            var newPos = tPos.xC - t.pageX;
            tPos.yC = t.pageY;
            tPos.xC = t.pageX;
        }
        function stopTScroll() {
            $(document).unbind(touchmove).unbind(touchend).unbind(touchcancel);
        }
		
        function swipeMe() {
            var x = Math.abs(tPos.xC - tPos.xS), y = Math.abs(tPos.yC - tPos.yS);
			
            if (x < y){
			
               return;        
            } else if (x > 15) {
                //// only swipe if the timeout went off/// switch for horizontal
                if ((tPos.xC - tPos.xS) > 0)///up-left
                {
                    goPageSwipe(-1);
                } else ///down-right
                {
                   goPageSwipe(1);
                }
            }
            tPos.tBusy = false;
        };
		
	  function clearSelects() {
        if (document.selection) {
            document.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    }

}


 
 
 
$(window).on("load resize orientationchange", function(){
thrBusy = true; 	
getUserDims();
scrollDims();
thrBusy = false; 
popState();
throttleScroll();
});

hastouch_test();

};



function getUserDims()
	{
		
		winW = $(window).width();
		pgW =  winW * 1.2; 	
		winH = $(window).height();
		docW = $( document ).width();
		docH = $( document ).height();
		}


$.xParallax(['.animateScroll']);   //everything is loaded.... lets begin :)