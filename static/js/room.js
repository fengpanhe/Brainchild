
var userName = '';
var userType = '';
var roomId = '';
var roomTitle = '';
var topicIntro = '';


window.onload = function () {

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
};


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

    //在小尺寸屏幕上的导航栏菜单按钮功能
    var menu = document.querySelector("#menu"); 
    menu.onclick = function(e){
        var nav = menu.parentNode;
        nav.classList.toggle("expand");
        //改图标为关闭
        var icon = menu.firstChild;
        if(icon.classList.contains("fa-bars")){
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
        }else{
            icon.classList.add("fa-bars");
            icon.classList.remove("fa-times");          
        }
    };

    addNotice("邀请同伴加入吧~");

    document.querySelector("#mindmap-to-png").onclick = function(e){
        var mindmap = document.querySelector("#mindmap");
        var svg = document.querySelector("svg");
        mindmap.removeChild(svg); //不用html2canvas渲染svg元素
        var h = mindmap.ownerDocument.defaultView.innerHeight;
        var w = mindmap.ownerDocument.defaultView.innerWidth;
        mindmap.ownerDocument.defaultView.innerHeight = mindmap.offsetHeight;
        mindmap.ownerDocument.defaultView.innerWidth = mindmap.offsetWidth;
        var top = mindmap.style.top;
        var left = mindmap.style.left;
        mindmap.style.top = 0 - ideaNodeMarginTop + "px";
        mindmap.style.left = 0 + ideaNodeMarginRight + "px";
        html2canvas(mindmap,{
            // height: mindmap.offsetHeight,width: mindmap.offsetWidth})
            })
            .then(function(canvas){
                mindmap.insertBefore(svg,mindmap.firstChild);
                // HTML ELement渲染完毕
                svg.style.position = "relative";
                svg.style.width = mindmap.offsetWidth + "px";
                svg.setAttribute("width",mindmap.offsetWidth);
                svg.style.height = mindmap.offsetHeight + "px";
                svg.setAttribute("height",mindmap.offsetHeight);
                // 渲染svg元素
                canvg(canvas,svg.outerHTML,{ ignoreDimensions: true,ignoreClear: true,offsetY: -20});
                // 改回样式
                mindmap.ownerDocument.defaultView.innerHeight = h;
                mindmap.ownerDocument.defaultView.innerWidth = w;
                mindmap.style.top = top;
                mindmap.style.left = left;
                var src = canvas.toDataURL();
                window.open(src);
            });
    };
}
