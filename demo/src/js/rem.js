// slideDown
  var $slideDown = function(x){
  var h = x.children[0].offsetHeight ;
    x.style.height = h+'px';
      x.style.opacity = '1' ;
  }
// slideUp
  var $slideUp = function(x){
    x.style.height = '0px';
    x.style.opacity = '0' ;
  };

(function(doc, win) {

	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function() {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) return;
			docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
		};
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	// DOMContentLoaded 仅当dom加载完毕执行
	doc.addEventListener('DOMContentLoaded', recalc, false); 

})(document, window);

