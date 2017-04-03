
var userName = '';
var userType = '';
var roomId = '';
var roomTitle = '';
var topicIntro = '';


$(function () {

    console.log('o' + getCookie('roomId'));
    if (getCookie('code') == 'createRoom') {
        userName = getCookie('userName');
        userType = 0;
        roomId = getCookie('roomId');
        roomTitle = getCookie('roomTitle');
        topicIntro = getCookie('topicIntro');
    } else {
        userName = getCookie('userName');
        userType = 1;
        roomId = getCookie('roomId');
    }
    requestMapStatus(roomId, userName);
    // initMindMap();
    initRoom();
    
    function getCookie(cname) {
        var ss = document.cookie;
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0)
                return c.substring(name.length, c.length);
        }
        return "";
    }
})


function initRoom(){
    //info div点击按钮隐藏功能
    var hiddeBtns = document.querySelectorAll(".info-div-btn");
    for(var n=0;n<hiddeBtns.length;n++){
        hiddeBtns[n].onclick = function(e){
            var btn = e.target;
            var infoDiv = btn.parentNode;
            if(btn.classList.contains("info-div-btn-hidde")){
                //点击时info div处于隐藏状态
                btn.classList.remove("info-div-btn-hidde");
                infoDiv.style.right = "40px";
                infoDiv.style.opacity = "1.0";
                btn.style.transform = "";
            }else{
                //点击时info div处于非隐藏状态
                btn.classList.add("info-div-btn-hidde");
                infoDiv.style.right = "-22%";
                infoDiv.style.opacity = "0.7";
                btn.style.transform = "rotate(180deg)";
            }
        }
    }
    addNotice("邀请同伴加入吧~");
}
