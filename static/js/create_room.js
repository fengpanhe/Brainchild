function initFODs(){
	var body = document.getElementsByTagName("body")[0];
	var fods = document.getElementsByClassName("float-out-div");
	var masks = document.getElementsByClassName("mask");
	var fodButtons = document.getElementsByClassName("fod-button");
	var createFODs = document.getElementsByClassName("create-fod");
	for(var i = 0;i<masks.length;i++){
		// fods[n].parentNode.removeChild(fods[n]);
		// body.insertBefore(masks[n],body.firstChild);
		// masks[n].parentNode.removeChild(masks[n]);
		// body.insertBefore(masks[n],body.firstChild);
		(function(){
			var n = i;
			// 点击遮挡区域使浮出层不可见
			masks[n].onclick = function(e){
				masks[n].style.display = "none";
				fods[n].style.display = "none";
			}
			fodButtons[n].onclick = function(e){
				// 寻找float-out-div
				masks[n].style.display = "none";
				fods[n].style.display = "none";
				// 本来该有若是不是按照结构书写情况的处理方式，偷个懒
			}
			createFODs[n].onclick = function(e){
				masks[n].style.display = "block";
				fods[n].style.display = "block";
			}
		})();
	}
}

window.onload = function(){
    initFODs();
}