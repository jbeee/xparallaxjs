xparallax.js
============
#### parallax on the x-axis
#### with tweening

- A horizontal parallax scroll derived from: http://www.pixxelfactory.net/jInvertScroll/

- but built to function more cleanly on mobile
	* touch - swipe handling
	* responsive 
		Tested With
			- Chrome w/ Touch
			
			- Chrome for Android
			
			- Android Stock
			
			- Firefox and Safari - no-touch :(
			
			- IE 11 w/Touch
			
			- Opera w/ Touch

	*HTML5 push/pop states included
			- requires serverside redirect: see the .htaccess file

- this does not use any requestAnimation Frames.	
		- because it was initially created to be completely compatable with legacy browsers
		- but it turned out that legacy browsers do not support ,,el{position:fixed},,
		- a work in progress to overcome the issue can be seen here: https://github.com/jbeee/ttpScroll.js
		- Even with the 3D element in the background, averages around 40fps



-scrollr.js and betterPar are included in this repository as reference, so that one day I can integrate some of there functionality.
